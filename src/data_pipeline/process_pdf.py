from google.cloud import storage
import fitz  # pymupdf
import json
import uuid


from src.data_pipeline.embed import generate_embedding_vector
from src.data_pipeline.embed_models import EmbeddingModel, all_minilm_l6_v2
from src.data_pipeline.chunks import generate_chunks
from src.data_pipeline.utils import initialize_pinecone, upload_pinecone
from src.data_pipeline.logger import setup_logger
from src.data_pipeline.utils import store_raw_text_in_postgres, extract_raw_text_from_pdf
from src.data_pipeline.db import initialize_db, store_document, document_exists
from src.data_pipeline.models import BlockData, DocumentText
import nltk
import time 
from concurrent.futures import ThreadPoolExecutor, as_completed  
from dotenv import load_dotenv, find_dotenv 
import os 
from typing import List, Dict, Any, Optional, Tuple

logger = setup_logger(__name__)

nltk.download('punkt')

load_dotenv(find_dotenv())

client = storage.Client()
bucket_name: str = os.getenv('BUCKET_NAME', '')
# google_credentials: str = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', '')
# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_credentials



# def write_google_application_credential_file() -> None:
#     google_credentials_path = "./credentials.json"
#     if os.getenv('GOOGLE_APPLICATION_CREDENTIALS_JSON'):
#         with open(google_credentials_path, 'w') as f:
#             f.write(os.getenv('GOOGLE_APPLICATION_CREDENTIALS_JSON'))
#         logger.info(os.getenv('GOOGLE_APPLICATION_CREDENTIALS_JSON'))
#         logger.info("Google credentials JSON written to file.")
#         os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_credentials_path
        
# write_google_application_credential_file()

try:
    logger.info(f" Bucket name: {bucket_name}")
    blobs = list(client.list_blobs(bucket_name, max_results=1))
    logger.info(f"Successfully accessed bucket '{bucket_name}', found {len(blobs)} file(s)")
except Exception as e:
    logger.error(f"Failed to access GCS bucket: {str(e)}")

try:
    if initialize_db():
        logger.info("Connected to PostgreSQL successfully.")
    else:
        logger.error(" Failed to initialize DB.")
except Exception as e:
    logger.error(f" DB connection error: {str(e)}")
    

def classify_text(block_text: str) -> str:
    """
    Classifies text blocks into categories based on simple heuristics.
    
    This function uses text formatting characteristics to categorize text blocks
    into headings, subheadings, or paragraphs for hierarchical document structure.
    
    Args:
        block_text: The text string to classify
        
    Returns:
        A string representing the text type: "heading", "subheading", or "paragraph"
        
    Raises:
        TypeError: If block_text is not a string
        ValueError: If block_text is empty or contains only whitespace
    """
    # Input validation
    if not isinstance(block_text, str):
        raise TypeError(f"Expected string input, got {type(block_text).__name__}")
    
    # Handle empty or whitespace-only strings
    if not block_text or block_text.isspace():
        raise ValueError("Input text cannot be empty or contain only whitespace")
    
    # Remove leading/trailing whitespace
    block_text = block_text.strip()
    
    # For very short texts (1-2 characters), classify as paragraph by default
    if len(block_text) <= 2:
        logger.warning(f"Very short text detected: '{block_text}'. Classifying as paragraph.")
        return "paragraph"
        
    try:
        # Handle strings with just numbers or special characters
        if not any(c.isalpha() for c in block_text):
            logger.info(f"Text with no alphabetic characters detected: '{block_text}'. Classifying as paragraph.")
            return "paragraph"
            
        # Simple heuristic to classify text
        if block_text.isupper():
            return "heading"
        elif block_text.istitle():
            return "subheading"
        else:
            # Check for mixed case that might indicate a heading pattern (e.g., "SECTION 1: Title")
            if any(line.isupper() for line in block_text.split('\n')):
                logger.info(f"Mixed case with uppercase elements detected: '{block_text[:50]}...'. Classifying as heading.")
                return "heading"
            return "paragraph"
    except Exception as e:
        logger.error(f"Unexpected error during text classification: {str(e)}. Defaulting to paragraph.")
        return "paragraph"

def extract_text_and_layout_from_pdf(pdf_data: bytes) -> List[BlockData]:
    """
    Extracts text and layout information from a PDF file.
    
    This function processes a PDF file byte stream and extracts structured text blocks
    with their layout information (bounding boxes, page numbers). It also classifies 
    each text block as heading, subheading, or paragraph, and establishes parent-child 
    relationships between them to maintain the document's hierarchical structure.
    
    Args:
        pdf_data: Bytes of the PDF file to process
        
    Returns:
        A list of BlockData objects containing the extracted text blocks with their
        layout information, classification, and hierarchical relationships
        
    Raises:
        PyMuPDFError: If there's an issue opening or processing the PDF file
    """
    document = fitz.open(stream=pdf_data)  
    layout_data: List[BlockData] = []

    last_heading_id: Optional[str] = None
    last_subheading_id: Optional[str] = None

    for page_number in range(len(document)):
        logger.debug(f"Processing page {page_number + 1}")
        page = document.load_page(page_number)
        blocks = page.get_text("dict")["blocks"]

        for block in blocks:
            if "lines" in block:
                block_text: str = ""
                for line in block["lines"]:
                    for span in line["spans"]:
                        block_text += span["text"] + " "

                block_type: str = classify_text(block_text.strip())
                parent_id: Optional[str] = None

                block_id: str = str(uuid.uuid4())  

                if block_type == "heading":
                    last_heading_id = block_id
                    last_subheading_id = None  
                elif block_type == "subheading":
                    parent_id = last_heading_id
                    last_subheading_id = block_id
                elif block_type == "paragraph":
                    parent_id = last_subheading_id if last_subheading_id is not None else last_heading_id

                block_data = BlockData(
                    id=block_id, 
                    page=page_number + 1,
                    bbox=block["bbox"],
                    text=block_text.strip(),
                    type=block_type,
                    parent=parent_id
                )
                layout_data.append(block_data)

                logger.debug(f"Extracted block: {block_data}")

    document.close()
    logger.info("Finished processing PDF")

    return layout_data

def process_pdf_and_upload(bucket_name: str, file_name: str, chunk_size: int, chunk_overlap: int = 0, 
                          model: Optional[EmbeddingModel] = None) -> None:
    """
    Process a PDF file, extract text and layout, generate chunks, embed them, and upload to Pinecone.
    
    Args:
        bucket_name: GCS bucket name
        file_name: PDF file name in the bucket
        chunk_size: Maximum number of tokens per chunk (hyperparameter)
        chunk_overlap: Number of tokens to overlap between chunks (hyperparameter)
        model: Embedding model to use (hyperparameter)
    """
    logger.info(f"Starting processing for file: {file_name}")
    start_time: float = time.time() 
    try:
        client = storage.Client()
        bucket = client.get_bucket(bucket_name)
        blob = bucket.blob(file_name)
        pdf_data: bytes = blob.download_as_bytes()
        print(f"Downloaded {file_name} from GCS bucket {bucket_name}")
        
        if ".pdf" in file_name:

            layout_data: List[BlockData] = extract_text_and_layout_from_pdf(pdf_data)

            # Convert Pydantic models to dictionaries for further processing
            layout_dict_data = [block.dict() for block in layout_data]
        
            # Generate chunks and metadata
            _, metadata = generate_chunks(layout_dict_data, chunk_size, file_name, chunk_overlap)
        else:
            metadata: Dict[str, Any] = {
                                'document_name': file_name,
                                'page': 1,
                                'chunk_index': 1,
                                # 'start_token_index': 0,
                                # 'end_token_index': 0,
                                # 'parent': parent,
                                'id': 1,
                                'raw_text': pdf_data.decode('utf-8', errors='ignore'),  # Decode bytes to string
                                'children': []  # Placeholder for children, if any
                            }
            metadata = [metadata]  # Wrap in a list to match expected input format
        # print(f"Extracted metadata: {metadata}")
        # Generate embeddings from metadata
        embedding_vectors = generate_embedding_vector(metadata=metadata, model=model)
        

        # Initialize and upload to Pinecone vector database
        index = initialize_pinecone()
        for embedding_vector in embedding_vectors:
            upload_pinecone(index, embedding_vector)
        
        # Store raw text in PostgreSQL
        store_raw_text_in_postgres(file_name, pdf_data)

        logger.info(f"Processing for file {file_name} completed successfully.")
    except Exception as e:
        logger.error(f"Error processing file {file_name}: {str(e)}")
    finally:
        end_time: float = time.time() 
        total_time: float = end_time - start_time  
        logger.info(f"Total time taken for processing file {file_name}: {total_time:.2f} seconds")

def main(bucket_name=None, file_name=None, chunk_size=None, chunk_overlap=None, model=None) -> None:
    """
    Main function to process PDF files from a GCS bucket.
    Entry point for docker container
    
    This function:
    1. Loads environment variables and configuration
    2. Sets up the embedding model
    3. Initializes databases (Pinecone and PostgreSQL)
    4. Lists PDF files in the source bucket
    5. Processes each PDF file in parallel using ThreadPoolExecutor
    6. Logs processing time and results
    """
    start_time: float = time.time() 
        
    # Get chunking parameters from environment variables (HYPERPARAMETERS)
    chunk_size = int(os.getenv("CHUNK_SIZE", "256"))
    chunk_overlap = int(os.getenv("CHUNK_OVERLAP", "25"))
    
    logger.info(f"Using chunk size: {chunk_size} with overlap: {chunk_overlap}")
    
    # Create the embedding model (HYPERPARAMETER)
    model = all_minilm_l6_v2()
    
    logger.info(f"Using embedding model: {model.get_model_name()} with target dimension: {model.target_dimension}")
    
    # Initialize PostgreSQL database
    if not initialize_db():
        logger.error("Failed to initialize PostgreSQL database. Exiting.")
        return
    
    bucket_name = os.getenv('BUCKET_NAME', '')
    client = storage.Client()
    bucket = client.get_bucket(bucket_name)
    blobs = bucket.list_blobs(prefix="structured_data/")

    ## TODO: Use the given parameters to pass here to the process_pdf_and_upload function

    with ThreadPoolExecutor(max_workers=5) as executor:  
        futures = [executor.submit(
            process_pdf_and_upload, 
            bucket_name, 
            blob.name, 
            chunk_size, 
            chunk_overlap,
            model
        ) for blob in blobs]
        for future in as_completed(futures):
            try:
                future.result()
            except Exception as e:
                logger.error(f"Error in processing: {str(e)}")

    end_time: float = time.time() 
    total_time: float = end_time - start_time  
    logger.info(f"Total time taken for the entire process: {total_time:.2f} seconds")

# Entry point for docker container
if __name__ == "__main__":
    main()
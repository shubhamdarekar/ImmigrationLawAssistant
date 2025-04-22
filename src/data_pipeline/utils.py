"""
Utility functions module for the TeacherBot data pipeline.

This module provides common utility functions used throughout the pipeline,
including Pinecone vector database operations, and Google Cloud
Storage operations for file management and data persistence.
"""
import logging
import os
import numpy as np
import json
import uuid
import fitz  # pymupdf
from dotenv import load_dotenv, find_dotenv
from google.cloud import storage
from google.auth import impersonated_credentials,default
from pinecone import Pinecone
from typing import Dict, List, Any, Optional
from src.data_pipeline.models import EmbeddingVector, DocumentText
from src.data_pipeline.db import store_document, document_exists
from src.data_pipeline.logger import setup_logger

# ----------------------------------------------------
# Utility Functions
# ----------------------------------------------------

logger = setup_logger(__name__)

# ----------------------------------------------------
# Pinecone Initialization & Upload
# ----------------------------------------------------
def initialize_pinecone() -> Any:
    """
    Initializes the Pinecone client using environment variables.
    """
    api_key: str = os.getenv('PINECONE_API_KEY', '')
    index_name: str = os.getenv('PINECONE_INDEX_NAME', '')
    
    logger.info("Initializing Pinecone client.")
    pc = Pinecone(api_key=api_key)
    index = pc.Index(index_name)
    logger.info("Pinecone client initialized successfully.")
    return index

def upload_pinecone(index: Any, embedding_vector: EmbeddingVector) -> None:
    """
    Uploads an embedding vector to the Pinecone index.
    
    This function handles the upsert operation to add or update vectors
    in the Pinecone vector database.
    
    Args:
        index: The Pinecone index object
        embedding_vector: The vector embedding to upload
    """
    logger.info("Uploading embeddings to Pinecone index.")
    
    # Convert EmbeddingVector to the dictionary format expected by Pinecone
    vector_dict = {
        "id": embedding_vector.id,
        "values": embedding_vector.values,
        "metadata": embedding_vector.metadata
    }
    
    index.upsert(vectors=[vector_dict])
    logger.info("Successfully uploaded embeddings to Pinecone index.")
    print("Embeddings upload process completed successfully.")

# ----------------------------------------------------
# Google Cloud Storage Initialization & Operations
# ----------------------------------------------------
def initialize_gcp_client() -> storage.Client:
    """
    Initializes the Google Cloud Storage client.
    
    Uses the application default credentials or credentials set in the
    GOOGLE_APPLICATION_CREDENTIALS environment variable.
    
    Returns:
        A configured Google Cloud Storage client
    """
    logger.info("Initializing Google Cloud Storage client.")
    
    source_credentials,_ = default()
    
    impersonated_creds = impersonated_credentials.Credentials(source_credentials=source_credentials,
                                                                target_principal=os.getenv("TARGET_PRINCIPAL"),
                                                                target_scopes=["https://www.googleapis.com/auth/cloud-platform"],
                                                                lifetime=3600)
    client = storage.Client()
    logger.info("Google Cloud Storage client initialized successfully.")
    return client

def list_files_in_bucket(bucket_name: str) -> List[storage.Blob]:
    """
    Lists all files in the specified GCP bucket.
    
    Args:
        bucket_name: The name of the Google Cloud Storage bucket
        
    Returns:
        A list of blob objects representing files in the bucket
    """
    logger.info(f"Listing all files in bucket '{bucket_name}'.")
    client = initialize_gcp_client()
    bucket = client.get_bucket(bucket_name)
    blobs = bucket.list_blobs() 
    
    blob_list: List[storage.Blob] = []
    for blob in blobs:
        logger.info(f"Found file: {blob.name} (Size: {blob.size} bytes)")
        blob_list.append(blob)
    
    return blob_list

def upload_json_to_gcs(bucket_name: str, blob_name: str, data: Any) -> None:
    """
    Uploads a JSON object to a GCS bucket.
    
    This function serializes the provided data to JSON and uploads it
    to the specified Google Cloud Storage location.
    
    Args:
        bucket_name: The name of the GCS bucket
        blob_name: The destination path/name in the bucket
        data: The Python object to serialize and upload as JSON
    """
    client = storage.Client()
    bucket = client.get_bucket(bucket_name)
    
    json_data = json.dumps(data)
    blob = bucket.blob(blob_name)
    blob.upload_from_string(json_data, content_type="application/json")
    
    print(f"Uploaded JSON to {bucket_name}/{blob_name}")

# ----------------------------------------------------
# PostgreSQL Document Operations
# ----------------------------------------------------
def store_raw_text_in_postgres(file_name: str, pdf_data: bytes) -> bool:
    """
    Extract raw text from PDF and store it in PostgreSQL.
    
    Args:
        file_name: The name of the PDF file
        pdf_data: The raw PDF data as bytes
        
    Returns:
        True if storage successful, False otherwise
    """
    try:
        # Check if document already exists
        if document_exists(file_name):
            logger.info(f"Document {file_name} already exists in PostgreSQL database")
            return True
        
        # Extract raw text from PDF
        raw_text = extract_raw_text_from_pdf(pdf_data)
        
        # Get document title from filename
        title = os.path.splitext(os.path.basename(file_name))[0]
        
        document = fitz.open(stream=pdf_data)
        document.close()
        
        # Create document object
        document = DocumentText(
            id=str(uuid.uuid4()),
            filename=file_name,
            title=title,
            content=raw_text
        )
        
        # Store document
        success = store_document(document)
        
        if success:
            logger.info(f"Raw text from document {file_name} stored successfully in PostgreSQL database")
        else:
            logger.error(f"Failed to store raw text from document {file_name} in PostgreSQL database")
            
        return success
    except Exception as e:
        logger.error(f"Error storing raw text in PostgreSQL: {str(e)}")
        return False

def extract_raw_text_from_pdf(pdf_data: bytes) -> str:
    """
    Extract raw text from a PDF file without preserving layout information.
    
    Args:
        pdf_data: Bytes of the PDF file to process
        
    Returns:
        A string containing the raw text content of the PDF
    """
    document = fitz.open(stream=pdf_data)
    text_content = []
    
    for page_number in range(len(document)):
        page = document.load_page(page_number)
        text_content.append(f"\n\n--- Page {page_number + 1} ---\n\n")
        text_content.append(page.get_text())
    
    document.close()
    logger.info("Finished extracting raw text from PDF")
    
    return "".join(text_content)

# ----------------------------------------------------
# Main Function
# ----------------------------------------------------
def main() -> None:
    """
    Main function to demonstrate the utility functions.
    
    This function:
    1. Loads environment variables
    2. Sets up Google Cloud credentials
    3. Initializes Pinecone
    4. Creates and uploads a sample embedding vector
    5. Lists files in a GCS bucket if configured
    """
    load_dotenv(find_dotenv())
    # google_credentials: Optional[str] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    # if google_credentials:
    #     os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_credentials
    # else:
    #     logger.error("GOOGLE_APPLICATION_CREDENTIALS is not set in the environment.")

    index = initialize_pinecone()
    embedding_vector = EmbeddingVector(
        id='sample_id',
        values=np.random.rand(1536).tolist(),
        metadata={'example': 'metadata'}
    )
    upload_pinecone(index, embedding_vector)
    
    bucket_name: Optional[str] = os.getenv("BUCKET_NAME")
    if bucket_name:
        list_files_in_bucket(bucket_name)
    else:
        logger.error("BUCKET_NAME environment variable is not set.")

if __name__ == "__main__":
    main()

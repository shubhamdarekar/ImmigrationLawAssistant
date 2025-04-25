import json
from nltk import word_tokenize
import os
from src.data_pipeline.logger import setup_logger
from typing import List, Dict, Any, Optional, Tuple, Union
from src.data_pipeline.models import LayoutItem, ChunkMetadata, BlockData

logger = setup_logger(__name__)


def generate_chunks(json_data: List[Union[Dict[str, Any], BlockData]], chunk_size: int, document_name: str, chunk_overlap: int = 0) -> Tuple[List[str], List[Dict[str, Any]]]:
    """
    Extracts text from each item in the JSON data and ensures no chunk exceeds the chunk size.
    
    Args:
        json_data: List of dictionaries or BlockData objects containing text data
        chunk_size: Maximum number of tokens per chunk
        document_name: Name of the document being processed
        chunk_overlap: Number of tokens to overlap between chunks (default: 0)
        
    Returns:
        Tuple containing list of chunks and their metadata
        
    Raises:
        ValueError: If input parameters are invalid
        KeyError: If required fields are missing in json_data
        Exception: For other unexpected errors
    """
    try:
        # Validate input parameters
        if not json_data:
            logger.warning("Empty JSON data provided. Returning empty results.")
            return [], []
            
        if not isinstance(json_data, list):
            raise ValueError(f"json_data must be a list, got {type(json_data).__name__}")
            
        if not isinstance(chunk_size, int) or chunk_size <= 0:
            raise ValueError(f"chunk_size must be a positive integer, got {chunk_size}")
            
        if not isinstance(chunk_overlap, int) or chunk_overlap < 0:
            raise ValueError(f"chunk_overlap must be a non-negative integer, got {chunk_overlap}")
            
        if chunk_overlap >= chunk_size:
            logger.warning(f"chunk_overlap ({chunk_overlap}) is greater than or equal to chunk_size ({chunk_size}). Setting overlap to chunk_size/2.")
            chunk_overlap = chunk_size // 2
            
        if not document_name or not isinstance(document_name, str):
            logger.warning(f"Invalid document_name: {document_name}. Using 'unknown_document'.")
            document_name = "unknown_document"
        
        logger.info("Starting to generate chunks.")
        chunks: List[str] = []
        metadata: List[Dict[str, Any]] = []
        parent_map: Dict[str, Dict[str, Any]] = {}  
        
        # Track processed IDs to detect duplicates
        processed_ids = set()

        # Convert BlockData objects to dictionaries
        processed_data = []
        for item in json_data:
            if isinstance(item, BlockData):
                processed_data.append(item.dict())
            else:
                processed_data.append(item)

        # Initialize parent_map with all items
        for item in processed_data:
            try:
                if not isinstance(item, dict):
                    logger.error(f"Item is not a dictionary: {type(item)}")
                    continue
                    
                item_id = item.get('id')
                if not item_id:
                    logger.warning(f"Item without ID found. Generating a unique ID.")
                    item_id = f"generated_id_{len(processed_ids)}"
                    item['id'] = item_id
                
                if item_id in processed_ids:
                    logger.warning(f"Duplicate ID found: {item_id}. This may cause issues with parent-child relationships.")
                
                processed_ids.add(item_id)
                parent_map[item_id] = {'children': []}
            except Exception as e:
                logger.error(f"Error during parent_map initialization for item: {e}")
                

        for item_index, item in enumerate(processed_data):
            try:
                # Validate required fields
                if 'text' not in item:
                    logger.warning(f"Item at index {item_index} missing 'text' field. Skipping.")
                    continue
                    
                if 'page' not in item:
                    logger.warning(f"Item at index {item_index} missing 'page' field. Using default page 1.")
                    item['page'] = 1
                
                text: str = item['text']
                if not isinstance(text, str):
                    logger.warning(f"Text for item at index {item_index} is not a string. Converting to string.")
                    text = str(text)
                
                page: int = item['page']
                if not isinstance(page, int):
                    try:
                        page = int(page)
                    except (ValueError, TypeError):
                        logger.warning(f"Invalid page number for item at index {item_index}. Using default page 1.")
                        page = 1
                
                parent: Optional[str] = item.get('parent', None)  
                item_id: str = item.get('id')
                
                # Validate parent reference
                if parent is not None and parent not in parent_map:
                    logger.warning(f"Item {item_id} references non-existent parent {parent}. Setting parent to None.")
                    parent = None
                
                try:
                    tokens: List[str] = word_tokenize(text)
                except Exception as tokenize_error:
                    logger.error(f"Error tokenizing text for item {item_id}: {tokenize_error}")
                    # Fallback to simple space-based tokenization
                    tokens = text.split()
                    logger.info(f"Falling back to simple tokenization for item {item_id}")
                
                logger.debug(f"Processing item with ID: {item_id}, page: {page}, token count: {len(tokens)}")

                if len(tokens) > chunk_size:
                    logger.info(f"Text exceeds chunk size, splitting into chunks for item ID: {item_id}")
                   
                    # Calculate chunk positions with overlap
                    for i in range(0, len(tokens), max(1, chunk_size - chunk_overlap)):
                        try:
                            chunk_tokens: List[str] = tokens[i : min(i + chunk_size, len(tokens))]
                            # Reconstruct text from tokens for this chunk
                            chunk: str = " ".join(chunk_tokens)
                            
                            chunk_metadata: Dict[str, Any] = {
                                'document_name': document_name,
                                'page': page,
                                'chunk_index': len(chunks),
                                'start_token_index': i,
                                'end_token_index': min(i + chunk_size, len(tokens)) - 1,
                                'parent': parent,
                                'id': item_id,
                                'raw_text': chunk,
                                'children': [] 
                            }
                            chunks.append(chunk)
                            metadata.append(chunk_metadata)
                            
                            # Add child to parent's children list
                            if parent is not None and parent in parent_map:
                                if item_id not in parent_map[parent]['children']:
                                    parent_map[parent]['children'].append(item_id)
                        except Exception as chunk_error:
                            logger.error(f"Error creating chunk at index {i} for item {item_id}: {chunk_error}")

                else:
                    # The entire text fits within chunk_size
                    try:
                        chunk = text
                        chunk_metadata: Dict[str, Any] = {
                            'document_name': document_name,
                            'page': page,
                            'chunk_index': len(chunks),
                            'start_token_index': 0,
                            'end_token_index': len(tokens) - 1,
                            'parent': parent,
                            'id': item_id,
                            'raw_text': chunk,
                            'children': []
                        }
                        chunks.append(chunk)
                        metadata.append(chunk_metadata)

                        # Add child to parent's children list
                        if parent is not None and parent in parent_map:
                            if item_id not in parent_map[parent]['children']:
                                parent_map[parent]['children'].append(item_id)
                    except Exception as chunk_error:
                        logger.error(f"Error creating chunk for item {item_id}: {chunk_error}")
            
            except Exception as item_error:
                logger.error(f"Error processing item at index {item_index}: {item_error}")
                continue

        # Update metadata with children information from parent_map
        try:
            for meta in metadata:
                item_id = meta.get('id')
                if item_id and item_id in parent_map:
                    meta['children'] = parent_map[item_id]['children']
        except Exception as meta_error:
            logger.error(f"Error updating metadata with children information: {meta_error}")

        logger.info(f"Generated {len(chunks)} chunks from the document.")
        return chunks, metadata
        
    except Exception as e:
        logger.error(f"Unexpected error in generate_chunks: {e}")
        # Return empty results on error
        return [], []

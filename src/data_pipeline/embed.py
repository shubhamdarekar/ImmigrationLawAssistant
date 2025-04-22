"""
Embedding generation module for the TeacherBot data pipeline.

This module handles the conversion of text chunks into vector embeddings
using various embedding models. It fetches chunks from Google Cloud Storage,
generates embeddings, and prepares them for storage in vector databases.
"""
import logging
from google.cloud import storage
import json
from src.data_pipeline.logger import setup_logger
from src.data_pipeline.models import EmbeddingVector, ChunkMetadata
import numpy as np
from typing import List, Dict, Any, Optional, Union, Type
from src.data_pipeline.embed_models import EmbeddingModel, all_minilm_l6_v2

logger = setup_logger(__name__)

def generate_embedding_vector(metadata: List[Dict[str, Any]], 
                             model: Optional[EmbeddingModel] = None) -> List[EmbeddingVector]:
    """
    Generates embeddings for text chunks stored in metadata and returns them.
    
    Args:
        metadata: Metadata for the chunks, containing 'raw_text' field with the text to embed.
        model: Optional embedding model. If not provided, default SentenceTransformerModel is used.
    
    Returns:
        List of embedding vectors.
    """
    logger.info("Generating embedding vector for chunks.")
    
    if not metadata:
        raise ValueError("Metadata list cannot be empty")
    
    # Extract text chunks from metadata
    chunks = [item.get('raw_text', '') for item in metadata]
    
    # Use provided model or create default one
    if model is None:
        model = all_minilm_l6_v2()
    
    logger.info(f"Using embedding model: {model.get_model_name()}")
    embeddings = model.encode(chunks)
    
    # Get the target dimension from the model
    target_dimension: int = model.target_dimension
    embedding_vectors: List[EmbeddingVector] = []
    
    for i, embedding in enumerate(embeddings):
        if len(embedding) < target_dimension:
            embedding = np.pad(embedding, (0, target_dimension - len(embedding)), 'constant')
        
        parent = metadata[i].get('parent', None)
        if parent is None:
            parent = ""
        
        embedding_vector = EmbeddingVector(
            id=metadata[i].get('id', ''),
            values=embedding.tolist(),
            metadata={**metadata[i], 'parent': parent}
        )
        embedding_vectors.append(embedding_vector)
        logger.debug(f"Generated embedding vector: {embedding_vector}")
    
    return embedding_vectors

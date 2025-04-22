"""
TeacherBot Data Pipeline package.

This package provides functionality for processing PDF documents, 
extracting text, chunking content, creating embeddings, and building 
a knowledge base for retrieval-augmented generation (RAG) applications.
""" 

from .embed import generate_embedding_vector
from .embed_models import EmbeddingModel, all_minilm_l6_v2
from .chunks import generate_chunks
from .utils import upload_json_to_gcs, initialize_pinecone, upload_pinecone
from .utils import setup_logger
from .models import BlockData
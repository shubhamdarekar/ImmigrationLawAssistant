"""
Common Pydantic models used throughout the TeacherBot data pipeline.

This module centralizes all data models to improve maintainability and ensure
consistency across the codebase. These models are used for data validation,
serialization/deserialization, and providing type information.
"""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

# Models from chunks.py
class LayoutItem(BaseModel):
    """
    Represents a single item in a document layout.
    
    Used to store information about text blocks extracted from PDFs,
    including their position, content, and hierarchical relationship.
    """
    id: str  # Unique identifier for the layout item
    page: int  # Page number where the item appears
    bbox: List[float]  # Bounding box coordinates [x0, y0, x1, y1]
    text: str  # The text content of the item
    type: str  # Type of the layout item (e.g., "paragraph", "heading", "list")
    parent: Optional[str] = None  # ID of the parent item, if any

class ChunkMetadata(BaseModel):
    """
    Metadata for a single text chunk created from document processing.
    
    Stores information about chunk origins, position within the document,
    and hierarchical relationships to enable accurate retrieval and context
    reconstruction.
    """
    document_name: str  # Source document name
    page: int  # Page number where the chunk appears
    chunk_index: int  # Index of the chunk within the document
    start_token_index: int  # Starting token index within the original text
    end_token_index: int  # Ending token index within the original text
    parent: Optional[str] = None  # ID of the parent item, if any
    id: Optional[str] = None  # Unique identifier for the chunk
    raw_text: str  # The actual text content of the chunk
    children: List[str] = Field(default_factory=list)  # IDs of child items, if any

# Model from utils.py
class EmbeddingVector(BaseModel):
    """
    Represents a vector embedding of a text chunk with its metadata.
    
    Used for storing and retrieving text embeddings in vector databases
    like Pinecone, enabling semantic search functionality.
    """
    id: str  # Unique identifier for the embedding
    values: List[float]  # The embedding vector values
    metadata: Dict[str, Any]  # Additional information about the embedding

# Model from process_pdf.py
class BlockData(BaseModel):
    """
    Represents a block of text extracted from a PDF document.
    
    Used during the initial PDF processing phase to capture raw
    text blocks before they are transformed into chunks.
    """
    id: str  # Unique identifier for the block
    page: int  # Page number where the block appears
    bbox: List[float]  # Bounding box coordinates [x0, y0, x1, y1]
    text: str  # The text content of the block
    type: str  # Type of the block (e.g., "text", "title", "figure caption")
    parent: Optional[str] = None  # ID of the parent block, if any 

# Model for PostgreSQL document storage
class DocumentText(BaseModel):
    """
    Represents a document stored in the PostgreSQL database for full-text search.
    
    Used to store complete document text with metadata to enable both lexical and
    semantic search capabilities across the document corpus.
    """
    id: str
    filename: str
    title: Optional[str] = None
    content: str 
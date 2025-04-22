"""
PostgreSQL database operations for storing document text.

This module provides functions for:
1. Initializing and connecting to the PostgreSQL database
2. Creating necessary tables with document storage capabilities
3. Storing document text and metadata

The database schema includes a documents table for storing full document text.
"""
import os
from typing import List, Dict, Any, Optional, Tuple
from sqlalchemy import create_engine, Column, String, Text, func, Index, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import uuid
from src.data_pipeline.models import DocumentText
from src.data_pipeline.logger import setup_logger
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

logger = setup_logger(__name__)

# Create SQLAlchemy base class for declarative models
Base = declarative_base()

class Document(Base):
    """SQLAlchemy model for documents table."""
    __tablename__ = 'documents'
    
    id = Column(String(36), primary_key=True)
    filename = Column(String(255), nullable=False, index=True)
    title = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    

def get_db_engine():
    """
    Create and return a SQLAlchemy engine connected to PostgreSQL.
    
    Uses environment variables for connection parameters.
    
    Returns:
        An SQLAlchemy engine instance
    """
    # Get PostgreSQL connection parameters from environment variables
    db_host = os.getenv('POSTGRES_HOST', '')
    db_port = os.getenv('POSTGRES_PORT', '')
    db_name = os.getenv('POSTGRES_DB', '')
    db_user = os.getenv('POSTGRES_USER', '')  # Ensure this matches the .env file
    db_password = os.getenv('POSTGRES_PASSWORD', '')  # Ensure this matches the .env file
    
    # Log the connection details for debugging (excluding sensitive information)
    logger.info(f"Connecting to PostgreSQL at {db_host}:{db_port} as user {db_user}")
    
    # Create connection string
    connection_string = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    logger.info(f"Connecting to PostgreSQL at {connection_string}")
    # Create and return engine
    return create_engine(connection_string)

def initialize_db():
    """
    Initialize the PostgreSQL database by creating all tables and indices.
    
    This function:
    1. Creates all tables defined by SQLAlchemy models
    2. Creates a GIN index on the documents table for full-text search
    3. Logs completion status
    
    Returns:
        True if initialization successful, False otherwise
    """
    try:
        # Create engine and all tables
        engine = get_db_engine()
        Base.metadata.create_all(engine)
        
        # Create a session to execute raw SQL for the GIN index
        Session = sessionmaker(bind=engine)
        session = Session()
        
        # Check if the tsvector column exists, if not create it
        session.execute(
            text("ALTER TABLE documents ADD COLUMN IF NOT EXISTS content_tsvector tsvector "
                 "GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;")
        )
        
        # Create GIN index for full-text search if it doesn't exist
        session.execute(
            text("CREATE INDEX IF NOT EXISTS idx_documents_content_tsvector "
                 "ON documents USING GIN (content_tsvector);")
        )
        
        session.commit()
        session.close()
        
        logger.info("PostgreSQL database initialized successfully")
        return True
    except Exception as e:
        logger.error(f"Error initializing PostgreSQL database: {str(e)}")
        return False

def store_document(doc: DocumentText) -> bool:
    """
    Store a document in the PostgreSQL database.
    
    Args:
        doc: A DocumentText object containing the document data
        
    Returns:
        True if storage was successful, False otherwise
    """
    try:
        engine = get_db_engine()
        Session = sessionmaker(bind=engine)
        session = Session()
        
        # Create a new Document object
        document = Document(
            id=doc.id,
            filename=doc.filename,
            title=doc.title,
            content=doc.content
        )
        
        # Add to session and commit
        session.add(document)
        session.commit()
        session.close()
        
        logger.info(f"Document '{doc.filename}' stored successfully with ID {doc.id}")
        return True
    except Exception as e:
        logger.error(f"Error storing document in PostgreSQL: {str(e)}")
        return False

def document_exists(filename: str) -> bool:
    """
    Check if a document with the given filename already exists in the database.
    
    Args:
        filename: The filename to check
        
    Returns:
        True if the document exists, False otherwise
    """
    try:
        engine = get_db_engine()
        Session = sessionmaker(bind=engine)
        session = Session()
        
        # Check if document exists
        result = session.query(Document).filter(Document.filename == filename).first()
        session.close()
        
        return result is not None
    except Exception as e:
        logger.error(f"Error checking if document exists: {str(e)}")
        return False
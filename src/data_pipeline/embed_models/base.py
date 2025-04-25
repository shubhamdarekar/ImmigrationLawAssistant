from abc import ABC, abstractmethod
from typing import List, Any, Dict
import numpy as np
from pydantic import BaseModel, Field


class EmbeddingModel(BaseModel):
    """
    Abstract base class for embedding models.
    All embedding model implementations should inherit from this class.
    """
    
    class Config:
        arbitrary_types_allowed = True
        extra = "ignore"  # Allow extra attributes that aren't in the schema
    
    @abstractmethod
    def encode(self, texts: List[str]) -> np.ndarray:
        """
        Encode a list of texts into embeddings.
        
        Args:
            texts: List of text strings to encode
            
        Returns:
            numpy.ndarray: Array of embeddings
        """
        pass
    
    @property
    @abstractmethod
    def model_name(self) -> str:
        """
        Get the name of the model.
        
        Returns:
            str: Name of the model
        """
        pass
        
    @property
    @abstractmethod
    def target_dimension(self) -> int:
        """
        Get the target dimension of the embeddings.
        
        Returns:
            int: The dimension of the embedding vectors
        """
        pass 
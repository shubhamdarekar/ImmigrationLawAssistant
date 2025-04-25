from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Optional, Any, Dict

# A simple non-Pydantic class implementation
class all_minilm_l6_v2:
    """
    Implementation of embedding model using SentenceTransformer.
    """
    def __init__(self):
        self._model_name = "sentence-transformers/all-minilm-l6-v2"
        self._target_dimension = 3072
        self._model = None
    
    def _load_model(self):
        """Load the model if it's not already loaded."""
        if self._model is None:
            self._model = SentenceTransformer(self._model_name)
    
    def encode(self, texts: List[str]) -> np.ndarray:
        """
        Encode a list of texts into embeddings.
        
        Args:
            texts: List of text strings to encode
            
        Returns:
            numpy.ndarray: Array of embeddings
        """
        self._load_model()
        return self._model.encode(texts, convert_to_numpy=True)
    
    @property
    def model_name(self) -> str:
        """
        Get the name of the model.
        
        Returns:
            str: Name of the model
        """
        return self._model_name
        
    @property
    def target_dimension(self) -> int:
        """
        Get the target dimension of the embeddings.
        
        Returns:
            int: The dimension of the embedding vectors
        """
        return self._target_dimension 
        
    def get_model_name(self) -> str:
        """
        Get the name of the model.
        
        Returns:
            str: Name of the model
        """
        return self._model_name 
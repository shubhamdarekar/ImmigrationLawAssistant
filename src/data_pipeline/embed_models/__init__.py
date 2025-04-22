"""
Embedding models package for the TeacherBot data pipeline.

This package contains different implementations of text embedding models that
can be used for converting text chunks to vector representations. The module
provides a common interface through the EmbeddingModel abstract base class.
"""
from src.data_pipeline.embed_models.base import EmbeddingModel
from src.data_pipeline.embed_models.all_minilm_l6_v2 import all_minilm_l6_v2
from src.data_pipeline.embed_models.openai import OpenAIEmbeddingModel

__all__ = ['EmbeddingModel', 'all_minilm_l6_v2', 'OpenAIEmbeddingModel'] 
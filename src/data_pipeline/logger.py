"""
Logger module for the TeacherBot data pipeline.

This module provides logging setup functionality for consistent logging
across the application.
"""
import logging

def setup_logger(name: str, level: int = logging.INFO) -> logging.Logger:
    """
    Sets up and configures a logger with specified name and level.
    
    This function creates a logger with a consistent formatting pattern and
    prevents duplicate handlers from being added to existing loggers.
    
    Args:
        name: The name for the logger, typically __name__ from the calling module
        level: The logging level (default: logging.INFO)
        
    Returns:
        A configured logger instance
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    ch = logging.StreamHandler()
    ch.setLevel(level)
    
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    
    if not logger.handlers:
        logger.addHandler(ch)
    
    return logger

logger = setup_logger(__name__) 
from dotenv import load_dotenv
import os
import sys
import openai
from pinecone import Pinecone

# Load .env variables
load_dotenv()

# Azure OpenAI setup 
openai.api_type = "azure"
openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
openai.api_version = os.getenv("AZURE_OPENAI_API_VERSION")

# Load deployment names from environment
embedding_deployment = os.getenv("AZURE_EMBEDDING_DEPLOYMENT")
chat_deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")

# Pinecone setup 
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))

# Embedding + Retrieval
def get_relevant_context(query, top_k=5):
    """
    Retrieve relevant context from Pinecone based on query embedding
    
    Args:
        query (str): User's input query
        top_k (int): Number of top matching context chunks to retrieve
    
    Returns:
        list: Relevant context chunks
    """
    try:
        # Create query embedding
        embed_response = openai.embeddings.create(
            input=[query],
            model=embedding_deployment
        )

        query_vector = embed_response.data[0].embedding

        # Query Pinecone
        search_response = index.query(
            vector=query_vector,
            top_k=top_k,
            include_metadata=True
        )

        # Extract context chunks
        return [match["metadata"]["text"] for match in search_response["matches"]]
    except Exception as e:
        print(f"Error retrieving context: {e}", file=sys.stderr)
        return []

# Compose + Answer with GPT-4o
def answer_query(query):
    """
    Generate an answer to the user's query using retrieved context
    
    Args:
        query (str): User's input query
    
    Returns:
        str: Generated answer
    """
    try:
        context_chunks = get_relevant_context(query)
        context = "\n\n".join(context_chunks)
        prompt = f"""You are an immigration legal assistant. Use the legal context below to answer the user's question.

Context:
{context}

Question:
{query}

Answer:"""
        response = openai.chat.completions.create(
            model=chat_deployment,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating answer: {e}", file=sys.stderr)
        return "I apologize, but I encountered an error while processing your query."

# Main execution for direct script running or environment query
def main():
    # Check if query is passed via environment variable
    query = os.getenv('TEST_QUERY')
    
    if query:
        print("User question:", query)
        print("Answer from GPT-4o:\n")
        print(answer_query(query))
    else:
        # Default test query if no environment variable is set
        test_query = "Can I work on an F1 visa in the U.S.?"
        print("User question:", test_query)
        print("Answer from GPT-4o:\n")
        print(answer_query(test_query))

# Entry point
if __name__ == "__main__":
    main()
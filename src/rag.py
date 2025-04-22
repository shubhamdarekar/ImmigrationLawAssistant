from dotenv import load_dotenv
import os
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

#Embedding + Retrieval
def get_relevant_context(query, top_k=5):
    # Create query embedding
    embed_response = openai.embeddings.create(
        input=[query],
        model=embedding_deployment
        #deployment_id=embedding_deployment
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


# Compose + Answer with GPT-4o
def answer_query(query):
    context_chunks = get_relevant_context(query)
    context = "\n\n".join(context_chunks)
    prompt = f"""You are an immigration legal assistant. Use the legal context below to answer the user's question.

Context:
{context}

Question:
{query}

Answer:"""
    response = openai.chat.completions.create(
        #engine=chat_deployment,
        model=chat_deployment,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# Test full pipline
if __name__ == "__main__":
    test_query = "Can I work on an F1 visa in the U.S.?"
    print("User question:", test_query)
    print("Answer from GPT-4o:\n")
    print(answer_query(test_query))

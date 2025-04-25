import fitz  # PyMuPDF
from dotenv import load_dotenv
import os
import openai
from pinecone import Pinecone
from fuzzywuzzy import fuzz 

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


def extract_text_from_pdf(file, terms_to_highlight=None):
    doc = fitz.open(stream=file.read(), filetype="pdf")
    text = ""
    # If no terms to highlight, just extract text
    if not terms_to_highlight:
        print("No terms to highlight")
        for page in doc:
            text += page.get_text()
        return text  # Return plain text
    
    print("Terms to highlight:", terms_to_highlight)

    # Highlighting logic
    for page_num, page in enumerate(doc):
        words = page.get_text("words")  # list of (x0, y0, x1, y1, word, block_no, line_no, word_no)
        words_sorted = sorted(words, key=lambda w: (w[5], w[6], w[7]))  # sort by block, line, word

        window_size = 5  # Can adjust between 5-7
        for i in range(len(words_sorted) - window_size + 1):
            window = words_sorted[i:i+window_size]
            window_text = " ".join(w[4] for w in window)

            for term in terms_to_highlight:
                score = fuzz.partial_ratio(window_text.lower(), term.lower())
                if score > 85:
                    rects = [fitz.Rect(w[:4]) for w in window]
                    union_rect = rects[0]
                    for r in rects[1:]:
                        union_rect |= r  # Merge rectangles
                    page.add_highlight_annot(union_rect)


    # Save to bytes
    output = bytes(doc.write())
    return output


# 🔍 Extract complex/legal terms using GPT
def get_highlighted_terms(text):
    response = openai.chat.completions.create(
        model=chat_deployment,
        temperature=0, #added this to keep responses the same (same terms found)
        messages=[{
            "role": "user",
            "content": f"Extract 5 legally significant or confusing terms from the text below:\n{text[:4000]}"
        }]
    )
    return response.choices[0].message.content.strip().split("\n")

# 🔎 Find relevant Pinecone context
def get_relevant_context(query, top_k=5):
    embed_response = openai.embeddings.create(
        input=[query],
        model=embedding_deployment
    )
    query_vector = embed_response.data[0].embedding

    search_response = index.query(
        vector=query_vector,
        top_k=top_k,
        include_metadata=True
    )

    print(search_response["matches"][0]["metadata"])


    return [match["metadata"]["raw_text"] for match in search_response["matches"]]

# 💬 Generate answer using GPT-4o and legal context
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
        model=chat_deployment,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# 🧪 Test it standalone
if __name__ == "__main__":
    test_query = "Can I work on an F1 visa in the U.S.?"
    print("User question:", test_query)
    print("Answer from GPT-4o:\n")
    print(answer_query(test_query))

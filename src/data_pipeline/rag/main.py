from sentence_transformers import SentenceTransformer

from retrieval import Retrieval
from generation import Generation
from consts import SENTENCE_TRANSFORMER

EMBEDDING_MODEL = SentenceTransformer(model_name_or_path=SENTENCE_TRANSFORMER)

if __name__ == '__main__':
    
    retrieval_ob = Retrieval()
    # gen_ob = Generation()

    query = "Can you tell me about this course"
    # convert to embeddings
    query_embedding = EMBEDDING_MODEL.encode(sentences=query).tolist()
    retrieval_ob.query_db(embeddings=query_embedding)
    print("Retreival result: \n", retrieval_ob.db_response)
    # send to critic model
    
    # gen_ob.generate_response(retrieved_docs=retrieval_ob.db_response, query=query)
import os

from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv()

PINECONE_DB = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))

class Retrieval:
    def __init__(self) -> None:
        # initialise pinecone index
        self.init_pinecone()
    
    def init_pinecone(self):
        """
        establish connection with pinecone
        """
        
        curr_index = os.getenv('PINECONE_INDEX_NAME')
        # name of all pinecone indexes
        try:
            pinecone_indexes = [index_info.get('name') for index_info in PINECONE_DB.list_indexes()]
            # check if all indexes exist
            if not isinstance(pinecone_indexes, list) and len(pinecone_indexes)>0:
                self.pinecone_index = None
                print("No pinecone index")
            self.pinecone_index = None if not curr_index in pinecone_indexes else PINECONE_DB.Index(name=curr_index)
        except Exception as error:
            print(f"error connecting to pinecone :: {str(error)}")
    
    # TODO: receive query from frontend
    def get_query(self):
        """
        make API call to frontend to receive user query
        """

    def fetch_children_text(self, metadata, current_depth) -> str:
        """Recursively fetch text of children from metadata."""
        
        text, children_texts = "", []

        if current_depth >= 5 or 'children' not in metadata:
            return text

        children = metadata.get('children', [])
        if isinstance(children, list) and len(children)>0:
            for child_id in children:
                child_result = self.pinecone_index.query(
                    vector=None,
                    id=child_id,
                    top_k=1,
                    include_metadata=True
                )
                matches = child_result.get('matches', [])
                if isinstance(matches, list) and len(matches)>0:
                    child_metadata = matches[0].get('metadata', {})
                    raw_text = child_metadata.get('raw_text', '')
                    children_texts.append(raw_text.strip() if raw_text else '')
                    text_new = self.fetch_children_text(child_metadata, current_depth + 1)
                    children_texts.append(text_new.strip() if text_new else '')
                    print(children_texts)
            
            return "\n\n".join(children_texts)

    def query_db(self, embeddings: list):
        """
        retrieve results from Pinecone

        :param embeddings (list): query embeddings
        """

        self.db_response = ""

        if self.pinecone_index:
            # retrieve top 3 results from Pinecone
            results = self.pinecone_index.query(
                vector=embeddings,
                top_k=3,
                include_metadata=True
            )
            # rerank results
            try:
                matches = results.get('matches', [])
                if isinstance(matches, list) and len(matches)>0:
                    # sort in decreasing order of scores and return top most score
                    result = sorted(matches, key=lambda x: x.get('score'), reverse=True)[0]
                    self.db_response = self.fetch_children_text(metadata=result.get('metadata'), current_depth=0)
            except Exception as error:
                print(f"error fetching results from Pinecone :: str{error}")
    
    # TODO: establish connection with Mongodb and update collection
    def update_critic_model(self, result: dict):
        """
        update mongodb collection with the result
        """

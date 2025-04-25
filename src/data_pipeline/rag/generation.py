from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.messages import SystemMessage, HumanMessage

class Generation:
    def __init__(self):
        self.llm = HuggingFaceEndpoint(
            repo_id="meta-llama/Llama-3.2-3B-Instruct",
            task="text-generation",
            max_new_tokens=512,
            do_sample=False,
            repetition_penalty=1.03,
            temperature=0
        )
        self.chat = ChatHuggingFace(llm=self.llm, verbose=True)
    
    def generate_response(self, retrieved_results, user_query):
        messages = [
            SystemMessage(content=f"You are an assistant for a user and are given a long ```passsage```. You are supposed to understand the passage and generate an accurate answer to the question being asked. \n passage: {retrieved_results}"),
            HumanMessage(content=user_query)
        ]
        response = self.chat.invoke(messages)
        print(response)

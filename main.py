from flask import Flask, request
from src.data_pipeline.process_pdf import main as process_pdf_main  # Import your process_pdf_main function


app = Flask(__name__)

@app.route("/", methods=["POST"])
def main(request):
    """Cloud Function entry point to trigger the PDF processing."""
    try:
        # Log the start of the process for debugging.
        print("Starting PDF processing...")
        
        if request.method != "POST":
            return "Method not allowed", 405
        
        bucket_name = request.json.get("bucket_name",None)
        file_name = request.json.get("file_name",None)
        chunk_size = request.json.get("chunk_size", None)  # Default chunk size
        chunk_overlap = request.json.get("chunk_overlap", None)  # Default chunk overlap
        model = request.json.get("model", None)  # Default model
        

        # Call the main processing function, which processes the PDFs.
        process_pdf_main(bucket_name, file_name, chunk_size, chunk_overlap, model)

        # Log successful execution.
        print("PDF processed successfully.")
        return "Function executed successfully", 200
    except Exception as e:
        # Catch any errors and return an error response.
        print(f"Error: {str(e)}")  # Log the error for debugging.
        return f"Error: {str(e)}", 500

if __name__ == "__main__":
    # Ensure the app listens on the port specified by the PORT environment variable.
    import os
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
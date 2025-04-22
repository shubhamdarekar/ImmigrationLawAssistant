import os
from google.cloud import storage
from dotenv import load_dotenv

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))
load_dotenv(dotenv_path=env_path)
gcp_key = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

if gcp_key:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = gcp_key
else:
    raise ValueError("❌ GOOGLE_APPLICATION_CREDENTIALS not found in .env!")

def upload_folder(bucket_name, local_folder, gcs_prefix):
    client = storage.Client()
    bucket = client.bucket(bucket_name)

    for root, _, files in os.walk(local_folder):
        for file in files:
            local_path = os.path.join(root, file)
            rel_path = os.path.relpath(local_path, local_folder)
            blob_path = os.path.join(gcs_prefix, rel_path)

            blob = bucket.blob(blob_path)
            blob.upload_from_filename(local_path)
            print(f"✅ Uploaded {local_path} to gs://{bucket_name}/{blob_path}")

if __name__ == "__main__":
    bucket_name = "law__assistant_scaped_data"

    upload_folder(bucket_name, "src/data_ingestion/data/structured/reddit_post", "structured_data/reddit_post")
    upload_folder(bucket_name, "src/data_ingestion/data/structured/uscis_pdf", "structured_data/uscis_pdf")
    upload_folder(bucket_name, "src/data_ingestion/data/structured/uscis_html", "structured_data/uscis_html")


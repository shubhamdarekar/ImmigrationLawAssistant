import pandas as pd
import json
import os
import requests
from datetime import datetime
from pdfminer.high_level import extract_text

df = pd.read_csv("../metadata/uscis_pdf_metadata.csv")

output_dir = "../data/raw/uscis_pdf"
os.makedirs(output_dir, exist_ok=True)

def download_and_extract_pdf(url):
    try:
        filename = "temp.pdf"
        with requests.get(url, stream=True) as r:
            with open(filename, 'wb') as f:
                f.write(r.content)
        text = extract_text(filename)
        os.remove(filename)
        return text
    except Exception as e:
        print(f"❌ Failed to fetch or extract PDF: {url}")
        return None

for _, row in df.iterrows():
    if pd.isna(row["Instructions Link"]) or row["File Type"].lower() != "pdf":
        continue

    pdf_text = download_and_extract_pdf(row["Instructions Link"])
    if not pdf_text:
        continue

    features = [f.strip() for f in str(row["Features"]).split()]

    metadata = {
        "source": "uscis_pdf",
        "file_type": row["File Type"],
        "category": row["Category"],
        "url": row["URL"],
        "features": features,
        "form_number": row["Form Number"],
        "form_name": row["Form Name"],
        "form_link": row["Form Link"],
        "instruction_link": row["Instructions Link"],
        "description": row["Description"],
        "notes": row["Notes"],
        "content": pdf_text,
        "language": "en",
        "cleaned": False,
    }

    output_filename = f"uscis_pdf_{row['Form Number'].lower()}.json"
    output_path = os.path.join(output_dir, output_filename)

    with open(output_path, "w") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

    print(f"✅ Saved: {output_path}")
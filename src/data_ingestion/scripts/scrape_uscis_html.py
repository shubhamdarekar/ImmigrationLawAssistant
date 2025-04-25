import csv
import json
import requests
from bs4 import BeautifulSoup
import re
import os

# Paths
input_csv_path = "../metadata/uscis_html_metadata.csv"
output_dir = "../data/raw/uscis_html"
os.makedirs(output_dir, exist_ok=True)

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

def scrape_html_content(url):
    if not url or not url.startswith("http"):
        return None, f"Invalid URL: {url}"
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        resp = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(resp.content, "html.parser")
        main_content = soup.find("div", {"id": "main-content"}) or soup.body
        return clean_text(main_content.get_text(separator=' ')), None
    except Exception as e:
        return None, f"Error scraping {url}: {e}"

# Read CSV and scrape
with open(input_csv_path, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for i, row in enumerate(reader):
        url = row.get("URL", "").strip()
        visa_type_raw = row.get("Visa Type", "").strip()
        visa_type = visa_type_raw.split(",")[0].strip().replace("/", "-").replace(" ", "_")

        content, error = scrape_html_content(url)

        scraped = {
            "source": row.get("Source", "uscis_html"),
            "file_type": row.get("File Type", "html"),
            "category": row.get("Category", ""),
            "url": url,
            "features": [f.strip() for f in row.get("Features", "").split(",") if f.strip()],
            "notes": row.get("Notes", ""),
            "language": row.get("Language", "en"),
            "visa_type": visa_type,
            "cleaned": content is not None,
            "content": content or error
        }

        # Save file as: uscis_html_<visa_type>.json
        filename = f"uscis_html_{visa_type or 'unknown'}.json"
        filepath = os.path.join(output_dir, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(scraped, f, indent=2)

        # Print status
        status = "✅ Success" if content else "❌ Failed"
        print(f"{status} - [{visa_type}] {url}")

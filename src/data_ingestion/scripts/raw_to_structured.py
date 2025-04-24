import os
import json
import re
from pathlib import Path

DATA_SOURCE_CONFIG = "../scripts/data_sources.json"

def clean_content(text):
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'<[^>]+>', '', text)
    return text.strip()

def clean_and_assign_content(doc):
    content = doc.get("content", "")
    if isinstance(content, str):
        return clean_content(content)
    else:
        return content

def extract_metadata(doc):
    if doc.get("source") == "reddit_post":
        content = doc.get("content", {})
        return {
            "post_id": doc.get("post_id"),
            "subreddit": content.get("subreddit"),
            "score": content.get("score"),
            "num_comments": content.get("num_comments"),
            "created_date_str": content.get("created_date_str"),
            "score_rank": doc.get("score_rank"),
            "retrieval_method": doc.get("score_rank", "").split("_")[0] if "score_rank" in doc else None
        }
    else:
        target_fields = ['form_number', 'form_name', 'category', 'notes', 'visa_type']
        return {f: doc[f] for f in target_fields if f in doc and isinstance(doc[f], str)}

def convert_raw_to_structured_from_config(config_path):
    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    for source, paths in config.items():
        print(f"\n🔍 Processing source: {source}")
        raw_folder = Path(paths["raw"])
        structured_folder = Path(paths["structured"])
        os.makedirs(structured_folder, exist_ok=True)

        processed_count = 0
        for file in raw_folder.glob("*.json"):
            print(f"📄 Processing file: {file.name}")
            try:
                with open(file, 'r', encoding='utf-8') as f:
                    doc = json.load(f)

                structured_data = doc.copy()
                structured_data["cleaned"] = True
                structured_data["content"] = clean_and_assign_content(doc)
                structured_data["metadata"] = extract_metadata(doc)


                output_path = structured_folder / file.name
                with open(output_path, "w", encoding="utf-8") as out:
                    json.dump(structured_data, out, indent=2)

                print(f"✅ Saved to: {output_path}")
                processed_count += 1

            except Exception as e:
                print(f"❌ Error processing {file.name}: {e}")

        print(f"🎉 Finished: {processed_count} files processed from {source}")

if __name__ == "__main__":
    convert_raw_to_structured_from_config(DATA_SOURCE_CONFIG)
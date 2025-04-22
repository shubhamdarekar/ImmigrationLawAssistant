# data_ingestion

A modular and extensible pipeline for collecting, cleaning, and structuring multi-source immigration-related data. This component is a foundational part of our Retrieval-Augmented Generation (RAG) system designed to support legal AI assistants.

---

## 📁 Structure

```
src/
└── data_ingestion/
    ├── data/
    │   ├── raw/                        # Raw crawled JSON files
    │   │   ├── reddit_post/
    │   │   ├── uscis_html/
    │   │   └── uscis_pdf/
    │   └── structured/                # Cleaned & normalized metadata
    │       ├── reddit_post/
    │       ├── uscis_html/
    │       └── uscis_pdf/
    ├── docs/
    │   └── note.md
    ├── logs/                              # Logging for crawlers & transformers
    ├── metadata/
    │   ├── uscis_html_metadata.csv
    │   └── uscis_pdf_metadata.csv
    ├── scripts/
    │   ├── data_sources.json         # Source registry for scraping
    │   ├── raw_to_structured.py      # Normalize raw data into structured schema
    │   ├── scrape_reddit_post.py     # Reddit immigration threads crawler
    │   ├── scrape_uscis_html.py      # USCIS HTML forms scraper
    │   └── scrape_uscis_pdf.py       # USCIS PDF downloader and parser
    ├── rag.py                            # Optional: entry point for downstream RAG pipeline
    ├── .env
    └── .gitignore
```

---

## ✨ Core Workflow

1. **Raw Scraping**: Data is crawled from Reddit, USCIS HTML pages, and USCIS PDFs, and stored in `data/raw/`
2. **Structured Transformation**: `raw_to_structured.py` normalizes raw data into consistent formats stored in `data/structured/`
3. **Metadata Generation**: Flattened CSVs are saved under `metadata/` for inspection, indexing, or analytics

---

## ⚙️ How to Use

### 📂 USCIS PDF Scraping
```bash
python scripts/scrape_uscis_pdf.py
```
- Downloads USCIS PDFs, extracts metadata
- Raw Data: `data/raw/uscis_pdf/`
- Structured Data: `data/structured/uscis_pdf/`
- Metadata CSV: `metadata/uscis_pdf_metadata.csv`

### 🌐 USCIS HTML Forms Scraping
```bash
python scripts/scrape_uscis_html.py
```
- Crawls metadata from USCIS HTML form pages
- Raw Data: `data/raw/uscis_html/`
- Structured Data: `data/structured/uscis_html/`
- Metadata CSV: `metadata/uscis_html_metadata.csv`

### 📜 Reddit Immigration Post Scraping
```bash
python scripts/scrape_reddit_post.py
```
- Crawls posts from r/immigration and r/askimmigration
- Filters low-score or empty-comment posts
- Raw Data: `data/raw/reddit_post/`
- Structured Data: `data/structured/reddit_post/`

### 🔄 Normalize Raw JSON to Structured Format
```bash
python scripts/raw_to_structured.py
```
- Processes any raw JSON files under `/raw/`
- Outputs structured and cleaned JSONs under `/structured/`

---

## 📦 Data Schema

### 📄 USCIS PDF
```json
{
  "source": "uscis_pdf",
  "file_type": "pdf / html",
  "category": "Family-Based Immigration",
  "url": "https://www.uscis.gov/i-130",
  "form_number": "I-130",
  "form_name": "Petition for Alien Relative",
  "form_link": "https://www.uscis.gov/forms/i-130.pdf",
  "instructions_link": "https://www.uscis.gov/forms/i-130instr.pdf",
  "description": "",
  "features": ["form-assistance", "map-navigation"],
  "notes": "",
  "language": "en",
  "content": "Cleaned text body for embedding",
  "cleaned": true
}
```

### 🌐 USCIS HTML
```json
{
  "source": "uscis_html",
  "file_type": "pdf / html",
  "category": "Family-Based Immigration",
  "url": "https://www.uscis.gov/i-130",
  "visa_type": "IR1",
  "features": ["form-assistance", "map-navigation"],
  "notes": "",
  "language": "en",
  "content": "Cleaned text body for embedding",
  "cleaned": true
}
```

### 📝 Reddit Post
```json
{
  "source": "reddit_post",
  "file_type": "post",
  "post_id": "abc123",
  "url": "https://www.reddit.com/r/askimmigration/comments/abc123/...",
  "score_rank": "hot_1",
  "content": {
    "title": "Can I apply for a green card while on H1B?",
    "subreddit": "askimmigration",
    "score": 128,
    "num_comments": 34,
    "created_utc": 1700000000,
    "created_date_str": "2024-01-20 06:21:22",
    "top_comments": [
      {
        "comment_id": "c1abc23",
        "content": "Yes, you can apply while on H1B...",
        "score": 87
      }
    ]
  },
  "language": "en",
  "cleaned": true
}
```

---

## 📅 Environment Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure your `.env` file:
```env
REDDIT_CLIENT_ID=...
REDDIT_CLIENT_SECRET=...
USER_AGENT=...
```

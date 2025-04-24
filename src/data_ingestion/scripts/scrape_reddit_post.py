import os
import json
import praw
from pathlib import Path
from datetime import datetime
import dotenv

dotenv.load_dotenv()
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT")


OUTPUT_FOLDER = "../data/raw/reddit_post"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

SUBREDDITS = [
    "askimmigration",
    "immigration",
    "USCIS",
    "immigrationlaw",
    "VisaJourney"
]
POST_LIMIT = 50
METHODS = {
    "top": "top",
    "hot": "hot"
}

reddit = praw.Reddit(
    client_id=REDDIT_CLIENT_ID,
    client_secret=REDDIT_CLIENT_SECRET,
    user_agent=REDDIT_USER_AGENT
)

def clean_text(text):
    return ' '.join(text.strip().split())

def get_top_comments(post, max_comments=3, min_score=5):
    post.comments.replace_more(limit=0)
    top_comments = []
    for comment in post.comments:
        if len(top_comments) >= max_comments:
            break
        if comment.score >= min_score and hasattr(comment, "body"):
            top_comments.append({
                "comment_id": comment.id,
                "content": clean_text(comment.body),
                "score": comment.score
            })
    return top_comments

def scrape_subreddit(subreddit_name):
    subreddit = reddit.subreddit(subreddit_name)
    for method_name, method_func in METHODS.items():
        print(f"🔍 Scraping r/{subreddit_name} by {method_name}...")
        posts = getattr(subreddit, method_func)(limit=POST_LIMIT)

        for rank, post in enumerate(posts, start=1):
            if not post.selftext:
                continue

            top_comments = get_top_comments(post)
            if not top_comments:
                continue  # ❌ Skip posts without good comments

            created_date_str = datetime.utcfromtimestamp(post.created_utc).strftime("%Y-%m-%d %H:%M:%S")

            structured = {
                "source": "reddit_post",
                "file_type": "post",
                "post_id": post.id,
                "url": f"https://www.reddit.com{post.permalink}",
                "score_rank": f"{method_name}_{rank}",
                "content": {
                    "title": clean_text(post.title),
                    "subreddit": subreddit_name,
                    "score": post.score,
                    "num_comments": post.num_comments,
                    "created_utc": post.created_utc,
                    "created_date_str": created_date_str,
                    "top_comments": top_comments
                },
                "language": "en",
                "cleaned": False
            }

            filename = f"reddit_post_{method_name}_{post.id}.json"
            file_path = Path(OUTPUT_FOLDER) / filename
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(structured, f, indent=2)

            print(f"✅ Saved post: {filename}")

if __name__ == "__main__":
    for sub in SUBREDDITS:
        scrape_subreddit(sub)
    print("🎉 Finished scraping Reddit posts.")
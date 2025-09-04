import os
import pandas as pd
import json

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  
INPUT_FILE = os.path.join(BASE_DIR, "data", "sources_clean.csv")
OUTPUT_FILE = os.path.join(BASE_DIR, "data", "chunks.jsonl")

# Max words per chunk (you can tune this for your model)
CHUNK_SIZE = 500

def chunk_text(text, chunk_size=CHUNK_SIZE):
    words = text.split()
    for i in range(0, len(words), chunk_size):
        yield " ".join(words[i:i + chunk_size])

def main():
    df = pd.read_csv(INPUT_FILE)
    out = []

    for _, row in df.iterrows():
        chunks = list(chunk_text(str(row["text"])))
        for idx, chunk in enumerate(chunks):
            rec = {
                "id": f"{row['id']}_{idx}",
                "source_id": row["id"],
                "title": row["title"],
                "text": chunk,
                "diseases": row.get("diseases", ""),
                "region": row.get("region", ""),
                "action_type": row.get("action_type", "")
            }
            out.append(rec)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        for rec in out:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")

    print(f"✅ Chunked {len(out)} records saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()

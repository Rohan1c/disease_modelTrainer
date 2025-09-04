import os
import json
from transformers import pipeline

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  
INPUT_FILE = os.path.join(BASE_DIR, "data", "chunks.jsonl")
OUTPUT_FILE = os.path.join(BASE_DIR, "data", "processed.jsonl")

# Load Hugging Face models
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
translator_hi = pipeline("translation", model="Helsinki-NLP/opus-mt-en-hi")  # Hindi example

def main():
    out = []

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        for line in f:
            record = json.loads(line)
            text = record["text"]

            # Step 1: Summarize
            try:
                summary = summarizer(text, max_length=100, min_length=25, do_sample=False)[0]["summary_text"]
            except Exception as e:
                print(f"Summarization failed for {record['id']}: {e}")
                summary = text[:300]  # fallback

            # Step 2: Translate summary → Hindi
            try:
                translated = translator_hi(summary)[0]["translation_text"]
            except Exception as e:
                print(f"Translation failed for {record['id']}: {e}")
                translated = summary

            record["summary_en"] = summary
            record["summary_hi"] = translated
            out.append(record)

            for line_num, line in enumerate(f):
                record = json.loads(line)
                print(f"Processing chunk {line_num} - {record['id']}")

    # Save processed file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        for rec in out:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")

    print(f"✅ Processed {len(out)} chunks → {OUTPUT_FILE}")



if __name__ == "__main__":
    main()

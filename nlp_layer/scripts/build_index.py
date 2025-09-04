import os
import pandas as pd
from PyPDF2 import PdfReader

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # project root
RAW_DIR = os.path.join(BASE_DIR, "data", "raw")
OUTPUT_FILE = os.path.join(BASE_DIR, "data", "sources.csv")


records = []

def extract_pdf(path):
    text = ""
    try:
        reader = PdfReader(path)
        for page in reader.pages:
            text += page.extract_text() + " "
    except Exception as e:
        print(f"Error reading {path}: {e}")
    return text.strip()

def main():
    for fname in os.listdir(RAW_DIR):
        if fname.endswith(".pdf"):
            fpath = os.path.join(RAW_DIR, fname)
            text = extract_pdf(fpath)

            rec = {
                "id": os.path.splitext(fname)[0],
                "title": fname,
                "source_url": "",
                "language": "en",
                "text": text,
                "diseases": "",
                "region": "",
                "action_type": "other"
            }
            records.append(rec)

    df = pd.DataFrame(records)
    df.to_csv(OUTPUT_FILE, index=False)
    print(f"✅ Saved {len(df)} sources to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()

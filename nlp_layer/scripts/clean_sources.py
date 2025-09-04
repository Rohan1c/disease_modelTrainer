import os
import re
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  
INPUT_FILE = os.path.join(BASE_DIR, "data", "sources.csv")
OUTPUT_FILE = os.path.join(BASE_DIR, "data", "sources_clean.csv")

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    # Remove multiple spaces/newlines
    text = re.sub(r"\s+", " ", text)
    # Remove "Page X" patterns
    text = re.sub(r"Page\s*\d+", "", text, flags=re.IGNORECASE)
    return text.strip()

def main():
    df = pd.read_csv(INPUT_FILE)

    # Clean text column
    df["text"] = df["text"].apply(clean_text)

    # Ensure metadata columns exist
    for col in ["diseases", "region", "action_type"]:
        if col not in df.columns:
            df[col] = ""

    # Example simple keyword mapping (you’ll expand manually later)
    mappings = [
    {"keyword": "late blight", "disease": "Late blight", "action": "chemical"},
    {"keyword": "potato blight", "disease": "Late blight", "action": "chemical"},
    {"keyword": "fusarium wilt", "disease": "Fusarium wilt", "action": "preventive"},
    {"keyword": "brown rot", "disease": "Brown rot", "action": "organic"},
]


    for i, row in df.iterrows():
        text_lower = str(row["text"]).lower()
        for m in mappings:
            if m["keyword"] in text_lower and df.at[i, "diseases"] == "":
                df.at[i, "diseases"] = m["disease"]
                df.at[i, "action_type"] = m["action"]
                df.at[i, "region"] = "India"  # default placeholder

    df.to_csv(OUTPUT_FILE, index=False, encoding="utf-8")
    print(f"✅ Cleaned file saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()

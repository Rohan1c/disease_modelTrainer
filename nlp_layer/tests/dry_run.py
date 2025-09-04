import os
import json
from transformers import pipeline
from translate import Translator

# ----------------------------
# Farmer input (simulate ML output)
# ----------------------------
farmer_name = "Rohan"
location = "Tamil Nadu"
crop_type = "Tomato"
lang = "hi"  # 'en', 'hi', 'ta', etc.
disease_label = "late blight"  # simulated ML model output

# ----------------------------
# File paths
# ----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHUNKS_FILE = os.path.join(BASE_DIR, "..", "data", "processed.jsonl")  # adjust path as needed

# ----------------------------
# Load NLP chunks
# ----------------------------
if not os.path.exists(CHUNKS_FILE):
    raise FileNotFoundError(f"{CHUNKS_FILE} does not exist. Run your NLP pipeline first.")

nlp_chunks = [json.loads(line) for line in open(CHUNKS_FILE, "r", encoding="utf-8")]

# ----------------------------
# Initialize Hugging Face summarizer
# ----------------------------
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Initialize translator
translator = Translator(to_lang=lang)

# ----------------------------
# Helper functions
# ----------------------------
def get_relevant_chunks(disease, max_chunks=3):
    relevant = []
    disease_lower = disease.lower().strip()
    for c in nlp_chunks:
        d = str(c.get("diseases") or "").lower()
        if disease_lower in d:  # use containment instead of exact match
            relevant.append(c)
        if len(relevant) >= max_chunks:
            break
    return relevant

def generate_advice(chunks, target_lang="en"):
    text = " ".join([str(c.get("summary_en") or c.get("text") or "") for c in chunks])
    
    if len(text.split()) < 5:  # too short to summarize
        summary = text
    else:
        try:
            summary = summarizer(text, max_length=150, min_length=50, do_sample=False)[0]["summary_text"]
        except Exception:
            summary = text[:300]  # fallback
    
    if target_lang != "en":
        try:
            summary = translator.translate(summary)
        except Exception:
            pass  # fallback to English if translation fails
    return summary

# ----------------------------
# Dry run: generate advice
# ----------------------------
chunks = get_relevant_chunks(disease_label)
if not chunks:
    advice = "No relevant advice found for this disease."
else:
    advice = generate_advice(chunks, target_lang=lang)

response = {
    "farmer": farmer_name,
    "location": location,
    "crop": crop_type,
    "disease_detected": True if disease_label.lower() != "healthy" else False,
    "disease_name": disease_label if disease_label.lower() != "healthy" else None,
    "advice": advice
}

print(json.dumps(response, ensure_ascii=False, indent=2))

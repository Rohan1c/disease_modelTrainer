from fastapi import FastAPI, Query
import json
import os

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.dirname(__file__)) 
DATA_FILE = os.path.join(BASE_DIR, "data", "processed.jsonl")

# Load data once at startup
data = []
if os.path.exists(DATA_FILE):
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        for line in f:
            try:
                data.append(json.loads(line))
            except:
                continue


@app.get("/recommend")
def recommend(disease: str = Query(..., description="Disease name"),
              lang: str = Query("en", description="Language code")):
    disease = disease.lower()
    results = []

    for rec in data:
        diseases_field = str(rec.get("diseases", "")).lower()
        if diseases_field and disease in diseases_field:
            results.append({
                "id": rec.get("id"),
                "title": rec.get("title"),
                "text": rec.get("text", "")[:300] + "...",  # first 300 chars
                "language": rec.get("language", "en"),
                "action_type": rec.get("action_type", "other")
            })

    if not results:
        return {"error": f"No recommendations found for '{disease}'"}

    return {"recommendations": results}


@app.get("/list_diseases")
def list_diseases():
    diseases = []
    for rec in data:
        if rec.get("diseases"):
            diseases.append(str(rec["diseases"]).lower())
    return {"available_diseases": list(set(diseases))}

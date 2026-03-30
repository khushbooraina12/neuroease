import torch
import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification

# ---------------------------
# Flask setup
# ---------------------------
app = Flask(__name__)
CORS(app)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ---------------------------
# Load trained BERT model
# ---------------------------
MODEL_PATH = "models/bert_intervention_recommender"

model = DistilBertForSequenceClassification.from_pretrained(
    MODEL_PATH
).to(device)

tokenizer = DistilBertTokenizer.from_pretrained(
    MODEL_PATH
)

# ---------------------------
# Load Label Encoder (REQUIRED)
# ---------------------------
with open("models/label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

model.eval()

# ---------------------------
# BERT Recommendation
# ---------------------------
def bert_recommend(journal_text, top_k=3):
    inputs = tokenizer(
        journal_text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=100
    ).to(device)

    with torch.no_grad():
        logits = model(**inputs).logits
        probs = torch.softmax(logits, dim=1)

    topk = torch.topk(probs, k=min(top_k, probs.shape[1]))

    return [
        label_encoder.inverse_transform([idx.item()])[0]
        for idx in topk.indices[0]
    ]

# ---------------------------
# Final Recommendation (NO RL for now)
# ---------------------------
def final_recommendation(journal_text):
    candidates = bert_recommend(journal_text, top_k=3)

    # Simple diversity fallback
    return np.random.choice(candidates)

# ---------------------------
# API Endpoint
# ---------------------------
@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()

    journal_text = data.get("journal_text", "").strip()

    if not journal_text:
        return jsonify({"error": "journal_text is required"}), 400

    intervention_id = final_recommendation(journal_text)

    return jsonify({
        "intervention_id": intervention_id
    })

# ---------------------------
# Run server
# ---------------------------
if __name__ == "__main__":
    app.run(debug=True)

import sys
import json
import joblib
import os

# Absolute path of this file
BASE = os.path.dirname(os.path.abspath(__file__))

# Load ML model and encoder
try:
    MODEL_PATH = os.path.join(BASE, "..", "models", "symptom_model.pkl")
    ENCODER_PATH = os.path.join(BASE, "..", "models", "symptom_label_encoder.pkl")

    MODEL = joblib.load(MODEL_PATH)
    ENCODER = joblib.load(ENCODER_PATH)
except Exception as e:
    print(json.dumps({"error": f"Model loading failed: {str(e)}"}))
    sys.exit(1)

# Keywords for ML feature extraction
KEYWORDS = {
    "fever": ["fever", "high temperature", "feverish"],
    "cough": ["cough", "coughing", "dry cough"],
    "chest_pain": ["chest pain", "pain in chest", "heart pain"],
    "breathing": ["breath", "breathing", "shortness of breath", "breathing difficulty"],
    "headache": ["headache", "head pain", "migraine"],
}

def analyze():
    input_text = sys.stdin.read().lower().strip()

    if not input_text:
        print(json.dumps({
            "diagnosis": "No Data",
            "confidence": "N/A",
            "recommendation": "Please provide symptom descriptions."
        }))
        return

    # ---------------------------------
    # Rule-based medical triage layer
    # ---------------------------------

    HIGH_RISK = [
        "chest pain",
        "shortness of breath",
        "breathing difficulty",
        "fainting",
        "unconscious",
        "severe pain"
    ]

    MILD = [
        "cold",
        "mild cold",
        "slight headache",
        "sneezing",
        "runny nose"
    ]

    # Robust negation detection (handles commas & lists)
    def is_negated(symptom):
        negations = ["no", "not", "do not have", "dont have", "without"]

        for neg in negations:
            neg_index = input_text.find(neg)
            symptom_index = input_text.find(symptom)

            if neg_index != -1 and symptom_index != -1:
                # If symptom appears shortly after a negation phrase
                if 0 < symptom_index - neg_index < 60:
                    return True
        return False

    # 1️⃣ HIGH-risk override (only if NOT negated)
    for s in HIGH_RISK:
        if s in input_text and not is_negated(s):
            print(json.dumps({
                "diagnosis": "High",
                "confidence": "High (Rule-Based Override)",
                "recommendation": "Critical symptoms detected. Seek immediate medical attention."
            }))
            return

    # 2️⃣ LOW-risk override (only mild symptoms)
    if any(s in input_text for s in MILD):
        print(json.dumps({
            "diagnosis": "Low",
            "confidence": "Low (Initial Screening)",
            "recommendation": "Mild symptoms detected. Home care, rest, and hydration advised."
        }))
        return

    # ---------------------------------
    # ML fallback (medium uncertainty)
    # ---------------------------------

    features = [
        1 if any(k in input_text and not is_negated(k) for k in v) else 0
        for v in KEYWORDS.values()
    ]

    try:
        prediction = MODEL.predict([features])[0]
        label = ENCODER.inverse_transform([prediction])[0]

        print(json.dumps({
            "diagnosis": str(label),
            "confidence": "Medium (Neural Analysis)",
            "recommendation": "Monitor symptoms and consult a healthcare professional if they worsen."
        }))
    except Exception as e:
        print(json.dumps({"error": f"Prediction failed: {str(e)}"}))

if __name__ == "__main__":
    analyze()

import sys
import json
import joblib
import os

BASE = os.path.dirname(os.path.abspath(__file__))

def load_resource(filename):
    path1 = os.path.join(BASE, "..", "models", filename)
    path2 = os.path.join(BASE, "models", filename)

    if os.path.exists(path1):
        return joblib.load(path1)
    if os.path.exists(path2):
        return joblib.load(path2)

    raise FileNotFoundError(f"Missing model file: {filename}")

# LOAD MODEL
try:
    MODEL = load_resource("symptom_model.pkl")
    ENCODER = load_resource("symptom_label_encoder.pkl")
except Exception as e:
    print(json.dumps({
        "diagnosis": "System Error",
        "confidence": "N/A",
        "recommendation": f"Model loading failed: {str(e)}"
    }))
    sys.exit(1)

KEYWORDS = {
    "fever": ["fever", "high temperature", "feverish"],
    "cough": ["cough", "coughing", "dry cough"],
    "chest_pain": ["chest pain", "pain in chest"],
    "breathing": ["shortness of breath", "breathing difficulty"],
    "headache": ["headache", "migraine"]
}

def is_negated(phrase, text):
    for neg in ["no", "not", "without", "dont have", "do not have"]:
        if neg in text and phrase in text:
            if text.index(phrase) - text.index(neg) < 60:
                return True
    return False

def analyze():
    raw = sys.stdin.read().strip()
    if not raw:
        print(json.dumps({
            "diagnosis": "No input",
            "confidence": "N/A",
            "recommendation": "No symptoms provided."
        }))
        return

    try:
        parsed = json.loads(raw)
        text = str(parsed.get("symptomData", "")).lower()
    except:
        text = raw.lower()

    HIGH = ["chest pain", "shortness of breath", "breathing difficulty"]
    for h in HIGH:
        if h in text and not is_negated(h, text):
            print(json.dumps({
                "diagnosis": "High Risk",
                "confidence": "High",
                "recommendation": "Seek immediate medical attention."
            }))
            return

    features = []
    for group in KEYWORDS.values():
        found = any(p in text and not is_negated(p, text) for p in group)
        features.append(1 if found else 0)

    try:
        pred = MODEL.predict([features])[0]
        label = ENCODER.inverse_transform([pred])[0]
        print(json.dumps({
            "diagnosis": str(label),
            "confidence": "Medium",
            "recommendation": "Monitor symptoms and consult a doctor."
        }))
    except:
        print(json.dumps({
            "diagnosis": "Inconclusive",
            "confidence": "Low",
            "recommendation": "Consult a healthcare professional."
        }))

if __name__ == "__main__":
    analyze()

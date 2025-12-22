import sys
import json
import joblib
import os

# Absolute path of this file
BASE = os.path.dirname(os.path.abspath(__file__))

# Load ML model and encoder
try:
    # On Render, ensure these paths match your folder structure exactly
    MODEL_PATH = os.path.join(BASE, "..", "models", "symptom_model.pkl")
    ENCODER_PATH = os.path.join(BASE, "..", "models", "symptom_label_encoder.pkl")

    MODEL = joblib.load(MODEL_PATH)
    ENCODER = joblib.load(ENCODER_PATH)
except Exception as e:
    # We print as JSON so the Node.js backend can catch the error properly
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
    try:
        # ✅ FIX: Safely parse JSON input from Node.js
        raw_input = sys.stdin.read().strip()
        if not raw_input:
            raise ValueError("Empty input received")
        
        # If Node.js sends a stringified object/string, parse it
        try:
            input_data = json.loads(raw_input)
            # If the input is just the symptom string
            input_text = str(input_data).lower()
        except:
            input_text = raw_input.lower()

    except Exception as e:
        print(json.dumps({
            "diagnosis": "Error",
            "confidence": "N/A",
            "recommendation": f"Input Error: {str(e)}"
        }))
        return

    # ---------------------------------
    # Rule-based medical triage layer
    # ---------------------------------

    HIGH_RISK = ["chest pain", "shortness of breath", "breathing difficulty", "fainting", "unconscious", "severe pain"]
    MILD = ["cold", "mild cold", "slight headache", "sneezing", "runny nose"]

    def is_negated(symptom):
        negations = ["no", "not", "do not have", "dont have", "without"]
        for neg in negations:
            neg_index = input_text.find(neg)
            symptom_index = input_text.find(symptom)
            if neg_index != -1 and symptom_index != -1:
                if 0 < symptom_index - neg_index < 60:
                    return True
        return False

    # 1️⃣ HIGH-risk override
    for s in HIGH_RISK:
        if s in input_text and not is_negated(s):
            print(json.dumps({
                "diagnosis": "High Risk",
                "confidence": "High (Rule-Based)",
                "recommendation": "Emergency symptoms detected. Please seek immediate medical help or call emergency services."
            }))
            return

    # 2️⃣ LOW-risk override
    if any(s in input_text for s in MILD):
        print(json.dumps({
            "diagnosis": "Low Risk",
            "confidence": "Low (Initial Screening)",
            "recommendation": "Symptoms appear mild. Rest and monitor your condition."
        }))
        return

    # ---------------------------------
    # ML fallback
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
            "recommendation": "Based on analysis, monitor your symptoms and consult a professional if they persist."
        }))
    except Exception as e:
        # Fallback if ML fails but keywords were found
        print(json.dumps({
            "diagnosis": "Inconclusive",
            "confidence": "Low",
            "recommendation": "We couldn't determine a specific condition. Please consult a doctor."
        }))

if __name__ == "__main__":
    analyze()
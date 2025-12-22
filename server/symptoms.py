import sys
import json
import joblib
import os

# Get the directory where symptoms.py is located
BASE = os.path.dirname(os.path.abspath(__file__))

def load_resource(filename):
    """
    Production-grade path resolver to find model files.
    Tries multiple common locations to prevent 'File Not Found' errors on Render.
    """
    # Path 1: Look in ../models (Relative to 'server' folder)
    path1 = os.path.abspath(os.path.join(BASE, "..", "models", filename))
    # Path 2: Look in ./models (Inside 'server' folder)
    path2 = os.path.abspath(os.path.join(BASE, "models", filename))
    
    if os.path.exists(path1):
        return joblib.load(path1)
    elif os.path.exists(path2):
        return joblib.load(path2)
    else:
        raise FileNotFoundError(f"Could not find {filename} at {path1} or {path2}")

# Load ML model and encoder
try:
    MODEL = load_resource("symptom_model.pkl")
    ENCODER = load_resource("symptom_label_encoder.pkl")
except Exception as e:
    # Print as JSON so Node.js can catch the specific error
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
        # ✅ FIX: Safely read and parse input from Node.js
        raw_input = sys.stdin.read().strip()
        if not raw_input:
            raise ValueError("No input received")
        
        # Handle if Node.js sends a JSON string or a plain string
        try:
            input_data = json.loads(raw_input)
            # If Node.js sent { "symptomData": "..." }, extract it
            if isinstance(input_data, dict) and "symptomData" in input_data:
                input_text = str(input_data["symptomData"]).lower()
            else:
                input_text = str(input_data).lower()
        except:
            input_text = raw_input.lower()

    except Exception as e:
        print(json.dumps({
            "diagnosis": "System Error",
            "confidence": "N/A",
            "recommendation": f"Input Processing Error: {str(e)}"
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
                # If negation appears within 60 characters before the symptom
                if 0 < symptom_index - neg_index < 60:
                    return True
        return False

    # 1️⃣ HIGH-risk override (Only if NOT negated)
    for s in HIGH_RISK:
        if s in input_text and not is_negated(s):
            print(json.dumps({
                "diagnosis": "High Risk",
                "confidence": "High (Rule-Based Override)",
                "recommendation": "Emergency symptoms detected. Please seek immediate medical help or call emergency services."
            }))
            return

    # 2️⃣ LOW-risk override
    if any(s in input_text for s in MILD):
        print(json.dumps({
            "diagnosis": "Low Risk",
            "confidence": "Low (Initial Screening)",
            "recommendation": "Symptoms appear mild. Ensure rest and hydration. Consult a doctor if symptoms persist."
        }))
        return

    # ---------------------------------
    # ML Fallback
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
            "recommendation": "Based on the neural scan, monitor your symptoms and consult a professional for a formal diagnosis."
        }))
    except Exception as e:
        print(json.dumps({
            "diagnosis": "Inconclusive",
            "confidence": "Low",
            "recommendation": "We couldn't determine a specific condition. Please consult a healthcare professional."
        }))

if __name__ == "__main__":
    analyze()
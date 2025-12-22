import sys
import json
import joblib
import os

# --------------------------------------------------
# PATH RESOLUTION (RENDER SAFE)
# --------------------------------------------------
BASE = os.path.dirname(os.path.abspath(__file__))

def load_resource(filename):
    """
    Production-grade resolver for Render / local / CI.
    """
    path1 = os.path.abspath(os.path.join(BASE, "..", "models", filename))
    path2 = os.path.abspath(os.path.join(BASE, "models", filename))

    if os.path.exists(path1):
        return joblib.load(path1)
    if os.path.exists(path2):
        return joblib.load(path2)

    raise FileNotFoundError(f"Missing model file: {filename}")

# --------------------------------------------------
# LOAD MODEL + ENCODER (FAIL FAST)
# --------------------------------------------------
try:
    MODEL = load_resource("symptom_model.pkl")
    ENCODER = load_resource("symptom_label_encoder.pkl")
except Exception as e:
    print(json.dumps({
        "diagnosis": "System Error",
        "confidence": "N/A",
        "recommendation": f"Model loading failed: {str(e)}"
    }))
    sys.stdout.flush()
    sys.exit(1)

# --------------------------------------------------
# FEATURE KEYWORDS
# --------------------------------------------------
KEYWORDS = {
    "fever": ["fever", "high temperature", "feverish"],
    "cough": ["cough", "coughing", "dry cough"],
    "chest_pain": ["chest pain", "pain in chest", "heart pain"],
    "breathing": ["shortness of breath", "breathing difficulty"],
    "headache": ["headache", "head pain", "migraine"]
}

# --------------------------------------------------
# NEGATION DETECTOR
# --------------------------------------------------
def is_negated(phrase, text):
    negations = ["no", "not", "do not have", "dont have", "without"]
    for neg in negations:
        neg_index = text.find(neg)
        phrase_index = text.find(phrase)
        if neg_index != -1 and phrase_index != -1:
            if 0 < phrase_index - neg_index < 60:
                return True
    return False

# --------------------------------------------------
# MAIN ANALYSIS
# --------------------------------------------------
def analyze():
    try:
        raw_input = sys.stdin.read().strip()
        if not raw_input:
            raise ValueError("No input received from Node.js")

        try:
            parsed = json.loads(raw_input)
            if isinstance(parsed, dict) and "symptomData" in parsed:
                input_text = str(parsed["symptomData"]).lower()
            else:
                input_text = str(parsed).lower()
        except json.JSONDecodeError:
            input_text = raw_input.lower()

    except Exception as e:
        print(json.dumps({
            "diagnosis": "System Error",
            "confidence": "N/A",
            "recommendation": f"Input error: {str(e)}"
        }))
        sys.stdout.flush()
        return

    # --------------------------------------------------
    # RULE-BASED TRIAGE (OVERRIDES)
    # --------------------------------------------------
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

    for phrase in HIGH_RISK:
        if phrase in input_text and not is_negated(phrase, input_text):
            print(json.dumps({
                "diagnosis": "High Risk",
                "confidence": "High (Rule-Based Override)",
                "recommendation": "Emergency symptoms detected. Seek immediate medical help."
            }))
            sys.stdout.flush()
            return

    for phrase in MILD:
        if phrase in input_text:
            print(json.dumps({
                "diagnosis": "Low Risk",
                "confidence": "Low (Initial Screening)",
                "recommendation": "Symptoms appear mild. Rest, hydrate, and monitor."
            }))
            sys.stdout.flush()
            return

    # --------------------------------------------------
    # ML FALLBACK (STABLE FEATURE VECTOR)
    # --------------------------------------------------
    features = []
    for phrases in KEYWORDS.values():
        detected = False
        for phrase in phrases:
            if phrase in input_text and not is_negated(phrase, input_text):
                detected = True
                break
        features.append(1 if detected else 0)

    try:
        prediction = MODEL.predict([features])[0]
        label = ENCODER.inverse_transform([prediction])[0]

        print(json.dumps({
            "diagnosis": str(label),
            "confidence": "Medium (Neural Analysis)",
            "recommendation": "Monitor symptoms and consult a healthcare professional."
        }))
        sys.stdout.flush()

    except Exception:
        print(json.dumps({
            "diagnosis": "Inconclusive",
            "confidence": "Low",
            "recommendation": "Unable to determine condition. Please consult a doctor."
        }))
        sys.stdout.flush()

# --------------------------------------------------
# ENTRY POINT
# --------------------------------------------------
if __name__ == "__main__":
    analyze()

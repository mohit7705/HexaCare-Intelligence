import sys
import json

def analyze_diabetes():
    try:
        # Read input sent from Node.js via stdin
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"error": "No input received"}))
            return

        data = json.loads(input_data)

        age = int(data.get("age", 0))
        bmi = float(data.get("bmi", 0))
        glucose = float(data.get("glucose", 0))
        family_history = int(data.get("family_history", 0))

        # SIMPLE RULE-BASED LOGIC (same as your original)
        if glucose > 140 or bmi > 30 or family_history == 1:
            risk = "High"
            probability = 0.75
        elif glucose > 110 or bmi > 25:
            risk = "Moderate"
            probability = 0.45
        else:
            risk = "Low"
            probability = 0.15

        # Output JSON (Node.js will read this)
        result = {
            "risk": risk,
            "probability": probability,
            "message": "This is an AI-based diabetes risk screening. Please consult a doctor for confirmation."
        }

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))


if __name__ == "__main__":
    analyze_diabetes()

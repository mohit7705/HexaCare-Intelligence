# server/heart.py
import sys
import json

def predict_heart_risk():
    try:
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"error": "No input data received"}))
            return

        data = json.loads(input_data)

        # Extract inputs safely (defaults prevent NaN)
        age = int(data.get("age", 0))
        systolic_bp = int(data.get("systolic_bp", 0))
        diastolic_bp = int(data.get("diastolic_bp", 80))
        cholesterol = int(data.get("cholesterol", 0))
        heart_rate = int(data.get("heart_rate", 70))
        smoker = int(data.get("smoker", 0))
        diabetic = int(data.get("diabetic", 0))
        family_history = int(data.get("family_history", 0))

        score = 0

        # Age
        if age > 55:
            score += 2
        elif age > 40:
            score += 1

        # Blood Pressure
        if systolic_bp > 140 or diastolic_bp > 90:
            score += 2
        elif systolic_bp > 130:
            score += 1

        # Cholesterol
        if cholesterol > 240:
            score += 2
        elif cholesterol > 200:
            score += 1

        # Heart Rate
        if heart_rate > 100:
            score += 1

        # Lifestyle
        score += smoker
        score += diabetic
        score += family_history

        # Final result
        if score >= 6:
            risk = "High"
            probability = 0.8
        elif score >= 3:
            risk = "Moderate"
            probability = 0.5
        else:
            risk = "Low"
            probability = 0.2

        print(json.dumps({
            "risk": risk,
            "probability": probability,
            "message": "This is an AI-based heart risk screening, not a medical diagnosis."
        }))

    except Exception as e:
        print(json.dumps({"error": str(e)}))


if __name__ == "__main__":
    predict_heart_risk()

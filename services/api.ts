// services/api.ts
import { HeartRiskInput, RiskResult } from "../types";

// ✅ API BASE (Render / Vercel safe)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * 1️⃣ Heart Risk Analysis (FINAL & FIXED)
 */
export const assessRisk = async (
  data: HeartRiskInput
): Promise<RiskResult> => {
  const payload = {
    userEmail: data.userEmail || "guest@hexacare.ai",
    age: Number(data.age),
    systolic_bp: Number(data.systolic_bp),
    diastolic_bp: Number(data.diastolic_bp || 80),
    cholesterol: Number(data.cholesterol || 200),
    heart_rate: Number(data.heart_rate || 70),
    is_smoker: Boolean(data.is_smoker),
    is_diabetic: Boolean(data.is_diabetic),
    family_history: Boolean(data.family_history),
  };

  console.log("Service sending to Backend (Heart):", payload);

  const response = await fetch(`${API_BASE_URL}/heart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Heart API Error:", errorData);
    throw new Error("Heart risk analysis failed");
  }

  const dataFromServer = await response.json();
  const scan = dataFromServer.scan || {};

  // ✅ NORMALIZED RESULT FOR UI
  return {
    risk: scan.prediction || "Low",
    message:
      scan.recommendation ||
      "This is an AI-based heart risk assessment. Please consult a doctor.",
    probability: scan.confidence
      ? parseInt(scan.confidence.replace("%", ""), 10) / 100
      : 0,
  };
};

/**
 * 2️⃣ Symptom Analysis (UNCHANGED & SAFE)
 */
export const analyzeSymptoms = async (
  symptoms: string,
  userEmail: string = "guest@hexacare.ai"
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/symptoms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms, userEmail }),
    });

    if (!response.ok) throw new Error("Offline");
    return await response.json();
  } catch (error) {
    console.error("Connection Error:", error);
    throw error;
  }
};

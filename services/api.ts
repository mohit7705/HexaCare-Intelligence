// services/api.ts
import { RiskInput, RiskResult } from '../types';

// Use the environment variable, or fallback to localhost for local development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * 1. Heart Risk Analysis
 */
export const assessRisk = async (data: any): Promise<RiskResult> => {
  const payload = {
    userEmail: data.userEmail || "guest@hexacare.ai",
    age: Number(data.age),
    systolic_bp: Number(data.systolic_bp),
    diastolic_bp: data.diastolic_bp || 80,
    cholesterol: data.cholesterol || 200,
    heart_rate: data.heart_rate || 70,
    is_smoker: data.is_smoker || false,
    is_diabetic: data.is_diabetic || false,
    family_history: data.family_history || false,
  };

  console.log("Service sending to Backend (Heart):", payload);

  const response = await fetch(`${API_BASE_URL}/heart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Server Error details:", errorData);
    throw new Error('Heart risk analysis failed');
  }

  return await response.json();
};

/**
 * 2. Symptom Analysis (This fixes the "System Offline" for the Symptom Checker)
 */
export const analyzeSymptoms = async (symptoms: string, userEmail: string = "guest@hexacare.ai") => {
  try {
    const response = await fetch(`${API_BASE_URL}/symptoms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms, userEmail }),
    });

    if (!response.ok) throw new Error('Offline');
    return await response.json();
  } catch (error) {
    console.error("Connection Error:", error);
    throw error; // This will trigger the "System Offline" UI state
  }
};
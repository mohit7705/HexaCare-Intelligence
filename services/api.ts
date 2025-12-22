// services/api.ts
import { RiskInput, RiskResult } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// We update the function to accept the full data including userEmail
export const assessRisk = async (data: any): Promise<RiskResult> => {
  
  // 🔒 Normalize & complete payload including the email
  const payload = {
    userEmail: data.userEmail || "guest@hexacare.ai", // 👈 THIS FIXES THE UNDEFINED ERROR
    age: Number(data.age),
    systolic_bp: Number(data.systolic_bp),
    diastolic_bp: data.diastolic_bp || 80,
    cholesterol: data.cholesterol || 200,
    heart_rate: data.heart_rate || 70,
    is_smoker: data.is_smoker || false,
    is_diabetic: data.is_diabetic || false,
    family_history: data.family_history || false,
  };

  console.log("Service sending to Backend:", payload);

  const response = await fetch(`${API_BASE_URL}/heart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Server Error details:", errorData);
    throw new Error('Heart risk analysis failed');
  }

  return await response.json();
};
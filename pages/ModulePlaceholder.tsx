import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const MODULE_TITLES: Record<string, string> = {
  "symptom-checker": "Symptom Checker",
  "diabetes": "Diabetes Risk Prediction",
  "heart": "Heart Disease Risk Analysis",
  "mental-health": "Mental Health Screening",
  "skin-ai": "Skin Disease Detection (Vision AI)",
  "womens-health": "Women’s Health Screening",
};

const ModulePlaceholder: React.FC = () => {
  const { moduleName } = useParams<{ moduleName: string }>();
  const navigate = useNavigate();

  const title =
    (moduleName && MODULE_TITLES[moduleName]) || "Health Module";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-navy mb-4">
        {title}
      </h1>

      <p className="text-gray-600 max-w-xl mb-6">
        This module is currently under development and will be available
        in the next step. The routing and security are already active.
      </p>

      <div className="bg-gray-100 border border-gray-300 rounded-xl p-6 max-w-md w-full">
        <p className="text-sm text-gray-700">
          ✅ Route protection working  
          <br />
          ✅ Module structure locked  
          <br />
          🚧 AI logic coming in next steps
        </p>
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-8 px-6 py-3 rounded-xl bg-techBlue text-white font-semibold hover:opacity-90 transition"
      >
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default ModulePlaceholder;

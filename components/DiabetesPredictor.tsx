import React, { useState } from "react";
import { auth } from "../firebase";
import { saveHistory } from "../services/saveHistory";

// ✅ API BASE (same as Symptom + Mental Health)
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const DiabetesPredictor: React.FC = () => {
  const [form, setForm] = useState({
    age: "",
    bmi: "",
    glucose: "",
    family_history: "0",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    risk: string;
    probability: number;
    message?: string;
  }>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async () => {
    if (!form.age || !form.bmi || !form.glucose) {
      alert("Please fill all required health parameters.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/diabetes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: Number(form.age),
          bmi: Number(form.bmi),
          glucose: Number(form.glucose),
          family_history: Number(form.family_history),
          userEmail: auth.currentUser?.email || "anonymous@hexacare.ai",
        }),
      });

      if (!res.ok) {
        throw new Error(`Server Error: ${res.status}`);
      }

      const data = await res.json();

      const finalResult = {
        risk: data.risk,
        probability: data.probability,
        message: data.message,
      };

      setResult(finalResult);

      // ✅ SAVE HISTORY (NON-BLOCKING)
      if (auth.currentUser) {
        try {
          await saveHistory(
            auth.currentUser.uid,
            "diabetes_prediction",
            "Diabetes Risk Prediction",
            { ...form },
            finalResult
          );
        } catch (historyError) {
          console.warn("History save failed:", historyError);
        }
      }
    } catch (err) {
      console.error("Diabetes API Error:", err);
      setResult({
        risk: "System Offline",
        probability: 0,
        message:
          "Unable to connect to the diabetes prediction service. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white/70 p-10 rounded-3xl shadow border">
      <h2 className="text-3xl font-black text-[#001e3c] mb-2">
        Diabetes Risk Prediction
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          className="p-4 border rounded-xl"
        />

        <input
          type="number"
          step="0.1"
          name="bmi"
          placeholder="BMI"
          value={form.bmi}
          onChange={handleChange}
          className="p-4 border rounded-xl"
        />

        <input
          type="number"
          name="glucose"
          placeholder="Glucose"
          value={form.glucose}
          onChange={handleChange}
          className="p-4 border rounded-xl"
        />

        <select
          name="family_history"
          value={form.family_history}
          onChange={handleChange}
          className="p-4 border rounded-xl"
        >
          <option value="0">No Family History</option>
          <option value="1">Family History</option>
        </select>
      </div>

      <button
        onClick={handlePredict}
        disabled={loading}
        className={`mt-8 w-full py-4 rounded-xl font-bold text-white transition-all ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#0070f3] hover:bg-[#005bc1]"
        }`}
      >
        {loading ? "Analyzing..." : "Run Prediction"}
      </button>

      {result && (
        <div
          className={`mt-8 p-6 rounded-xl ${
            result.risk === "System Offline"
              ? "bg-red-50 border border-red-200 text-red-800"
              : "bg-[#001e3c] text-white"
          }`}
        >
          <h3 className="text-2xl font-bold">{result.risk}</h3>
          <p className="mt-2">{result.message}</p>

          {result.risk !== "System Offline" && (
            <p className="mt-2 text-sm">
              Probability: {(result.probability * 100).toFixed(0)}%
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DiabetesPredictor;

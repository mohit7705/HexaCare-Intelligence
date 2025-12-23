import { useState } from "react";
import "./symptom.css";
import { auth } from "../firebase";
import { saveHistory } from "../services/saveHistory";

// ✅ API BASE (safe fallback)
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    if (!symptoms.trim()) {
      alert("Please enter your symptoms first.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptomData: symptoms,
          userEmail: auth.currentUser?.email || "anonymous@hexacare.ai",
        }),
      });

      if (!res.ok) {
        throw new Error(`Server Error: ${res.status}`);
      }

      const data = await res.json();

      const finalResult = {
        risk: data.prediction ?? "Health Insight Generated",
        message:
          data.recommendation ??
          "Please consult a qualified medical professional for a formal diagnosis.",
        guidance: data.confidence ?? "N/A",
      };

      setResult(finalResult);

      // ✅ Save history only if logged in
      if (auth.currentUser) {
        try {
          await saveHistory(
            auth.currentUser.uid,
            "symptom_checker",
            "Symptom Checker",
            { symptoms },
            finalResult
          );
        } catch (historyError) {
          console.error("History save failed:", historyError);
        }
      }
    } catch (error) {
      console.error("API / Network Error:", error);
      setResult({
        risk: "System Offline",
        message:
          "Unable to connect to the AI engine. Please check your backend service or try again later.",
        guidance: null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-8 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl">
      <h1 className="text-3xl font-black mb-6">AI Symptom Analysis</h1>

      <textarea
        className="w-full h-48 p-6 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-[#0070f3] outline-none transition-all mb-6"
        placeholder="Describe your symptoms (e.g., 'I have a high fever and a persistent cough')..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        disabled={loading}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#0070f3] hover:bg-[#005bc1] active:scale-95"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">🌀</span> Analyzing...
          </span>
        ) : (
          "Start Health Scan"
        )}
      </button>

      {/* ✅ RESULT SECTION (ONLY AFTER SCAN) */}
      {result && (
        <div
          className={`mt-8 p-6 rounded-xl border ${
            result.risk === "System Offline"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-[#001e3c] border-[#002d5a] text-white"
          }`}
        >
          <h2 className="text-xl font-bold flex items-center gap-2">
            {result.risk === "System Offline" && "⚠️"}
            {result.risk}
          </h2>

          <p className="mt-2 opacity-90">{result.message}</p>

          {result.guidance && result.risk !== "System Offline" && (
            <div className="mt-4 pt-4 border-t border-white/10 text-sm italic">
              Confidence Score: {result.guidance}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default SymptomChecker;

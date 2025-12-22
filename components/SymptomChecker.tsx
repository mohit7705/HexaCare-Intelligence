import { useState } from "react";
import "./symptom.css";
import { auth } from "../firebase";
import { saveHistory } from "../services/saveHistory";

// ✅ API base URL (local vs production handled automatically)
const API_BASE = import.meta.env.VITE_API_BASE_URL;

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
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptomData: symptoms,
          userEmail: auth.currentUser?.email || "anonymous",
        }),
      });

      if (!res.ok) {
        throw new Error("Server response error");
      }

      const data = await res.json();

      const finalResult = {
        risk: data.prediction,
        message: data.recommendation,
        guidance: data.confidence,
      };

      setResult(finalResult);

      // ✅ SAVE HISTORY
      if (auth.currentUser) {
        await saveHistory(
          auth.currentUser.uid,
          "symptom_checker",
          "Symptom Checker",
          { symptoms },
          finalResult
        );
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setResult({
        risk: "System Offline",
        message:
          "Unable to connect to the neural engine. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-8 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl">
      <h1 className="text-3xl font-black mb-6">AI Symptom Analysis</h1>

      <textarea
        className="w-full h-48 p-6 rounded-3xl border mb-6"
        placeholder="Describe your symptoms..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 rounded-xl bg-[#0070f3] text-white font-bold"
      >
        {loading ? "Analyzing..." : "Start Health Scan"}
      </button>

      {result && (
        <div className="mt-8 p-6 rounded-xl bg-[#001e3c] text-white">
          <h2 className="text-xl font-bold">{result.risk}</h2>
          <p className="mt-2">{result.message}</p>
        </div>
      )}
    </section>
  );
};

export default SymptomChecker;

import React, { useState } from "react";
import { mentalHealthQuestions } from "../../src/config/mentalHealthQuestions";
import QuestionItem from "./QuestionItem";
import Disclaimer from "./Disclaimer";
import ResultsCard from "./ResultsCard";
import { auth } from "../../firebase";
import { saveHistory } from "../../services/saveHistory";
import { generateReport } from "../../services/reportEngine";

type ResultCategory = "Low" | "Moderate" | "High";

// ✅ API BASE (same pattern as SymptomChecker)
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const MentalHealthScreening: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [resultData, setResultData] = useState<{
    score: number;
    category: ResultCategory;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === mentalHealthQuestions.length;
  const progress = (answeredCount / mentalHealthQuestions.length) * 100;

  const handleAnswer = (id: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (!isComplete) return;

    setIsLoading(true);
    setError(null);

    try {
      const responses = mentalHealthQuestions.map((q) => answers[q.id]);

      const res = await fetch(`${API_BASE}/mental-health`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          responses,
          userEmail: auth.currentUser?.email || "anonymous@hexacare.ai",
        }),
      });

      if (!res.ok) {
        throw new Error(`Server Error: ${res.status}`);
      }

      const data = await res.json();

      const finalResult = {
        score: Number(data.score),
        category: data.level as ResultCategory,
      };

      // ✅ SHOW RESULT IMMEDIATELY
      setResultData(finalResult);

      // ===============================
      // 🔐 OPTIONAL: PDF + STELLAR (NON-BLOCKING)
      // ===============================
      try {
        await generateReport({
          toolId: "mental_health",
          toolName: "Mental Health Screening",
          input: { answers: responses },
          result: {
            risk: finalResult.category,
            message: `Your mental health level is ${finalResult.category}`,
          },
        });
      } catch (stellarError) {
        console.warn("Stellar write failed (non-blocking):", stellarError);
      }

      // ===============================
      // 📚 SAVE HISTORY (NON-BLOCKING)
      // ===============================
      if (auth.currentUser) {
        try {
          await saveHistory(
            auth.currentUser.uid,
            "mental_health",
            "Mental Health Screening",
            { answers: responses },
            {
              risk: finalResult.category,
              message: `Your mental health level is ${finalResult.category}`,
              guidance:
                finalResult.category === "High"
                  ? "Please consider professional mental health support."
                  : finalResult.category === "Moderate"
                  ? "Mindfulness and stress management may help."
                  : "Your mental wellbeing appears stable.",
            }
          );
        } catch (historyError) {
          console.warn("History save failed:", historyError);
        }
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Mental Health API Error:", err);
      setError("Unable to submit assessment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setResultData(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-brand-600 mb-6 uppercase">
          HexaCare Intelligence AI
        </h2>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">
            Mental Health Check-in
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            A private self-assessment to understand your wellbeing.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {resultData ? (
          <ResultsCard
            score={resultData.score}
            category={resultData.category}
            onRetake={handleRetake}
          />
        ) : (
          <>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6">
              <div
                className="bg-brand-600 h-2.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm text-slate-500 mb-6 text-right">
              {answeredCount} of {mentalHealthQuestions.length} completed
            </p>

            <div className="space-y-6">
              {mentalHealthQuestions.map((q) => (
                <QuestionItem
                  key={q.id}
                  question={q}
                  selectedValue={answers[q.id]}
                  onChange={(val) => handleAnswer(q.id, val)}
                />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isComplete || isLoading}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  isComplete
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Analyzing..." : "See My Results"}
              </button>
            </div>
          </>
        )}

        <div className="mt-12">
          <Disclaimer />
        </div>
      </div>
    </div>
  );
};

export default MentalHealthScreening;

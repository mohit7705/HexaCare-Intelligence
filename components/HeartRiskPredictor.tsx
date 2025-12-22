import React, { useEffect, useState } from "react";
import HeartRiskForm from "./HeartRiskForm";
import HeartRiskResult from "./HeartRiskResult";
import { RiskResult } from "../types";

// 🔐 Firebase
import { auth } from "../firebase";
import { saveHistory } from "../services/saveHistory";

const HeartRiskPredictor: React.FC = () => {
  const [result, setResult] = useState<RiskResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ SAVE HISTORY WHEN RESULT IS READY
  useEffect(() => {
    const persistHistory = async () => {
      if (!result || !auth.currentUser) return;

      try {
        await saveHistory(
          auth.currentUser.uid,
          "heart_risk_analysis",
          "Heart Risk Analysis",
          {}, // no input object available in RiskResult
          {
            risk: result.risk,
            message: result.message,
          }
        );
      } catch (error) {
        console.error("Failed to save heart risk history:", error);
      }
    };

    persistHistory();
  }, [result]);

  return (
    <div className="max-w-4xl mx-auto bg-white/40 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl border border-white/50">
      {!result ? (
        <HeartRiskForm
          setResult={setResult}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
      ) : (
        <HeartRiskResult
          result={result}
          onReset={() => setResult(null)}
        />
      )}
    </div>
  );
};

export default HeartRiskPredictor;

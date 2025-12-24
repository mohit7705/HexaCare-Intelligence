import React from "react";
import { useForm } from "react-hook-form";
import { HeartRiskInput, RiskResult } from "../types";
import { assessRisk } from "../services/api";
import { Loader2, HeartPulse } from "lucide-react";

interface Props {
  setResult: (r: RiskResult) => void;
  setIsLoading: (b: boolean) => void;
  isLoading: boolean;
}

const HeartRiskForm: React.FC<Props> = ({
  setResult,
  setIsLoading,
  isLoading,
}) => {
  const { register, handleSubmit } = useForm<HeartRiskInput>();

  const onSubmit = async (data: HeartRiskInput) => {
    setIsLoading(true);
    try {
      const payload: HeartRiskInput = {
        userEmail: "user@hexacare.ai",
        ...data,
      };

      const result = await assessRisk(payload);
      setResult(result);
    } catch (error) {
      alert("Heart risk analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-3xl p-10 shadow-xl border border-slate-200 space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Heart Health Assessment
        </h2>
        <p className="text-slate-600 mt-1">
          Complete the form below to receive an AI-powered estimation of your
          cardiovascular risk.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          {...register("age")}
          type="number"
          placeholder="Age (e.g. 45)"
          required
          className="p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
        />

        <input
          {...register("systolic_bp")}
          type="number"
          placeholder="Systolic BP (mmHg)"
          required
          className="p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
        />

        <input
          {...register("diastolic_bp")}
          type="number"
          placeholder="Diastolic BP (mmHg)"
          required
          className="p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
        />

        <input
          {...register("cholesterol")}
          type="number"
          placeholder="Cholesterol (mg/dL)"
          required
          className="p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
        />

        <input
          {...register("heart_rate")}
          type="number"
          placeholder="Heart Rate (bpm)"
          required
          className="p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Risk Factors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <label className="flex items-center gap-3 p-4 border rounded-xl">
          <input type="checkbox" {...register("is_smoker")} />
          <span>Current Smoker</span>
        </label>

        <label className="flex items-center gap-3 p-4 border rounded-xl">
          <input type="checkbox" {...register("is_diabetic")} />
          <span>Diabetic</span>
        </label>

        <label className="flex items-center gap-3 p-4 border rounded-xl">
          <input type="checkbox" {...register("family_history")} />
          <span>Family History</span>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white transition-all ${
          isLoading
            ? "bg-slate-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            Calculating Risk...
          </>
        ) : (
          <>
            <HeartPulse />
            Calculate My Risk
          </>
        )}
      </button>
    </form>
  );
};

export default HeartRiskForm;

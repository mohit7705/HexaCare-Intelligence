import React from 'react';
import { AnalysisResult, RiskLevel, ConditionType } from '../types';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case RiskLevel.LOW: return 'bg-emerald-500 text-white';
    case RiskLevel.MILD: return 'bg-yellow-500 text-white';
    case RiskLevel.MODERATE: return 'bg-orange-500 text-white';
    case RiskLevel.HIGH: return 'bg-red-500 text-white';
    default: return 'bg-slate-500 text-white';
  }
};

const getRiskBorder = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.LOW: return 'border-emerald-200 bg-emerald-50';
      case RiskLevel.MILD: return 'border-yellow-200 bg-yellow-50';
      case RiskLevel.MODERATE: return 'border-orange-200 bg-orange-50';
      case RiskLevel.HIGH: return 'border-red-200 bg-red-50';
      default: return 'border-slate-200 bg-slate-50';
    }
  };

export const AnalysisResultCard: React.FC<Props> = ({ result, onReset }) => {
  const isHealthy = result.condition === ConditionType.HEALTHY;

  return (
    <div className="w-full animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Header Band */}
        <div className={`px-6 py-4 flex items-center justify-between ${isHealthy ? 'bg-emerald-600' : 'bg-slate-900'}`}>
          <h2 className="text-white font-semibold flex items-center gap-2">
            {isHealthy ? <CheckCircle2 className="w-5 h-5"/> : <Info className="w-5 h-5"/>}
            Analysis Report
          </h2>
          <span className="text-white/80 text-xs font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
        </div>

        <div className="p-6 sm:p-8">
            {/* Top Row: Condition & Risk Badge */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Detected Condition
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
                        {result.condition}
                    </h3>
                    <p className="text-slate-500 mt-2 max-w-lg leading-relaxed">
                        {result.description}
                    </p>
                </div>
                <div className={`px-4 py-2 rounded-lg flex flex-col items-center justify-center min-w-[100px] ${getRiskColor(result.risk)}`}>
                    <span className="text-[10px] uppercase font-bold opacity-90">Risk Level</span>
                    <span className="text-xl font-bold">{result.risk}</span>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-medium text-slate-600">AI Confidence</span>
                        <span className="text-lg font-bold text-slate-900">{result.confidence}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-teal-600 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${result.confidence}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                        Probability of correct classification based on visual features.
                    </p>
                </div>

                <div className={`rounded-xl p-4 border ${getRiskBorder(result.risk)}`}>
                    <div className="flex items-center gap-2 mb-2">
                         <AlertCircle className={`w-4 h-4 ${result.risk === RiskLevel.LOW ? 'text-emerald-600' : 'text-orange-600'}`} />
                         <span className="text-sm font-bold text-slate-700">Recommendation</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        {result.recommendation}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
                <button 
                    onClick={onReset}
                    className="flex-1 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors shadow-lg shadow-slate-900/20"
                >
                    Analyze Another Image
                </button>
                <button className="flex-1 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-colors">
                    Save Report (PDF)
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { ResultCategory } from '../utils/scoring';

interface ResultsCardProps {
  score: number;
  category: ResultCategory;
  onRetake: () => void;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ score, category, onRetake }) => {
  return (
    <div className={`bg-gradient-to-br ${category.bgStart} ${category.bgEnd} rounded-2xl p-8 shadow-lg border border-white/50 animate-fade-in`}>
      
      {/* Score Badge */}
      <div className="flex flex-col items-center mb-8">
        <div className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">Your Wellbeing Status</div>
        <h2 className={`text-3xl sm:text-4xl font-bold ${category.color} mb-2`}>
          {category.label}
        </h2>
        <div className="text-slate-400 text-xs font-mono">
          Screening Score: {score}/30
        </div>
      </div>

      {/* Description */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/60">
        <p className="text-slate-700 text-lg leading-relaxed text-center">
          {category.description}
        </p>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-500"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
          Recommended Steps
        </h3>
        <ul className="space-y-3">
           {category.recommendations && category.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm border border-slate-100">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold mt-0.5">
                {idx + 1}
              </span>
              <span className="text-slate-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Crisis Warning for High Concern */}
      {category.level === 'high' && (
        <div className="bg-rose-100 border border-rose-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600 flex-shrink-0 mt-1"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <div>
            <h4 className="font-bold text-rose-800">Need immediate help?</h4>
            <p className="text-sm text-rose-700 mt-1">
              If you are in crisis, please call emergency services or a dedicated helpline in your country immediately.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center pt-4 border-t border-slate-200/50">
        <button
          onClick={onRetake}
          className="text-slate-500 hover:text-brand-600 font-medium flex items-center gap-2 transition-colors px-4 py-2 rounded-lg hover:bg-white/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Retake Assessment
        </button>
      </div>
    </div>
  );
};

export default ResultsCard;
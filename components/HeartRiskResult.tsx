import React, { useEffect, useState } from 'react';
import { RiskResult } from '../types';
import { RotateCcw, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RiskResultDisplayProps {
  result: RiskResult;
  onReset: () => void;
}

const HeartRiskResult: React.FC<RiskResultDisplayProps> = ({ result, onReset }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  // ✅ SAFE probability normalization
  const probability =
    typeof result.probability === 'number' && !isNaN(result.probability)
      ? Math.min(Math.max(result.probability, 0), 1)
      : 0;

  const displayScore = Math.round(probability * 100);

  // ✅ Stable animation
  useEffect(() => {
    let current = 0;
    const steps = 40;
    const increment = displayScore / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= displayScore) {
        setAnimatedScore(displayScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [displayScore]);

  const getColor = (risk: string) => {
    if (risk === 'High') return '#ef4444';
    if (risk === 'Moderate') return '#f59e0b';
    return '#0ea5e9';
  };

  const color = getColor(result.risk);

  const data = [
    { name: 'Risk', value: animatedScore },
    { name: 'Remaining', value: 100 - animatedScore },
  ];

  return (
    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">

      {/* Risk Badge */}
      <div
        className={`px-4 py-1.5 rounded-full text-sm font-bold mb-8 uppercase flex items-center gap-2
          ${
            result.risk === 'High'
              ? 'bg-red-50 text-red-600'
              : result.risk === 'Moderate'
              ? 'bg-amber-50 text-amber-600'
              : 'bg-sky-50 text-sky-600'
          }`}
      >
        {result.risk === 'High' && <AlertCircle className="w-4 h-4" />}
        {result.risk === 'Moderate' && <Info className="w-4 h-4" />}
        {result.risk === 'Low' && <CheckCircle className="w-4 h-4" />}
        {result.risk} Risk Profile
      </div>

      {/* Gauge */}
      <div className="relative w-64 h-32 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={80}
              outerRadius={120}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-end">
          <span className="text-5xl font-bold text-slate-800">
            {animatedScore}%
          </span>
          <span className="text-xs text-slate-400 uppercase">
            Risk Probability
          </span>
        </div>
      </div>

      {/* Message */}
      <div className="text-center max-w-lg mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Analysis Complete
        </h3>
        <p className="text-slate-600 italic">
          {result.message}
        </p>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-6 py-3 border rounded-xl text-slate-600 hover:bg-slate-50"
      >
        <RotateCcw className="w-4 h-4" />
        New Assessment
      </button>
    </div>
  );
};

export default HeartRiskResult;

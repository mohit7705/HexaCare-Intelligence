import React from "react";
import type { Question } from "../../src/config/mentalHealthQuestions";
import { LIKERT_OPTIONS } from "../../src/config/mentalHealthQuestions";

interface QuestionItemProps {
  question: Question;
  selectedValue?: number;
  onChange: (value: number) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  selectedValue,
  onChange,
}) => {
  return (
    <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
      <h3 className="text-lg font-medium text-slate-800 mb-4 leading-relaxed">
        {question.text}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {LIKERT_OPTIONS.map(option => {
          const isSelected = selectedValue === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isSelected}
              className={`
                py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-500
                ${
                  isSelected
                    ? "bg-brand-600 text-white shadow-md scale-[1.02]"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                }
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionItem;

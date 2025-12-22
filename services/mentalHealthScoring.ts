import { Question } from '../data/questions';

export interface ResultCategory {
  level: string;
  label: string;
  description: string;
  color: string;
  bgStart: string;
  bgEnd: string;
  recommendations: string[];
}

// Total possible score is 30 (10 questions * 3 max value)
// Higher score = Higher concern/distress

export const calculateScore = (answers: Record<number, number>, questions: Question[]): number => {
  let totalScore = 0;

  questions.forEach((q) => {
    const value = answers[q.id] || 0;
    
    if (q.type === 'negative') {
      // Direct scoring: Higher value (e.g., "Almost Always" anxious) = Higher concern
      totalScore += value;
    } else {
      // Reverse scoring: Lower value (e.g., "Never" optimistic) = Higher concern
      // 0 -> 3, 1 -> 2, 2 -> 1, 3 -> 0
      totalScore += (3 - value);
    }
  });

  return totalScore;
};

export const getResultCategory = (score: number): ResultCategory => {
  if (score <= 9) {
    return {
      level: 'stable',
      label: 'Stable Wellbeing',
      description: "Your responses suggest you are coping well with daily life. You seem to have good resilience and emotional balance at the moment.",
      color: 'text-emerald-700',
      bgStart: 'from-emerald-50',
      bgEnd: 'to-teal-50',
      recommendations: [
        "Continue your current positive habits (sleep, exercise, socializing).",
        "Practice mindfulness to maintain your mental flexibility.",
        "Reach out to support others who might be struggling."
      ]
    };
  } else if (score <= 16) {
    return {
      level: 'mild',
      label: 'Mild Concern',
      description: "You may be experiencing some stress or mild emotional challenges. This is common and often manageable with self-care.",
      color: 'text-blue-700',
      bgStart: 'from-blue-50',
      bgEnd: 'to-indigo-50',
      recommendations: [
        "Prioritize a consistent sleep schedule.",
        "Take short breaks throughout the day to decompress.",
        "Talk to a friend or family member about what's on your mind."
      ]
    };
  } else if (score <= 23) {
    return {
      level: 'moderate',
      label: 'Moderate Concern',
      description: "Your responses indicate you are facing significant stress or emotional difficulty. Proactive steps are recommended to prevent burnout.",
      color: 'text-amber-700',
      bgStart: 'from-amber-50',
      bgEnd: 'to-orange-50',
      recommendations: [
        "Consider speaking with a counselor or therapist for guidance.",
        "Review your workload and responsibilities; can you delegate?",
        "Engage in structured relaxation techniques (e.g., deep breathing, meditation)."
      ]
    };
  } else {
    return {
      level: 'high',
      label: 'High Concern',
      description: "It looks like you are carrying a heavy emotional load right now. You deserve support, and you don't have to handle this alone.",
      color: 'text-rose-700',
      bgStart: 'from-rose-50',
      bgEnd: 'to-red-50',
      recommendations: [
        "We strongly encourage consulting a mental health professional.",
        "Reach out to a trusted person in your life immediately.",
        "Prioritize your health above other obligations for now."
      ]
    };
  }
};
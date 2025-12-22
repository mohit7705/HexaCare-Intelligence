export type QuestionType = "positive" | "negative";

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
}

export const mentalHealthQuestions: Question[] = [
  {
    id: 1,
    text: "I feel overwhelmed by my daily responsibilities.",
    type: "negative",
  },
  {
    id: 2,
    text: "I feel optimistic about the future.",
    type: "positive",
  },
  {
    id: 3,
    text: "I have trouble falling or staying asleep.",
    type: "negative",
  },
  {
    id: 4,
    text: "I can concentrate on tasks effectively.",
    type: "positive",
  },
  {
    id: 5,
    text: "I feel nervous, anxious, or on edge.",
    type: "negative",
  },
  {
    id: 6,
    text: "I feel supported by friends, family, or colleagues.",
    type: "positive",
  },
  {
    id: 7,
    text: "I find little interest or pleasure in doing things.",
    type: "negative",
  },
  {
    id: 8,
    text: "I have enough energy to get through the day.",
    type: "positive",
  },
  {
    id: 9,
    text: "I feel easily annoyed or irritable.",
    type: "negative",
  },
  {
    id: 10,
    text: "I feel confident in my ability to handle personal problems.",
    type: "positive",
  },
];

export const LIKERT_OPTIONS = [
  { value: 0, label: "Never" },
  { value: 1, label: "Sometimes" },
  { value: 2, label: "Often" },
  { value: 3, label: "Almost Always" },
];

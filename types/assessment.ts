export type DomainSlug = "inference" | "assumptions" | "deduction" | "interpretation" | "arguments";

export type QuestionRecord = {
  id: string;
  family: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type SafeQuestion = Omit<QuestionRecord, "answer" | "explanation"> & {
  position: number;
};

export type SubmittedAnswer = {
  questionId: string;
  selectedIndex: number | null;
  responseTimeMs?: number;
  flagged?: boolean;
};

export type ScoreResult = {
  scoreCorrect: number;
  scoreTotal: number;
  answeredCount: number;
  unansweredCount: number;
  rawScore: number;
  answeredAccuracy: number | null;
  completionRate: number;
  items: Array<{
    questionId: string;
    domain: string;
    selectedIndex: number | null;
    correctIndex: number;
    isCorrect: boolean;
    status: "correct" | "incorrect" | "unanswered";
    explanation: string;
  }>;
};

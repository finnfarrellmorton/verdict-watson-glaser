import type { ScoreResult, SubmittedAnswer } from "@/types/assessment";
import { getQuestionById } from "@/lib/legacy-data";

export function scoreAnswers(answers: SubmittedAnswer[]): ScoreResult {
  const items = answers.map((answer) => {
    const question = getQuestionById(answer.questionId);
    if (!question) {
      throw new Error(`Unknown question: ${answer.questionId}`);
    }
    const isUnanswered = answer.selectedIndex === null || answer.selectedIndex === undefined;
    const isCorrect = !isUnanswered && answer.selectedIndex === question.answer;
    const status: "correct" | "incorrect" | "unanswered" = isUnanswered ? "unanswered" : isCorrect ? "correct" : "incorrect";
    return {
      questionId: question.id,
      domain: question.family,
      selectedIndex: answer.selectedIndex ?? null,
      correctIndex: question.answer,
      isCorrect,
      status,
      explanation: question.explanation
    };
  });

  const scoreCorrect = items.filter((item) => item.isCorrect).length;
  const scoreTotal = items.length;
  const unansweredCount = items.filter((item) => item.status === "unanswered").length;
  const answeredCount = scoreTotal - unansweredCount;

  return {
    scoreCorrect,
    scoreTotal,
    answeredCount,
    unansweredCount,
    rawScore: scoreTotal ? scoreCorrect / scoreTotal : 0,
    answeredAccuracy: answeredCount ? scoreCorrect / answeredCount : null,
    completionRate: scoreTotal ? answeredCount / scoreTotal : 0,
    items
  };
}

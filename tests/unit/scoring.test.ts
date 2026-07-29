import { describe, expect, it } from "vitest";
import { scoreAnswers } from "@/lib/assessment/scoring";
import { getQuestions } from "@/lib/legacy-data";

describe("scoreAnswers", () => {
  it("separates incorrect and unanswered responses", () => {
    const [first, second, third] = getQuestions("inference");
    const result = scoreAnswers([
      { questionId: first.id, selectedIndex: first.answer },
      { questionId: second.id, selectedIndex: null },
      { questionId: third.id, selectedIndex: (third.answer + 1) % third.options.length }
    ]);

    expect(result.scoreCorrect).toBe(1);
    expect(result.scoreTotal).toBe(3);
    expect(result.answeredCount).toBe(2);
    expect(result.unansweredCount).toBe(1);
    expect(result.items.map((item) => item.status)).toEqual(["correct", "unanswered", "incorrect"]);
  });
});

import type { DomainSlug, SafeQuestion } from "@/types/assessment";
import { domains } from "@/lib/assessment/domains";
import { getQuestions } from "@/lib/legacy-data";

export type SelectionInput = {
  mode: "diagnostic" | "mixed" | "domain";
  domain?: DomainSlug;
  count?: number;
};

export function selectQuestions(input: SelectionInput): SafeQuestion[] {
  if (input.mode === "diagnostic") {
    return domains
      .flatMap((domain) => getQuestions(domain.slug).slice(0, 4))
      .slice(0, 20)
      .map(toSafeQuestion);
  }

  if (input.mode === "domain" && input.domain) {
    return getQuestions(input.domain).slice(0, input.count ?? 10).map(toSafeQuestion);
  }

  return getQuestions("mixed").slice(0, input.count ?? 20).map(toSafeQuestion);
}

function toSafeQuestion(question: ReturnType<typeof getQuestions>[number], index: number): SafeQuestion {
  return {
    id: question.id,
    family: question.family,
    prompt: question.prompt,
    options: question.options,
    position: index + 1
  };
}

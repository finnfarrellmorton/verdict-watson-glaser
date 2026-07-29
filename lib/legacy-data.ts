import "server-only";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import type { DomainSlug, QuestionRecord } from "@/types/assessment";
import type { FirmRecord } from "@/types/firms";

type LegacyContext = {
  window: {
    LAW_FIRMS?: FirmRecord[];
    getVerdictQuestions?: (session: string) => QuestionRecord[];
  };
};

let cachedContext: LegacyContext | null = null;

function loadContext() {
  if (cachedContext) return cachedContext;

  const ctx: LegacyContext = { window: {} };
  vm.createContext(ctx);
  for (const file of ["legal-cheek-profile-facts.js", "law-firms.js", "question-bank.js"]) {
    vm.runInContext(fs.readFileSync(path.join(process.cwd(), file), "utf8"), ctx, { filename: file });
  }
  cachedContext = ctx;
  return ctx;
}

export function getQuestions(session: DomainSlug | "daily" | "mixed"): QuestionRecord[] {
  const getter = loadContext().window.getVerdictQuestions;
  if (!getter) return [];
  return getter(session);
}

export function getQuestionById(questionId: string): QuestionRecord | undefined {
  const sessions: Array<DomainSlug> = ["inference", "assumptions", "deduction", "interpretation", "arguments"];
  for (const session of sessions) {
    const question = getQuestions(session).find((item) => item.id === questionId);
    if (question) return question;
  }
  return undefined;
}

export function getFirms(): FirmRecord[] {
  return loadContext().window.LAW_FIRMS ?? [];
}

export function getFirm(slug: string): FirmRecord | undefined {
  return getFirms().find((firm) => firm.slug === slug);
}

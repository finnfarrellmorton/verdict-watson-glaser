import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { selectQuestions } from "@/lib/assessment/selection";

const requestSchema = z.object({
  mode: z.enum(["diagnostic", "mixed", "domain"]).default("diagnostic"),
  domain: z.enum(["inference", "assumptions", "deduction", "interpretation", "arguments"]).optional(),
  count: z.coerce.number().min(1).max(40).optional()
});

export async function GET(request: NextRequest) {
  const parsed = requestSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid assessment setup." }, { status: 400 });
  }

  const questions = selectQuestions(parsed.data);
  return NextResponse.json({
    attemptId: request.nextUrl.searchParams.get("attemptId") ?? "practice-session",
    startedAt: new Date().toISOString(),
    feedbackPolicy: parsed.data.mode === "mixed" ? "end_of_session" : "immediate_practice",
    questions
  });
}

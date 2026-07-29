import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scoreAnswers } from "@/lib/assessment/scoring";

const payloadSchema = z.object({
  attemptId: z.string().min(1),
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      selectedIndex: z.number().int().min(0).nullable(),
      responseTimeMs: z.number().int().nonnegative().optional(),
      flagged: z.boolean().optional()
    })
  ).min(1)
});

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  try {
    return NextResponse.json({
      attemptId: parsed.data.attemptId,
      submittedAt: new Date().toISOString(),
      result: scoreAnswers(parsed.data.answers)
    });
  } catch {
    return NextResponse.json({ error: "Unable to score this attempt." }, { status: 422 });
  }
}

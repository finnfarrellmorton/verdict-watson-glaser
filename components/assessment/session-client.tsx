"use client";

import { useEffect, useMemo, useState } from "react";
import { Flag, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SafeQuestion, ScoreResult } from "@/types/assessment";

type SessionPayload = {
  attemptId: string;
  startedAt: string;
  feedbackPolicy: string;
  questions: SafeQuestion[];
};

export function SessionClient({ attemptId, mode, domain, count }: { attemptId: string; mode: string; domain?: string; count?: string }) {
  const [payload, setPayload] = useState<SessionPayload | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({ attemptId, mode });
    if (domain) params.set("domain", domain);
    if (count) params.set("count", count);
    fetch(`/api/assessment/session?${params}`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Session failed")))
      .then(setPayload)
      .catch(() => setError("The session could not be loaded."));
  }, [attemptId, mode, domain, count]);

  const question = payload?.questions[current];
  const answeredCount = useMemo(() => Object.values(answers).filter((value) => value !== null && value !== undefined).length, [answers]);

  async function submit() {
    if (!payload) return;
    const response = await fetch("/api/assessment/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        attemptId: payload.attemptId,
        answers: payload.questions.map((item) => ({
          questionId: item.id,
          selectedIndex: answers[item.id] ?? null,
          flagged: Boolean(flagged[item.id])
        }))
      })
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Submission failed.");
      return;
    }
    setResult(data.result);
  }

  if (error) return <main className="mx-auto max-w-3xl px-4 py-10 text-error">{error}</main>;
  if (!payload || !question) return <main className="mx-auto max-w-3xl px-4 py-10 text-secondary">Loading session...</main>;

  if (result) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Badge>Submitted</Badge>
        <h1 className="mt-4 font-serif text-4xl font-semibold">Practice result</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Metric label="Raw score" value={`${result.scoreCorrect}/${result.scoreTotal}`} />
          <Metric label="Answered accuracy" value={result.answeredAccuracy === null ? "N/A" : `${Math.round(result.answeredAccuracy * 100)}%`} />
          <Metric label="Completion" value={`${Math.round(result.completionRate * 100)}%`} />
        </div>
        <div className="mt-8 overflow-hidden rounded-lg border border-border bg-surface">
          {result.items.map((item, index) => (
            <details key={item.questionId} className="border-b border-border px-4 py-4 last:border-b-0">
              <summary className="cursor-pointer font-semibold">
                Question {index + 1}: {item.status}
              </summary>
              <p className="mt-3 text-sm leading-6 text-secondary">{item.explanation}</p>
            </details>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-sm text-secondary">Question {current + 1} of {payload.questions.length}</p>
          <h1 className="font-serif text-2xl font-semibold">Verdict practice session</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-secondary">{answeredCount}/{payload.questions.length} answered</span>
          <Button variant="secondary" onClick={() => setFlagged((state) => ({ ...state, [question.id]: !state[question.id] }))}>
            <Flag className="h-4 w-4" /> {flagged[question.id] ? "Flagged" : "Flag"}
          </Button>
          <Button onClick={submit}>
            Submit <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <article className="rounded-lg border border-border bg-surface p-5 sm:p-8">
        <Badge>{question.family}</Badge>
        <p className="prose-measure mt-5 whitespace-pre-line text-lg leading-8">{question.prompt}</p>
        <fieldset className="mt-8 space-y-3">
          <legend className="sr-only">Answer choices</legend>
          {question.options.map((option, index) => (
            <label key={option} className="flex cursor-pointer gap-3 rounded-md border border-border bg-canvas px-4 py-3 hover:bg-surface2">
              <input
                type="radio"
                name={question.id}
                value={index}
                checked={answers[question.id] === index}
                onChange={() => setAnswers((state) => ({ ...state, [question.id]: index }))}
              />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
      </article>
      <div className="mt-6 flex justify-between">
        <Button variant="secondary" disabled={current === 0} onClick={() => setCurrent((value) => Math.max(0, value - 1))}>Previous</Button>
        <Button variant="secondary" disabled={current === payload.questions.length - 1} onClick={() => setCurrent((value) => Math.min(payload.questions.length - 1, value + 1))}>Next</Button>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-sm text-secondary">{label}</p>
      <p className="mt-2 font-mono text-3xl font-semibold">{value}</p>
    </div>
  );
}

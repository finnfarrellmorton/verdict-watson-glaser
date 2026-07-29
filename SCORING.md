# Scoring

Verdict scoring is deterministic.

## Raw Score

`correct answers / total questions`

Unanswered questions contribute zero to the raw score, but they remain classified as unanswered rather than also being labelled incorrect.

## Answered Accuracy

`correct answers / answered questions`

This is `null` when no questions were answered.

## Completion

`answered questions / total questions`

## Current Implementation

The active Next.js route handler at `app/api/assessment/submit/route.ts` validates the submitted answers, retrieves authoritative question records server-side, and returns the score plus permitted post-submission explanations.

The browser receives only safe question payloads from `app/api/assessment/session/route.ts` before submission.

import { SessionClient } from "@/components/assessment/session-client";

export default async function SessionPage({
  params,
  searchParams
}: {
  params: Promise<{ attemptId: string }>;
  searchParams: Promise<{ mode?: string; domain?: string; count?: string }>;
}) {
  const [{ attemptId }, query] = await Promise.all([params, searchParams]);
  return <SessionClient attemptId={attemptId} mode={query.mode ?? "diagnostic"} domain={query.domain} count={query.count} />;
}

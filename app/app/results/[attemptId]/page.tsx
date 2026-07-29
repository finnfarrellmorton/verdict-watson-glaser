import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ResultsPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold">Results</h1>
      <p className="mt-4 text-secondary">
        Attempt {attemptId} does not have a persisted server record yet. Submitted practice sessions show results immediately after server scoring.
      </p>
      <Button asChild className="mt-6">
        <Link href="/app/practice">Start a session</Link>
      </Button>
    </main>
  );
}

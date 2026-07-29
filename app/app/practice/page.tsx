import Link from "next/link";
import { domains } from "@/lib/assessment/domains";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PracticePage({ searchParams }: { searchParams: Promise<{ domain?: string }> }) {
  const params = await searchParams;
  const selected = domains.find((domain) => domain.slug === params.domain);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold">Practice setup</h1>
      <p className="mt-4 max-w-3xl text-secondary">
        Choose a focused session. Full mocks keep feedback until submission; diagnostic and domain practice return explanation after server scoring.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recommended diagnostic</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-secondary">20 questions, four per domain, lower-pressure timing.</p>
            <Button asChild className="mt-5 w-full">
              <Link href="/app/sessions/diagnostic?mode=diagnostic">Start diagnostic</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Domain drills</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {domains.map((domain) => (
              <Link
                key={domain.slug}
                href={`/app/sessions/${domain.slug}?mode=domain&domain=${domain.slug}&count=10`}
                className={`rounded-md border p-4 hover:bg-surface2 ${selected?.slug === domain.slug ? "border-brand bg-brand-muted" : "border-border bg-surface"}`}
              >
                <p className="font-semibold">{domain.shortLabel}</p>
                <p className="mt-2 text-sm leading-6 text-secondary">{domain.description}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

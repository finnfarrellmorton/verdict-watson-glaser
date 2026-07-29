import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { domains } from "@/lib/assessment/domains";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section>
          <Badge>Independent practice platform</Badge>
          <h1 className="mt-4 font-serif text-4xl font-semibold">Your next best step is the diagnostic.</h1>
          <p className="mt-4 max-w-2xl text-secondary">
            Complete a balanced twenty-question session to create an initial Verdict mastery estimate across the five reasoning domains.
          </p>
          <Button asChild className="mt-6">
            <Link href="/app/practice">
              Start practice setup <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <div className="mt-10 overflow-hidden rounded-lg border border-border bg-surface">
            {domains.map((domain) => (
              <div key={domain.slug} className="grid gap-3 border-b border-border px-4 py-4 last:border-b-0 md:grid-cols-[1fr_120px_120px_auto] md:items-center">
                <div>
                  <p className="font-semibold">{domain.label}</p>
                  <p className="text-sm text-secondary">{domain.description}</p>
                </div>
                <span className="text-sm text-secondary">No evidence yet</span>
                <span className="font-mono text-sm">0 attempts</span>
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/app/practice?domain=${domain.slug}`}>Set up drill</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly goal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-3xl font-semibold">0 / 40</p>
              <p className="mt-2 text-sm text-secondary">Questions completed this week. Goals will persist once Supabase is configured.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Configuration state</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-secondary">
              Supabase, Stripe, Sentry and PostHog are wired through environment variables. Until production credentials are added, this route runs as a safe practice preview.
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}

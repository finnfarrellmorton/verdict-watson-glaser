import Link from "next/link";
import { ArrowRight, BarChart3, BookOpenCheck, ClipboardCheck, Scale, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/navigation/site-header";
import { domains } from "@/lib/assessment/domains";
import { getFirms } from "@/lib/legacy-data";

export default function MarketingPage() {
  const firms = getFirms().slice(0, 6);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
            <div className="flex flex-col justify-center">
              <p className="mb-5 max-w-xl text-sm text-secondary">
                Independent critical-thinking assessment preparation. Not affiliated with Pearson, TalentLens or any employer.
              </p>
              <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-[1.03] tracking-normal text-ink sm:text-6xl">
                Think clearly under assessment pressure.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-secondary">
                Practise five critical-reasoning domains, complete realistic timed mocks and see exactly where your reasoning needs work.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/app/practice">
                    Start free diagnostic <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="#how-it-works">See how Verdict works</Link>
                </Button>
              </div>
            </div>

            <Card className="self-center overflow-hidden">
              <CardHeader className="bg-brand text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Diagnostic report preview</CardTitle>
                  <Badge className="border-white/30 bg-white/10 text-white">Practice score</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-end justify-between border-b border-border pb-4">
                  <div>
                    <p className="text-sm text-secondary">Raw score</p>
                    <p className="mt-1 font-mono text-4xl font-semibold">15 / 20</p>
                  </div>
                  <p className="max-w-48 text-sm text-secondary">Strong deduction, weaker assumptions. Review hidden-premise questions next.</p>
                </div>
                {domains.map((domain, index) => (
                  <div key={domain.slug} className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div>
                      <p className="text-sm font-medium">{domain.shortLabel}</p>
                      <div className="mt-2 h-2 rounded-sm bg-surface3">
                        <div
                          className="h-2 rounded-sm bg-brand"
                          style={{ width: `${index === 1 ? 54 : 68 + index * 4}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-mono text-sm text-secondary">{index === 1 ? "54" : 68 + index * 4}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="font-serif text-3xl font-semibold">Practice, analyse, review, improve.</h2>
              <p className="mt-4 text-secondary">
                Verdict separates practice from feedback so students learn the rule behind each mistake rather than memorising answers.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Diagnostic", ClipboardCheck, "A balanced twenty-question baseline across all five domains."],
                ["Analytics", BarChart3, "Domain rows, score trends and timing signals without fake percentile claims."],
                ["Review", BookOpenCheck, "Wrong, flagged and low-confidence questions become targeted review work."],
                ["Firm research", Scale, "Firm data stays secondary, searchable and source-aware."]
              ].map(([title, Icon, text]) => (
                <div key={String(title)} className="border-t border-border pt-4">
                  <Icon className="h-5 w-5 text-accent" aria-hidden />
                  <h3 className="mt-3 font-semibold">{title as string}</h3>
                  <p className="mt-2 text-sm leading-6 text-secondary">{text as string}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl font-semibold">Firm research preview</h2>
                <p className="mt-3 max-w-2xl text-secondary">Searchable firm data is available without burying the assessment product.</p>
              </div>
              <Button asChild variant="secondary">
                <Link href="/firms">
                  Explore firms <Search className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              {firms.map((firm) => (
                <Link
                  key={firm.slug}
                  href={`/firms/${firm.slug}`}
                  className="grid gap-2 border-b border-border bg-surface px-4 py-4 last:border-b-0 hover:bg-surface2 md:grid-cols-[1fr_auto_auto]"
                >
                  <div>
                    <p className="font-semibold">{firm.name}</p>
                    <p className="text-sm text-secondary">{firm.summary ?? firm.note}</p>
                  </div>
                  <span className="text-sm text-secondary">{firm.tag}</span>
                  <span className="font-mono text-sm">{firm.traineeSeats ?? "N/A"} seats</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

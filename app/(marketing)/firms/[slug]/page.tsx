import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/navigation/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFirm, getFirms } from "@/lib/legacy-data";

export function generateStaticParams() {
  return getFirms().map((firm) => ({ slug: firm.slug }));
}

export default async function FirmProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const firm = getFirm(slug);
  if (!firm) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/firms">Back to firms</Link>
        </Button>
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section>
            <Badge>{firm.tag}</Badge>
            <h1 className="mt-4 font-serif text-5xl font-semibold">{firm.name}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-secondary">{firm.summary ?? firm.note}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Metric label="Training seats" value={String(firm.traineeSeats ?? "Data unavailable")} />
              <Metric label="Offices" value={String(firm.offices)} />
              <Metric label="International" value={`${firm.international}%`} />
            </div>
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Practice strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(firm.practiceAreas ?? firm.seats ?? ["Corporate", "Finance", "Disputes"]).map((area) => (
                    <Badge key={area}>{area}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Salary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Row label="First year trainee" value={firm.salary?.traineeFirst ?? "Data unavailable"} />
                <Row label="Second year trainee" value={firm.salary?.traineeSecond ?? "Data unavailable"} />
                <Row label="Newly qualified" value={firm.salary?.newlyQualified ?? "Data unavailable"} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sources</CardTitle>
              </CardHeader>
              <CardContent>
                {firm.sources?.length ? (
                  <ul className="space-y-2 text-sm text-secondary">
                    {firm.sources.map((source) => (
                      <li key={source.label}>{source.label}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-secondary">Data unavailable.</p>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-border pt-3">
      <p className="text-sm text-secondary">{label}</p>
      <p className="mt-1 font-mono text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-2 last:border-b-0">
      <span className="text-secondary">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

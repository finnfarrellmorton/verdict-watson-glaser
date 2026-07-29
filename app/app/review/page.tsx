import { domains } from "@/lib/assessment/domains";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReviewPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold">Review queue</h1>
      <p className="mt-4 max-w-3xl text-secondary">
        Incorrect, unanswered, flagged and low-confidence questions will appear here once Supabase attempt persistence is configured.
      </p>
      <div className="mt-8 grid gap-3">
        {domains.map((domain) => (
          <Card key={domain.slug}>
            <CardHeader>
              <CardTitle>{domain.label}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <p className="text-sm text-secondary">0 due review items</p>
              <Button disabled variant="secondary">Review due</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

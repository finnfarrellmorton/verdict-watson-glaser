import Link from "next/link";
import { SiteHeader } from "@/components/navigation/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  ["Free", "£0", "Diagnostic, limited daily practice, basic results and firm directory access."],
  ["Pro", "£12/month", "Full question bank, mocks, complete analytics, review scheduling and study plan."],
  ["Institution", "Custom", "Cohort access, invitations, aggregate analytics and administrative controls."]
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-semibold">Pricing</h1>
        <p className="mt-4 max-w-2xl text-secondary">
          Prices are displayed plainly in pounds sterling. Stripe controls paid access once products and webhooks are configured.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {plans.map(([name, price, text]) => (
            <Card key={name}>
              <CardHeader>
                <CardTitle>{name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-3xl font-semibold">{price}</p>
                <p className="mt-4 text-sm leading-6 text-secondary">{text}</p>
                <Button asChild className="mt-6 w-full" variant={name === "Pro" ? "default" : "secondary"}>
                  <Link href={name === "Institution" ? "mailto:hello@example.com" : "/app/practice"}>
                    {name === "Free" ? "Start free" : name === "Pro" ? "Start checkout" : "Contact"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}

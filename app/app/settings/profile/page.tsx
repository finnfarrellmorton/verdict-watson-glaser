import { integrationStatus } from "@/lib/validation/env";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfileSettingsPage() {
  const status = integrationStatus();
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold">Profile</h1>
      <p className="mt-4 text-secondary">
        Profile editing requires Supabase authentication. Role and subscription controls are intentionally absent from this form.
      </p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Integration status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Status label="Supabase" value={status.supabaseConfigured} />
          <Status label="Stripe" value={status.stripeConfigured} />
          <Status label="PostHog" value={status.posthogConfigured} />
          <Status label="Sentry" value={status.sentryConfigured} />
        </CardContent>
      </Card>
    </main>
  );
}

function Status({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex justify-between border-b border-border pb-2 last:border-b-0">
      <span>{label}</span>
      <span className={value ? "text-success" : "text-warning"}>{value ? "Configured" : "Missing environment variables"}</span>
    </div>
  );
}

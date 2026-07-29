import Link from "next/link";
import { SiteHeader } from "@/components/navigation/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <label className="block text-sm font-medium">
                Email
                <Input className="mt-2" type="email" autoComplete="email" />
              </label>
              <label className="block text-sm font-medium">
                Password
                <Input className="mt-2" type="password" autoComplete="current-password" />
              </label>
              <Button className="w-full" disabled>Supabase required</Button>
            </form>
            <p className="mt-4 text-sm text-secondary">
              Authentication is wired for Supabase SSR, but production credentials must be added before sign-in is enabled.
            </p>
            <Link href="/app/practice" className="mt-4 block text-sm font-medium text-brand hover:underline">
              Continue to practice preview
            </Link>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

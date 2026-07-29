import { ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-accent" aria-hidden />
            Admin access is server-controlled
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-secondary">
          The previous client-side role switch has been removed from the new application architecture. Admin tooling should only become visible after Supabase roles and RLS policies are applied.
        </CardContent>
      </Card>
    </main>
  );
}

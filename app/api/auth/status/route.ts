import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { integrationStatus } from "@/lib/validation/env";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ user: null, integrations: integrationStatus() });
  }

  const { data } = await supabase.auth.getUser();
  return NextResponse.json({ user: data.user, integrations: integrationStatus() });
}

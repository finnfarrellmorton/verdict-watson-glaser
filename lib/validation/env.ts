import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional(),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_").optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  SENTRY_DSN: z.string().url().optional()
});

export const env = envSchema.parse(process.env);

export function integrationStatus() {
  return {
    supabaseConfigured: Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    stripeConfigured: Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET),
    posthogConfigured: Boolean(env.NEXT_PUBLIC_POSTHOG_KEY),
    sentryConfigured: Boolean(env.SENTRY_DSN)
  };
}

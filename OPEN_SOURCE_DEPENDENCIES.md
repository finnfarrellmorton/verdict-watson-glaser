# Open Source Dependencies

Verdict now uses these open-source foundations.

| Repository | Package | Use |
| --- | --- | --- |
| `vercel/next.js` | `next`, `react`, `react-dom` | App Router, route handlers, server-rendered pages and Vercel deployment. |
| `shadcn-ui/ui` | Source-owned `components/ui/*` | Accessible, customisable UI primitives adapted to Verdict's design system. |
| `tailwindlabs/tailwindcss` | `tailwindcss`, `postcss`, `autoprefixer` | Semantic design tokens, spacing, typography and responsive layouts. |
| `lucide-icons/lucide` | `lucide-react` | Single icon set for navigation and interface scanning. |
| `supabase/supabase` | `@supabase/supabase-js`, `@supabase/ssr` | Server-session integration and future RLS-backed persistence. |
| `colinhacks/zod` | `zod` | Environment, query and submission payload validation. |
| `TanStack/query` | `@tanstack/react-query` | Reserved for client server-state surfaces that need caching/refetching. |
| `TanStack/table` | `@tanstack/react-table` | Reserved for admin and firm comparison tables. |
| `recharts/recharts` | `recharts` | Reserved for accessible analytics charts once persisted attempt data exists. |
| `stripe/stripe-node` | `stripe` | Checkout, billing portal and webhook-controlled entitlements. |
| `vitest-dev/vitest` | `vitest` | Unit tests for scoring and selection logic. |
| `microsoft/playwright` | `@playwright/test` | Browser journeys and responsive verification. |

The app does not copy visual styling wholesale from shadcn/ui. The generated primitives are treated as owned source and restyled through Verdict tokens.

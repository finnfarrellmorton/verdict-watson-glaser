# Current State Audit

Date: 2026-07-29

## What Works

- The static site renders from `index.html`, `styles.css` and `app.js`.
- The generated question bank validates with `scripts/validate-data.js`.
- Firm records have stable slugs and enough data to power a searchable directory.
- Existing Stripe and Supabase API files contain useful launch wiring.
- The project is connected to GitHub and Vercel.

## Material Problems Found

- The product is built as a static page with hidden views rather than real routes.
- Browser refresh and direct links cannot reliably preserve the intended application state.
- The full question bank, including correct answers and explanations, is shipped to browser JavaScript.
- Role and subscription state were previously represented in client-side controls/state, which is not secure.
- Firm data is useful but includes methodology-sensitive scores that should not be presented as official rankings.
- Analytics, review scheduling, profile persistence, billing and admin surfaces require real backend state before they can be called production-ready.
- The old design overused broad dashboard surfaces and did not have a disciplined product information hierarchy.

## Preserve

- Current question IDs and firm slugs.
- Existing validation script.
- Existing API logic as migration reference.
- Existing Supabase schema as historical launch reference.
- Current Vercel/GitHub connection.

## Rebuild

- Application routing in Next.js App Router.
- Assessment delivery so answers are not sent before submission.
- Firm directory/profile presentation.
- Pricing and authentication entry points.
- Documentation, data validation and test coverage.

## Remove From Active Product

- Client-side role switching.
- Client-side plan switching.
- Hidden-view navigation as the primary architecture.
- Any claim that Verdict is official Watson-Glaser/Pearson/TalentLens scoring.
- Fake charts, fabricated live statistics and placeholder admin activity.

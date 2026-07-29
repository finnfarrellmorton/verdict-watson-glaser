# Verdict

Verdict is an independent critical-thinking assessment preparation platform for ambitious graduate applicants.

It combines:

- Watson-Glaser-style practice across five reasoning domains.
- Server-side scoring for active Next.js practice routes.
- Post-submission explanations.
- Domain analytics foundations.
- Searchable graduate-employer firm research.

Verdict is independently operated and is not affiliated with Pearson, TalentLens or any employer.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run check
npm run typecheck
npm run test
npm run build
```

## Deployment

The project is configured for Vercel. Add the required environment variables listed in `ENVIRONMENT_VARIABLES.md`, apply Supabase migrations, configure Stripe webhooks, then deploy.

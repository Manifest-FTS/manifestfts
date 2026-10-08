# Manifest Signal

Evidence-first AI search visibility and citation monitoring, built by Manifest FTS. Signal asks ChatGPT, Perplexity, Gemini, and Claude the questions customers ask. It records every answer and source, reports each rate with its sample size and a 95% Wilson interval, audits AI-crawler readiness, and turns gaps into evidence-linked tasks.

## Stack
Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Drizzle ORM with Postgres (an embedded PGlite database in development), Radix primitives, Stripe, and Mailjet.

## Develop
```bash
cp .env.example .env.local
npm install
npm run dev        # http://localhost:3000. Migrations apply automatically.
npm test           # unit tests: analysis, metrics, robots.txt, SSRF guard, sample data
npm run typecheck && npm run lint
```
Without `DATABASE_URL`, data lives in `./.data/pglite`. Without Mailjet, Stripe, or engine keys, emails are logged to the console, billing shows plans with checkout disabled, and workspaces use labeled sample data.

## Deploy (Coolify / Nixpacks)
- Deploy this as its own application with **base directory `signal/`**. The root marketing site is unaffected.
- Set `DATABASE_URL`, `AUTH_SECRET`, `CRON_SECRET`, and `NEXT_PUBLIC_SITE_URL`. Stripe, Mailjet, and engine keys are optional (see `.env.example`).
- Point a Stripe webhook at `/api/stripe/webhook`. Its events are `checkout.session.completed` and `customer.subscription.*`.
- Add an hourly scheduled task: `curl -fsS -X POST -H "Authorization: Bearer $CRON_SECRET" https://<host>/api/cron`
- The health check is at `/api/health`.

## Features
- **Measure:** prompts across ChatGPT, Perplexity, Gemini, Claude, AI Overviews, and Copilot (live or labeled sample data); sources; competitors and share of voice; brand perception; **AI traffic** from a cookieless snippet (`/t.js`).
- **Improve:** **GEO audits** (composite score across citability, crawlers, brand, E-E-A-T, schema, and platform; 26 AI crawlers with allowed/partial/blocked), accuracy monitoring, evidence-linked tasks, and a **content studio** with evidence-based briefs and optional Claude drafts.
- **Share and integrate:** reports with private links and **white-label branding** (Agency), Slack and HMAC-signed webhooks, **IndexNow**, and JSON export.
- **Free tools** (`/tools`, embeddable at `/embed/[slug]`): GEO audit, AI robots.txt checker, ChatGPT/Perplexity/Gemini/Claude visibility checkers (live when engine keys are set), AI prompt, llms.txt, robots.txt, and schema generators, and structured data and sitemap validators.

## Structure
- `src/app/(marketing)`: home, features, pricing (with managed services), methodology, solutions, docs, free tools hub, legal pages
- `src/app/(auth)`: sign up, sign in, password reset, email verification, invitations
- `src/app/app`: onboarding, the workspace dashboard (overview, prompts, sources, competitors, accuracy, readiness, tasks, reports, settings), and the account page
- `src/lib`: database schema, auth, analysis and metrics, readiness audits, providers (live and sample), pipeline, queries
- SEO: `sitemap.ts`, `robots.ts`, `llms.txt`, `llms-full.txt`, Open Graph images, and JSON-LD on every public page

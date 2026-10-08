# Manifest FTS Digital Design System

**System v2.0 · 2026-10-02**

**Position:** Trusted Tech Partner · Data Trust & Security · Appropriate Technology

This guide governs the redesigned public website and provides reusable patterns for product surfaces such as Manifest Signal. The system adapts product accent usage by context; it does not replace the official Manifest FTS logomarks or make every product visually identical.

## Brand position and voice

Manifest FTS is an engineering-led digital partner that plans, builds, and supports durable websites and web platforms. We bring design and engineering together, take data stewardship seriously, and choose technology for fit rather than fashion.

- **Trusted Tech Partner:** communicate continuity, clear decisions, durable delivery, and accountable follow-through.
- **Data Trust & Security:** explain ownership, access, recovery, vendor boundaries, and risk without claiming perfect security.
- **Appropriate Technology:** select the least complex architecture that meets user, business, and operating constraints; disclose trade-offs and lifecycle cost.

### Voice

Grounded, authoritative, direct, and deeply pragmatic. Use concrete nouns and verbs. Explain what we observed, why it matters, and what a team can do next. Avoid empty AI hype, “future-proof” promises, guarantees of ranking or uptime, and unsupported performance claims. Name uncertainty and attribution where applicable.

Prefer: “Observed in this sample,” “The published case study reports…,” “This is a reasonable next step,” and “The result depends on the operating context.”

Avoid: “Guaranteed growth,” “AI-proof,” “always secure,” or “live” if there is no live data connection.

## Logo and product architecture

- Keep the official SVG/PNG logo artwork in `public/assets/imgs/` unchanged. Do not redraw, stretch, crop, recolor, animate, or add effects to a mark. Maintain its aspect ratio and sufficient clear space.
- Use the approved logo asset that provides appropriate contrast on the actual background. The design system does not replace the corporate logo with the Signal product accent.
- Manifest Signal is “a product by Manifest FTS.” The v2 site uses Signal only as a product/service expression and labels interactive data previews as illustrative.
- Jongo.app remains a separate product identity. It retains its forest-green palette and its own guide; map semantic shared components at a local theme boundary rather than importing Manifest styles globally into Jongo.

## Tokens

Canonical CSS variables are declared in `styles/manifest-system.css`. Tailwind counterparts are in `tailwind.config.js`. Components are scoped with the `.mfts-site` class; do not rely on legacy palette utilities for new pages.

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Canvas | `--mfts-canvas` | `#FFFFFF` | Page background |
| Surface | `--mfts-surface` | `#F8FAFC` | Quiet panels |
| Subtle | `--mfts-surface-subtle` | `#F1F5F9` | Table headers, soft fills |
| Primary ink | `--mfts-ink` | `#101828` | Headings and primary content |
| Secondary ink | `--mfts-ink-soft` | `#344054` | Body copy and controls |
| Muted | `--mfts-muted` | `#475467` | Supporting metadata; verify pairings |
| Border | `--mfts-border` | `#DBE3EC` | Decorative separation |
| Strong border | `--mfts-border-strong` | `#98A2B3` | Essential control boundary |
| Manifest cyan | `--mfts-brand-cyan` | `#3F8077` | Parent brand anchor |
| Deep cyan | `--mfts-brand-cyan-deep` | `#326B64` | Stronger brand text/accent |
| Signal indigo | `--mfts-signal-blue` | `#4353C7` | Product action and focus |
| Signal hover | `--mfts-signal-blue-hover` | `#3544AD` | Action hover and link text |
| Success | `--mfts-success` | `#087A55` | Positive state with text label |
| Warning | `--mfts-warning` | `#9A5B00` | Attention state with text label |
| Error | `--mfts-danger` | `#B93838` | Error state with text label |

Tailwind examples: `bg-manifest-canvas`, `bg-manifest-surface`, `text-manifest-ink`, `text-manifest-cyan`, `bg-signal`, `bg-signal-emerald`, `bg-signal-amber`, `bg-signal-coral`, `shadow-card`, `shadow-raised`, `rounded-panel`.

Check text and non-text contrast for each rendered pairing, including hover, disabled, translucent, and focus states. Palette definitions do not certify WCAG conformance by themselves. Status is never communicated by color alone.

## Typography

Use Inter as the primary UI family with Plus Jakarta Sans and system sans fallbacks. Use system monospace for URLs, IDs, logs, and machine-readable metadata. Proprietary brand fonts are not copied or redistributed. Display typography should remain clean and restrained rather than introducing a heavy serif.

- **Page title:** 40–64px responsive, weight 600–700, line height 1.04–1.12, tight tracking.
- **Section heading:** 28–42px, weight 600–700, line height 1.15–1.25.
- **Card heading:** 18–22px, weight 600–700, line height 1.3.
- **Body:** 16px / 1.6–1.8; keep long-form lines around 60–75 characters.
- **Label/metadata:** 11–13px, 600–700; use uppercase sparingly.
- **Technical data:** 12–14px / 1.5 in monospace; allow long tokens to wrap or scroll accessibly.

## Layout, surfaces, and motion

Use a centered content width near 1160px with responsive 18–24px mobile gutters. Create hierarchy with white canvas, subtle slate sections, alignment, and whitespace before shadows. Cards use 14px corners, a quiet 1px border, and `--mfts-shadow-card`; raised overlays use `--mfts-shadow-raised`. Standard controls target at least 44px high; primary actions use 48px.

Interaction is quiet and confirms a real control action. Use short color/shadow transitions and small translate/scale feedback. Respect `prefers-reduced-motion`; do not animate metrics to imply live analysis, guaranteed progress, or urgency. Product visualizations must disclose whether data is sample, stale, or connected.

## Shared component patterns

The public-site implementation in `components/manifest-site/index.js` exports `Button`, `Tag`, `SectionIntro`, and `SignalPreview`. Layout patterns are in `styles/manifest-system.css` and are deliberately namespaced with `mf-` to coexist with legacy framework styles.

### Button

Use the shared `Button` for primary, secondary, and quiet actions. It renders a real anchor for `href` and a native button otherwise. Preserve descriptive labels, native form type, disabled state, focus visibility, and minimum target size. Do not use color alone to signal danger or success.

### Tag

`Tag` is a compact labeled state/category marker. Tones currently include `neutral`, `info`, `success`, and `warning`. Keep labels concise and meaningful; add an explicit error treatment only when an actual error state is documented.

### SectionIntro

Use `SectionIntro` to keep eyebrow, heading, explanatory copy, and optional action aligned. Each page should still have one primary `h1` and a logical heading order.

### SignalPreview

The home page preview is an interactive sample prompt selector with illustrative model shares. It has no model-provider connection and must continue to say “illustrative only.” Do not report the values as real customer results or a live score. A product implementation must publish sample size, denominator, prompts, engine availability, evaluation time, and method.

### Project intake flow

The new `pages/contact.js` step flow is a shared pattern for progressive intake: primary needs, project context, then contact details. It generates a plain-text brief preview, validates required values, requests inquiry consent, and sends to the existing `/api/mail` `getQuote` handler. It does not calculate an estimate. Preserve:

- Back/continue controls and a visible current step.
- Native labeled fields, inline validation, and an announced error/success state.
- User-authored brief content and an explicit privacy link.
- Server-side validation, rate limiting, privacy-safe logging, and email-service failure handling before production expansion.
- A clear statement that the form is an inquiry, not a scope/price commitment.

## Content and SEO/AEO

- Core service pages use specific H1s and one self-contained service description (target 130–160 words), with concrete capabilities and audience, followed by scannable deliverables and internal links.
- Long-form insight articles use a semantic `article`, descriptive `h2`/`h3` headings, concise introductions, source links, author/date metadata, and stable URLs. Keep factual claims and dates precise. No artificial keyword stuffing or generated filler.
- Case studies state the client, work, timeframe where known, and outcome evidence. Identify historical snapshots and attributed/client-reported figures. Do not invent testimonials, metrics, or causal claims.
- Organization, WebSite, and WebPage JSON-LD render server-side from `pages/_app.js`; services get `Service` entities, existing project routes get `Article`/`CreativeWork` case-study markup, and insight articles emit `Article` metadata. Keep schema aligned with visible copy and canonical URLs. Schema markup does not guarantee rich results.
- `public/llms.txt`, `public/robots.txt`, and `public/sitemap.xml` are maintained as source files. AI/search crawlers are allowed on public pages; `/funding` stays excluded. Access does not guarantee indexing, citation, recommendation, or ranking.

## Pages and navigation

- `/`: partnership positioning, Manifest Signal sample, trust indicators, three pillars, service suite, documented stories, ongoing-partnership CTA.
- `/services`: four connected disciplines and scoped contact links.
- `/work`: selected client stories with asset, factual context, metrics caveats, and destination.
- `/insights` and `/insights/[slug]`: editorial index and structured article pages.
- `/contact`: progressive inquiry and generated project-brief preview.
- Legacy `/capabilities` continues to provide the existing retainer builder/modal/checkout workflow; legacy `/ahead-with-fts` redirects to `/insights`.

## Accessibility and release checklist

Before release, verify keyboard operation, visible focus, meaningful accessible names, appropriate heading structure, 200% zoom/reflow, contrast for all states, reduced motion, form error announcements, link destinations, image alternative text, empty/loading/error conditions, and content persistence where promised. Run `npx tsc --noEmit`, `npm run lint`, and `npm run build` from the repository root. Browser-test mobile navigation, intake steps, previews, and routes. This guide sets requirements; it does not claim a blanket accessibility certification.

# Production launch runbook — manifestfts.com

Branch: `feat/seo` (based on `master`). Audit date: 2026-10-31.

This covers the four launch workstreams. Code changes are in the branch; everything
marked **[dashboard]** is a manual step in Cloudflare / the hosting provider.

---

## 1. Cloudflare edge & CDN

### Findings (live, 2026-10-31)

| Check | Result |
|---|---|
| Zone nameservers | `duke.ns.cloudflare.com`, `novalee.ns.cloudflare.com` — zone is on Cloudflare |
| `manifestfts.com` | Proxied (orange cloud), serves the Next.js app, `cf-cache-status: DYNAMIC` for HTML |
| `www.manifestfts.com` | 301 → `https://manifestfts.com/` (edge redirect) |
| `media.manifestfts.com` | **Does not resolve (NXDOMAIN).** No DNS record exists, so there are no rewrite rules to audit yet. |
| Range request on `/assets/…/ncwaterfalls-then-now-looking-glass.mp4` | **`200` full body through Cloudflare** (`cf-cache-status: MISS` then `REVALIDATED`). Origin (`next start`) answers the same request with `206 Partial Content` + `Accept-Ranges: bytes`. |
| `Cache-Control` on `/assets/*` | Origin sends `public, max-age=0`; Cloudflare rewrites to `max-age=14400` (zone Browser Cache TTL = 4h). Edge never gets a HIT, so it revalidates every request. |

**Why range requests break:** Cloudflare only answers `Range` with `206` from a cached
object. Because the origin sent `max-age=0`, every request was a MISS/REVALIDATE and
Cloudflare streamed the full 2.4 MB with `200`. Safari/iOS require `206` for `<video>`
seeking and sometimes refuse to play at all.

### Code fix (in this branch)

`next.config.js` now sends for `/assets/*`:

```
Cache-Control: public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400
```

plus `Accept-Ranges: bytes` on `*.mp4`. `/public` files are **not** content-hashed, so
after replacing a file under `/assets`, purge that URL in Cloudflare.

### [dashboard] Cloudflare settings

1. **Caching → Configuration → Browser Cache TTL:** set to **Respect Existing Headers**.
2. **Caching → Cache Rules → Create rule** "Static assets":
   - When: `URI Path starts with /assets/` OR `URI Path starts with /_next/static/`
   - Then: Eligible for cache; Edge TTL = *Use cache-control header if present*; Browser TTL = *Respect origin*.
3. Speed → Optimization: leave **Rocket Loader off** (it rewrites Next.js script loading).
4. After deploy, verify (expect `206`, `content-range`, and `cf-cache-status: HIT` on 2nd call):

```bash
curl -sS -o /dev/null -D - -H "Range: bytes=0-1023" https://manifestfts.com/assets/imgs/case-studies/ncwaterfalls-then-now-looking-glass.mp4
```

### [dashboard] `media.manifestfts.com` (only if you want a media host)

Nothing on the site references it today. If you want large media off the app origin:

1. R2 → Create bucket `manifestfts-media` → Settings → **Custom Domains → Connect `media.manifestfts.com`**
   (Cloudflare creates the DNS record and certificate).
2. Cache Rule for hostname `media.manifestfts.com`: Eligible for cache, Edge TTL 1 year
   (upload versioned filenames, e.g. `reel-2026-10.mp4`, instead of overwriting).
3. R2 serves `Accept-Ranges` and `206` natively. Verify with the curl command above.
4. Then move `public/assets/imgs/case-studies/*.mp4` there and update `src` in
   `pages/case-study/nc-waterfalls.js`.

### Dead code noticed

`components/elements/ModalVideo.js` points at `https://motoringstyle.com/…mp4`, which
has an invalid TLS certificate. The component is not imported anywhere, so delete it or
re-point it if it's ever used.

---

## 2. Accessibility & performance (Lighthouse)

Lighthouse 12.2.1, mobile preset (simulated Moto G / slow 4G), against a local
`next build && next start`. Score = median of 3 runs.

| Route | Perf | A11y | Best Pr. | SEO |
|---|---|---|---|---|
| `/` | 65 → 83 | 84 → 100 | 82 → 100 | 92 → 100 |
| `/work` | 75 → 83 | 86 → 100 | 100 | 100 |
| `/about` | 76 → 90 | 85 → 100 | 100 | 100 |
| `/capabilities` | 79 → 88 | 86 → 100 | 100 | 100 |
| `/case-study/nc-waterfalls` | 75 → 78 | 86 → 100 | 100 | 100 |
| `/case-study/barclay-rex` | 76 → 80 | 86 → 100 | 100 | 100 |
| `/case-study/sanity-cms` | 74 → 89 | 83 → 96 | 82 | 100 |
| `/ahead-with-fts` | 77 → 83 | 85 → 100 | 100 | 100 |
| `/free-website` | 80 → 84 | 90 → 100 | 100 | 100 |
| `/wordpress-hosting` | 77 → 87 | 90 → 100 | 100 | 92 → 100 |

What changed: server-rendered JSON-LD, `lang`, labelled icon links, heading order,
AA contrast for the brand-green tag text (`.color-green-900` darkened from `#3F8077` to
`#2F6159`) and the header CTA, `font-display: swap` with woff2-first, Latin-subset woff2
(~267 KB → 81 KB), WebP hero/avatars/banner, lazy Mux player and case-study video, lazy
below-fold images with intrinsic sizes, and the header Lottie JSON split out of the shared bundle.

Not fixed in this pass, and why:

- **`/case-study/sanity-cms` a11y 96:** the unnamed control is `media-rendition-button`
  inside Mux Player's shadow DOM, which we can't label from outside. Upgrading
  `@mux/mux-player-react` may fix it.
- **Best Practices 82 on `/case-study/sanity-cms`:** Mux's Chromecast loader requests
  `http://www.gstatic.com/cast/…` (insecure). Also a Mux issue.
- **Remaining performance gap:** about 300 KB of JS on every route (React 18 + framer-motion +
  swiper + lottie in shared chunks) and a 70 KB global stylesheet built from the
  template's full SCSS. Getting every route to 95+ on simulated mobile needs a follow-up:
  replace framer-motion entrance animations with CSS, load swiper only on carousel
  pages, and prune unused SCSS partials.
- **Local scores leave out GTM.** Locally `GTM_ID` is undefined. GTM now loads with
  `strategy="lazyOnload"` (after the page `load` event), which keeps it out of
  LCP and TBT. Analytics still fires, slightly later.

---

## 3. Schema & metadata

Implemented in `lib/site.js` and server-rendered from `pages/_app.js` as a single
`@graph` in the initial HTML. Before this change it was injected client-side by
`next/script`, so it wasn't in the HTML at all.

- `Organization` + `ProfessionalService` (`#organization`): Greenville, SC 29601 (city-level,
  no street address published), `areaServed` Greenville / South Carolina / US,
  `hasOfferCatalog` with the studio services, and `founder` linking to the founder.
- `Person` (`#founder`): Kevin Williams, Founder & Software Engineer, `homeLocation` Greenville.
- `WebSite` (`#website`) and a per-page `WebPage` linked by `@id`.
- Case-study `CreativeWork`/`Article` and `/free-website` `Service` nodes now reference
  `#organization` instead of redefining the org.

Metadata fixes:

- **Canonical host is now the apex** `https://manifestfts.com` (it was `www`, which 301s).
  Override with `NEXT_PUBLIC_SITE_URL` if the cutover makes `www` primary.
- `/wordpress-hosting` canonical/og:url pointed to `https://yourdomain.com/wp-hosting` → fixed.
- Pages that set their own head tags emitted **duplicate canonicals and og tags** (Next 12
  doesn't dedupe `property=`/`<link>` without a `key`) → keyed.
- Removed a second hard-coded meta description from `_document.js`; added `<html lang="en">`.
- `sitemap.xml` regenerated on the apex: dropped the `/sanity-cms` redirect; added
  `/capabilities`, `/case-study/optumpricer`, `/free-website`, `/wordpress-hosting`.
  `robots.txt` also disallows `/admin` and `/api/`.

AI search / LLM and crawl hygiene:

- `public/llms.txt`: a curated, factual summary of the studio, its services (with listed plan prices), case studies, and articles, using canonical apex URLs.
- `robots.txt` names the AI search crawlers explicitly (GPTBot, OAI-SearchBot, ChatGPT-User,
  ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended,
  Applebot-Extended, CCBot) with the same allow and exclusions as `*`. **This is a policy choice.**
  To opt out of AI *training* while staying in AI *search*, change `GPTBot`, `ClaudeBot`,
  `Google-Extended`, `Applebot-Extended` and `CCBot` to `Disallow: /`.
- Every indexable route now has a unique title and description (`pages/_app.js` `pageMeta`).
  Articles come from `data/articles.js`.
- `BlogPosting` JSON-LD on the four articles (date, author → founder or org, image), plus
  `BreadcrumbList` on every indexable non-home page.
- `noindex, follow` on `/home` (duplicate of `/`), `/funding*`, `/admin*`, `/case-study/joyfeed` (draft) and the `.bak` pages.
- New 1200×630 social card `public/assets/imgs/og-default.jpg`, which replaces the 1.8 MB `hero-image.png`. Pages also emit `og:image:width/height/alt`, `og:locale` and `article:published_time`.
- `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest` and `theme-color`.
- Articles: removed a hidden block of placeholder template comments ("Robert Fox"…) that was
  still sent in the HTML. Replaced invalid `<caption>` outside a table, which caused React hydration error #418.

**Validate after deploy:**

- https://search.google.com/test/rich-results?url=https://manifestfts.com/
- https://validator.schema.org/#url=https%3A%2F%2Fmanifestfts.com%2F

---

## 4. Domain cutover & production deploy

> The apex already serves this Next.js app through Cloudflare. If "cutover" means moving
> to a new origin (for example Railway), fill in `<NEW_ORIGIN>` below.

### T-24h

- [ ] Note the current origin record (DNS → `manifestfts.com` / `www`), so you can roll back.
- [ ] Add `manifestfts.com` and `www.manifestfts.com` as custom domains on the new host. Wait until its certificate is issued.
- [ ] Set production env vars on the new host: `NEXT_PUBLIC_SITE_URL=https://manifestfts.com`, GTM ID, Stripe keys, Mailjet, `NEXT_PUBLIC_CLIENT_URL`.
- [ ] Deploy `feat/seo` (after merge) to the new host. Smoke-test it on the host's preview URL.

### Cutover

- [ ] **[dashboard]** DNS: point `manifestfts.com` (CNAME-flattened) at `<NEW_ORIGIN>`, proxied (orange cloud). Keep the `www` → apex redirect rule.
- [ ] SSL/TLS mode: **Full (strict)**.
- [ ] Caching → **Purge Everything**.
- [ ] Run the checks:

```bash
curl -sSI https://manifestfts.com/ | grep -iE "^HTTP|cache-control|x-content-type"
```

```bash
curl -sSI https://www.manifestfts.com/ | grep -iE "^HTTP|location"
```

```bash
curl -s https://manifestfts.com/ | grep -c 'application/ld+json'
```

```bash
curl -s https://manifestfts.com/robots.txt
```

- [ ] Stripe webhook endpoint still points at `https://manifestfts.com/api/stripe/webhook`. Send a test event.

### Rollback

Restore the origin record noted at T-24h, then **Purge Everything**. DNS is proxied, so the change takes effect within seconds.

### Cross-browser pass

| Browser | Home | Work | Case study video (NC Waterfalls) | Capabilities → Retainer checkout | Contact form |
|---|---|---|---|---|---|
| Chrome (macOS) | | | | | |
| Safari (macOS) | | | | | |
| Safari (iOS) | | | ← range requests matter here | | |
| Firefox | | | | | |
| Edge | | | | | |
| Chrome (Android) | | | | | |

### Post-launch

- [ ] Search Console: verify the `manifestfts.com` domain property, submit `https://manifestfts.com/sitemap.xml`, and request indexing for `/`.
- [ ] Bing Webmaster Tools: import from GSC and submit the sitemap.
- [ ] Check the Rich Results Test and the Search Console *Enhancements* tab after about 1 week.
- [ ] Celebrate. 🎉

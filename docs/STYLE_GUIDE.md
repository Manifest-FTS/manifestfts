# Manifest Signal — Style Guide

**Human Intelligence meets Elastic Precision.**

System version: **v0.1.0** · Updated: **2026-10-02** · Status: **live implementation at `/signal`**.

This is the implementation-aligned specification for Manifest Signal, not a proposal to restyle the legacy Manifest FTS theme. The living guide, shared React components, tokens, fonts, original wave mark, Tailwind extension, and download API exist in this workspace. A versioned npm package is **planned, not shipped or published**. Production deployment and accessibility checks below are release requirements, not claims that every environment has passed them.

## Contents — six sections

1. [Philosophy and identity](#1-philosophy-and-identity)
2. [Colors, CSS variables, and contrast](#2-colors-css-variables-and-contrast)
3. [Typography and spatial foundations](#3-typography-and-spatial-foundations)
4. [Motion and interaction](#4-motion-and-interaction)
5. [Standalone Tailwind configuration](#5-standalone-tailwind-configuration)
6. [Core components, integration, and distribution](#6-core-components-integration-and-distribution)

---

## 1. Philosophy and identity

### Human Intelligence meets Elastic Precision

**Human Intelligence** means editorial care, interpretation, evidence, and accountability. **Elastic Precision** means a recognizable system that responds to context without inventing certainty. Signal makes the next decision clearer; it does not present decoration as intelligence.

The implemented visual language combines warm paper surfaces, espresso ink, terracotta actions, editorial serif headings, precise sans-serif controls, soft depth, and modest elastic feedback. It is distinct from the legacy site's blue/yellow palette, fonts, templates, and layout.

### Design principles

- **Human: clarity before cleverness.** Use honest language, meaningful headings, readable labels, and room to breathe.
- **Tactile: depth with intention.** Rounded surfaces and quiet shadows organize information without turning every item into a call to action. A shadow is not an essential control boundary.
- **Elastic: responsive, never restless.** Feedback confirms an action. Motion is not evidence of a running analysis or live data.
- **Evidence before spectacle.** Explain a metric's numerator, denominator, sample, time window, and source. Missing data is a valid state.
- **Accessible mappings, not blanket certification.** Target 7:1 for normal text in approved combinations; preserve native semantics, visible focus, reduced motion, and usable targets. Color contrast alone does not certify a page as WCAG AAA.
- **One source, many contexts.** Product pages import the shared library. Do not maintain lookalike component copies for the living guide.

### Voice and metric truthfulness

Prefer “Observed in this sample,” “Review the evidence,” “Needs attention,” and “No data.” Avoid “Guaranteed,” “Always accurate,” or “Live” without a real update mechanism and timestamp. Distinguish observation, inference, and recommendation.

The current gauge represents **citation visibility**:

$$
\text{Citation visibility} = 100 \times \frac{\text{evaluated responses citing the brand}}{\text{all eligible evaluated responses in the defined sample}}
$$

Count a response at most once for the brand, even if it contains multiple citations. Define eligibility, prompt/model coverage, evaluation window, treatment of failed/empty responses, and what qualifies as a citation outside the component. A zero numerator with a positive denominator is **0%**; a missing or zero denominator means **no measurement**, not 0%.

This is not automatically competitive **share of voice**. Such a metric needs an explicit competitor set and denominator, for example the brand's qualifying mentions divided by qualifying mentions across that set, including a declared rule for multiple mentions per response. Do not relabel citation visibility as competitive share of voice.

If showing **accuracy**, define its denominator separately: correct evaluated claims divided by all eligible claims actually assessed under a stated rubric. Disclose excluded/unassessed claims, evaluator, sample size, and uncertainty. A response-level accuracy measure needs a separately stated response-level numerator and denominator; do not silently mix units. Neither citation presence nor visibility establishes correctness.

The living page explicitly labels its demonstration **“Illustrative data, not a live connection.”** Its URL form validates locally; it does not submit or store preview data. Shared components do not insert sample-data labels automatically: the composing page owns that disclosure.

### Brand assets

The implemented [original wave mark](../public/signal/logo.svg) is a 64 × 64 SVG with a rounded terracotta tile and elevated-colored wave strokes. The guide displays it at 40 × 40 beside a text wordmark and “A product by Manifest FTS.” It is not a renamed legacy logo, and proprietary legacy logo fonts are not distributed.

Keep its proportions and colors; do not stretch it, add gradients, or use it as a network-status indicator. Give decorative images empty alternative text when adjacent text or a named link identifies the brand. The current header link is named “Manifest Signal foundations.” Font OFL licenses do not grant rights to the Signal mark or the rest of the system; external redistribution requires the relevant project permission.

---

## 2. Colors, CSS variables, and contrast

### Canonical palette

[Token and font CSS](../public/signal/tokens.css) is the source of truth. Variables are declared on **`.signal-theme`**, not `:root`; components and utilities require that class on themselves or an ancestor. Do not create a second palette using obsolete prefixed color names.

| Role | Actual CSS variable | Exact hex | Usage |
| --- | --- | --- | --- |
| Canvas / Sand | `--bg-canvas` | `#F7F3EB` | Page ground and input background |
| Surface / Warm stone | `--bg-surface` | `#EFEBE3` | Quiet panels, neutral badges, disabled buttons |
| Elevated / Paper | `--bg-elevated` | `#FFFCF7` | Cards, gauge, inverse primary-button text |
| Primary text / Espresso | `--text-primary` | `#29231F` | Headings, labels, badge text, errors |
| Secondary text / Taupe | `--text-secondary` | `#51453D` | Body hierarchy, hints, captions, placeholders, disabled labels |
| Signal primary / Terracotta | `--accent-signal-primary` | `#923D2B` | Primary fill, focus outline, decorative accent |
| Signal hover | `--accent-signal-hover` | `#7D3223` | Primary hover fill; approved accent text |
| Warning / Copper | `--accent-warning` | `#785015` | Supplementary non-text warning accent |
| Success / Forest | `--accent-success` | `#365C45` | Gauge fill and supplementary non-text success accent |
| Subtle border / Soft clay | `--border-subtle` | `#D8C9BB` | Decorative separators, card borders, gauge track |
| Strong border | `--border-strong` | `#89766A` | Input/secondary-control boundaries |
| Success subtle | `--success-subtle` | `#E2EBDD` | Success badge background |
| Warning subtle | `--warning-subtle` | `#F4E8D0` | Warning badge background |
| Error accent | `--accent-error` | `#923D2B` | Invalid input border; not error-message text |

### Verified normal-text pairings

The following ratios were verified against these exact sRGB values on 2026-10-02. Values are rounded for reporting; the threshold is **7:1** using unrounded values. The table assumes opaque colors, not opacity-modified text, overlays, or blended backgrounds.

| Foreground | Canvas | Surface | Elevated | Success subtle | Warning subtle |
| --- | ---: | ---: | ---: | ---: | ---: |
| Primary text `#29231F` | 14.009 | 13.040 | 15.149 | 12.670 | 12.772 |
| Secondary text `#51453D` | 8.364 | 7.786 | 9.045 | 7.565 | 7.626 |
| Hover/accent text `#7D3223` | 8.066 | 7.508 | 8.722 | 7.295 | 7.354 |

All entries pass the AAA normal-text contrast target. Secondary text is **approved**, including hints and small captions. Establish hierarchy through size, weight, spacing, and these approved colors, not reduced opacity.

| State or additional pairing | Ratio | Mapping |
| --- | ---: | --- |
| Primary button default | 7.016:1 | Elevated text on rust fill |
| Primary button hover | 8.722:1 | Elevated text on rust-hover fill |
| Primary/secondary button disabled or loading | 7.786:1 | Secondary text on surface fill |
| Neutral badge | 13.040:1 | Ink on surface |
| Success badge | 12.670:1 | Ink on success-subtle |
| Warning badge | 12.772:1 | Ink on warning-subtle |
| Error message on canvas | 14.009:1 | Primary text, with an error border and explanatory words |

**Rust `#923D2B` on canvas is 6.488:1** (surface: 6.039:1). Do not use rust for small text on these backgrounds when targeting AAA. Use ink, muted, or rust-hover instead. Rust on elevated is 7.016:1, but use the darker hover color for portable accent text across all five surfaces. Warning on warning-subtle is 5.851:1 and success on success-subtle is 6.187:1; badges use **ink**, not their tone color.

The primary-button default pairing has little margin. Do not fade the whole button or assume an arbitrary white/opacity substitution preserves the measured result. Recalculate if either effective color changes. Inline links need an underline or equivalent non-color cue; the guide's text links are underlined ink, while its highlighted hero phrase uses rust-hover.

### Boundaries and focus

Strong border against canvas/surface/elevated/success-subtle/warning-subtle measures **3.902 / 3.632 / 4.219 / 3.529 / 3.557:1**. Use it for essential light-surface boundaries. Subtle clay is decorative, not an approved focus indicator or essential control boundary.

Shared buttons and inputs currently use a **3px rust outline with 4px offset**. Guide links/inputs have a 3px rust outline with 5px offset. Rust exceeds the 3:1 non-text target against the listed light surfaces; keep the offset area light and unobscured. On dark surfaces choose and verify a different outline. Success/warning accents meet 3:1 on their respective subtle backgrounds, but labels must carry the meaning.

### Accessibility scope and known limitation

These are verified **pairings**, not whole-page AAA certification. The guide sidebar uses rust-hover text on surface (7.508:1). Testing every interactive state and target, keyboard/screen-reader behavior, zoom, and production rendering remains part of release acceptance; this guide does not silently claim full accessibility certification.

---

## 3. Typography and spatial foundations

### Families and font setup

| Role | Actual CSS family | Token/fallback | Usage |
| --- | --- | --- | --- |
| Editorial/display | `Signal Newsreader` (Newsreader) | `--font-display`: `'Signal Newsreader', Georgia, serif` | Headings, insight title, gauge number |
| Interface/body | `Signal Jakarta` (Plus Jakarta Sans) | `--font-body`: `'Signal Jakarta', system-ui, sans-serif` | Body, controls, labels, notes |
| Technical metadata | System monospace | `--font-mono`: `ui-monospace, SFMono-Regular, Consolas, monospace` | Model/sample metadata and code |

The canonical CSS includes both `@font-face` declarations: **normal style**, variable **200–800**, `font-display: swap`, and URLs `/signal/newsreader.woff2` and `/signal/jakarta.woff2`. The guide recommends **400–700** for ordinary typography; that recommendation does not change the declared 200–800 range. Both shipped binaries are **Latin subsets**, not comprehensive multilingual fonts. Add licensed script coverage and appropriate fallbacks intentionally when needed.

No italic face is shipped. Do not request synthetic italic; use normal-style emphasis, weight, or color. The guide's hero `<em>` is explicitly styled `font-style: normal`. For new typography rules, retain normal style or disable font synthesis and supply a genuine licensed italic face before using italic designs. Keep content usable when custom fonts fail. Do not distribute legacy proprietary fonts as substitutes.

### Scale and implemented exceptions

| Token/role | Exact size | Implemented treatment |
| --- | --- | --- |
| `--text-h1` | `clamp(2.75rem, 6vw, 5rem)` | Hero: Newsreader 500, line-height 1.02, tracking −.045em |
| `--text-h2` | `clamp(2rem, 4vw, 3rem)` | Section heading: Newsreader 500, line-height 1.15, tracking −.035em |
| `--text-h3` | `1.5rem` | Type-scale sample: Newsreader 500, line-height 1.25 |
| `--text-body` | `1rem` | Guide root: Jakarta 400, line-height 1.6 |
| `--text-caption` | `.8125rem` | Caption/metric-note size; metric note line-height 1.6 |
| `--text-metric` | `3.5rem` | Gauge number: **Newsreader 500**, line-height 1, tabular numerals |
| Insight-card title | **`1.7rem`** | Newsreader 500, line-height 1.2, tracking −.02em |
| Insight-card body | `.9375rem` | Jakarta 400, line-height 1.7, secondary text |
| Button label | `.875rem` | Jakarta 600, line-height 1.4 |
| Badge label | `.75rem` | Jakarta 600, line-height 1.4 |
| Input / field label | `1rem` / `.875rem` | Jakarta 400/1.5 / 500/1.5 |

Tokens are sizes, not a promise that every specimen uses the same CSS. The guide's H1 scale specimen uses `clamp(2.5rem, 4vw, 4rem)` / 1.1, unlike its hero. Gauge suffixes use Jakarta 1rem / 1.5. Eyebrows and resource metadata use smaller explicit sizes in the modules. Do not move the metric to Jakarta or change the shared card title to 1.5rem while describing the existing design.

### Space, surfaces, and layout

- Spacing tokens: `--space-1` `.25rem`, `--space-2` `.5rem`, `--space-3` `.75rem`, `--space-4` `1rem`, `--space-6` `1.5rem`, `--space-8` `2rem`, `--space-12` `3rem`, `--space-16` `4rem`, `--space-24` `6rem` (4–96px at a 16px root).
- Radii: `--radius-sm` **12px**, `--radius-md` **16px**, `--radius-lg` **24px**. Shared buttons/inputs use small; cards/gauge use large. Badges and the gauge track use pill rounding.
- `--shadow-soft`: `0 4px 12px rgb(65 43 29 / .05), 0 16px 40px rgb(65 43 29 / .06)`.
- `--shadow-raised`: `0 8px 16px rgb(65 43 29 / .08), 0 24px 56px rgb(65 43 29 / .09)`.
- Shared cards/gauge have **1.75rem padding**; controls are **48px minimum height**. New interactive targets should be at least 44 × 44 CSS px; a minimum height alone does not guarantee every possible label meets that area.
- The actual guide layout has a **1600px maximum width**, a 235px sidebar (190px at widths up to 1100px), and main gutters `clamp(1.5rem, 5vw, 5rem)`. At widths up to 760px it becomes a stacked layout with 1.25rem main gutters.
- Component-preview panels become one column at widths up to 1100px. Type/insight/motion/resource/form grids become one column at widths up to 760px. Section padding is 3.5rem vertically, reduced to 2.5rem on mobile.

These details are owned by [guide layout CSS](../components/signal/Guide.module.css); they are not required dimensions for every product using the components. Preserve wrapping, text zoom, and meaningful hierarchy rather than clipping content to fit.

---

## 4. Motion and interaction

| Actual token or animation | Value | Implemented use |
| --- | --- | --- |
| `--ease-spring` | `cubic-bezier(.34, 1.35, .64, 1)` | Button/link transform feedback |
| `--ease-settle` | `cubic-bezier(.22, 1, .36, 1)` | Gauge width and resource shadow transitions |
| `--duration-fast` | `120ms` | Button background response with `ease` |
| `--duration-base` | `220ms` | Button transform (spring) and shadow (`ease`), resource shadow (settle) |
| `--duration-slow` | `360ms` | Gauge fill-width transition |
| Guide `breathe` / Tailwind `signal-breathe` | `2.8s ease-in-out infinite` | Decorative scale 1 → 1.12 → 1 |

The cubic-beziers **approximate a spring feel**; they are not physical spring simulations. No JavaScript spring dependency is required by the shared components. The guide suggests settle timing for future cards/popovers, but the shared card does not currently animate on entry and no popover export exists.

### Current behavior

- Enabled button hover: `scale(1.02)`; press: `scale(.97)` and removal of the small button shadow. No layout dimensions change.
- Primary hover fill becomes rust-hover. Secondary hover becomes surface with ink text. Disabled buttons do not transform or respond to hover.
- Loading disables the button, sets `aria-busy`, and replaces its children with **“Working…”**. It does not preserve the original children or add a spinner/live region. The component controls `aria-busy`; a caller's supplied value does not override its loading mapping.
- Gauge width transitions over 360ms; the number does not count up or pulse. A changing sample percentage is not a live-service claim.
- The guide's decorative orbit is `aria-hidden` and has an actual **Pause/Resume animation** button with `aria-pressed`. Pause sets `animation-play-state: paused` for that orbit only, not a persistent global motion preference.

### Reduced motion

[Shared component CSS](../components/signal/Signal.module.css) removes button/gauge transitions and button hover/press transforms under `prefers-reduced-motion: reduce`. [Guide CSS](../components/signal/Guide.module.css) removes orbit animation and solid-link/resource transitions and link transforms. No smooth scrolling is introduced by these files.

Tailwind's extension defines an animation but does **not** automatically apply reduced-motion handling. Every consumer must use `motion-safe:` for decorative animation and transformations, and `motion-reduce:transition-none` for transitions, as shown below. Keep status and evidence readable when still. Do not pulse text or use an animation as the sole loading/status announcement. Announce real asynchronous outcomes with a separate, deliberate status region owned by the application. The guide already uses `role="status"` for preview feedback and clipboard results.

---

## 5. Standalone Tailwind configuration

### Complete Tailwind 3 configuration for a new consumer

[The actual extension](../signal.tailwind.js) exports **theme extension fields**, not a complete config or a preset. Install it under `theme.extend`; do not put the bare object in `presets` or invoke it as a plugin. This complete standalone configuration uses the unchanged shared extension:

```js
const signal = require('./signal.tailwind');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // Avoid a global reset when embedding alongside another visual system.
  corePlugins: { preflight: false },
  theme: {
    extend: signal,
  },
  plugins: [],
};
```

This is a **consumer setup example**, not a claim that the living guide loads a separate utility bundle. The implemented React components use CSS Modules and have **no Tailwind runtime/style dependency**. The repository's [root Tailwind config](../tailwind.config.js) already spreads this extension into `theme.extend`, merges `signal.colors` with the unchanged legacy colors, and retains its existing build policy. No standalone Signal utility stylesheet is currently shipped or linked by the page.

For a new standalone utility build, use the following CSS entry and the configuration above in your normal Tailwind 3/PostCSS pipeline. Load the canonical token/font CSS separately before the output. These two directives do not provide a browser reset:

```css
@tailwind components;
@tailwind utilities;
```

Set the consumer's own baseline (box sizing, margins, inherited body font, canvas color) inside its theme wrapper. Do not load the legacy site's compiled utility/theme sheet to get a reset. Tailwind class selectors are not themselves scoped by the extension; `.signal-theme` scopes their **variable values**, not every generated utility selector. The colors are opaque variable mappings, not alpha-channel-aware color definitions; do not assume opacity suffixes work or preserve contrast.

### Exact extension vocabulary

| Extension field | Actual keys / examples |
| --- | --- |
| `colors.signal` | `canvas`, `surface`, `elevated`, `ink`, `muted`, `rust`, `rust-hover`, `amber`, `sage`, `clay`, `outline` |
| `fontFamily` | `signal-display`, `signal-body`, `signal-mono` |
| `borderRadius` | `signal-sm` 12px, `signal-md` 16px, `signal-lg` 24px |
| `boxShadow` | `signal-soft`, `signal-raised` referencing canonical shadow variables |
| `transitionTimingFunction` | `signal-spring`, `signal-settle` with the curves in section 4 |
| `keyframes` / `animation` | `signal-breathe`: scale 1/1.12, 2.8s ease-in-out infinite |

Use `bg-signal-rust`, `text-signal-ink`, `text-signal-muted`, `hover:bg-signal-rust-hover`, `border-signal-outline`, `font-signal-display`, `rounded-signal-lg`, `shadow-signal-soft`, and `ease-signal-spring`. Avoid bare legacy color utilities.

The extension does **not** define custom font-size, spacing, duration, error, or subtle-status color utilities. Use ordinary Tailwind utilities or arbitrary CSS-variable values: `text-[length:var(--text-metric)]`, `duration-[var(--duration-base)]`, `bg-[var(--success-subtle)]`, `border-[var(--accent-error)]`. Build class names as static strings so content scanning can find them; do not generate names by concatenating tone strings.

---

## 6. Core components, integration, and distribution

### Shared module and actual contracts

The source barrel and implementations live in [the shared React module](../components/signal/index.tsx); styles are in [the companion CSS Module](../components/signal/Signal.module.css). The [living page](../pages/signal/index.tsx) imports these exports directly, not separate demo copies. [Guide CSS](../components/signal/Guide.module.css) owns only the demonstration layout and page baseline.

| Export | Actual props and behavior |
| --- | --- |
| `SignalButton` | Native button props and forwarded ref; `variant?: 'primary' \| 'secondary'`, `loading?: boolean`; defaults to primary and `type="button"`; loading/disabled use native disabled semantics; accepts `className` |
| `SignalBadge` | `tone?: 'success' \| 'warning' \| 'neutral'`, `children: ReactNode`; neutral default; plain text-capable span, no automatic icon/dot, live region, or `className` prop |
| `SignalInsightCard` | `title: string`, `children: ReactNode`, `status?: ReactNode`; article with supplied status, “Signal insight” eyebrow, and h3 title; status is not a tone/label object |
| `SignalGauge` | `value: number \| null`, `label: string`, `citations?: number`, `sampleSize?: number`; numeric count props, not source objects; no badge/status/sample-label props |
| `SignalInput` | Native input props and forwarded ref plus `label: string`, `hint?: string`, `error?: string`; accepts `className` on the input; generated or supplied id; merged `aria-describedby`; visible required text; error takes precedence over hint |

Badge, card, and gauge do not forward arbitrary native props; compose wrappers for additional semantics. Gauge behavior is intentionally documented as implemented: finite values are **clamped to 0–100**, the displayed value is rounded, and `aria-valuenow` retains the clamped number. `null` and nonfinite numbers show “—” / “No data” and an `aria-hidden` empty track, without a meter. **0 is a measured zero**, rendered with a meter and empty fill. Known values have `role="meter"`, min/max, accessible label, and citation-specific value text. If both count props are supplied, the note says “N of D evaluated responses cited your brand”; otherwise it uses a generic description.

The gauge does not derive the percentage, validate count consistency or denominators, fetch data, render evidence links, or inject an illustrative-data tag. Callers must validate finite integer counts, `0 <= citations <= sampleSize`, a positive denominator, and consistency with the percentage. Use `null` when there is no valid denominator and explain the reason outside the gauge. Avoid supplying misleading count notes in unavailable states. Finite out-of-range values are clamped by the component, but callers should reject them rather than presenting a corrected value as measured evidence. Use this gauge only for citation visibility because its accessible wording is specific to that meaning; accuracy/share-of-voice need intentionally different contracts.

Input error text uses **primary ink**; an invalid input gets a 2px error-accent border and `aria-invalid`. The component associates one error-or-hint note with the input and preserves caller description ids. It does not validate or submit by itself, nor does its error note automatically become an alert. Applications own validation, submission, feedback announcements, and error-summary/focus behavior.

### React composition: use the library, not copied implementations

This is an example for a page at the same directory depth as the living guide. Token CSS must already be loaded, as described below. All five core components are used with their actual props:

```tsx
import {
  SignalBadge, SignalButton, SignalGauge, SignalInput, SignalInsightCard,
} from '../../components/signal';

export default function SignalExample() {
  return (
    <main className="signal-theme" style={{
      background: 'var(--bg-canvas)', color: 'var(--text-primary)',
      fontFamily: 'var(--font-body)', padding: 'var(--space-6)',
    }}>
      <p>Illustrative data, not a live connection.</p>
      <SignalInsightCard
        title="Your expertise is finding its audience."
        status={<SignalBadge tone="success">Opportunity</SignalBadge>}
      >
        <p>72 of 100 evaluated responses cite your brand in this example.</p>
        <SignalButton variant="secondary">Review evidence</SignalButton>
      </SignalInsightCard>
      <SignalGauge value={72} label="Citation visibility" citations={72} sampleSize={100} />
      <SignalGauge value={null} label="Citation visibility" />
      <SignalBadge tone="warning">Needs attention</SignalBadge>
      <SignalInput label="Your website" type="url" required autoComplete="url"
        placeholder="https://yourbrand.com" hint="Enter a complete website URL." />
      <SignalInput label="Website to review" type="url"
        error="Enter a complete website URL, such as https://yourbrand.com." />
      <SignalButton>Find my signal</SignalButton>
      <SignalButton loading>Find my signal</SignalButton>
      <SignalButton disabled>Unavailable</SignalButton>
    </main>
  );
}
```

Attach application behavior rather than treating this composition as a working service. A real submit control must explicitly set `type="submit"`. The loading example renders “Working…” instead of its children. Page-owned sample disclosures, sources, dates, and uncertainty remain visible outside the reusable controls.

### React/Tailwind anatomy examples

These fragments explain **visual anatomy** for Tailwind consumers using section 5. They are not replacement exports and are not used by the living page. Prefer shared components in production. They retain actual utility names, approved text mappings, the 1.7rem Newsreader card title, and reduced-motion behavior without duplicating the component library's full logic.

```tsx
export function TailwindAnatomy() {
  return (
    <div className="signal-theme bg-signal-canvas p-6 font-signal-body text-signal-ink">
      <button type="button" className="inline-flex min-h-[48px] items-center justify-center
        rounded-signal-sm border border-signal-rust bg-signal-rust px-[1.35rem] py-[.8rem]
        text-sm font-semibold leading-[1.4] text-signal-elevated
        shadow-[0_3px_0_rgb(65_43_29_/_0.13)]
        transition-[transform,background-color,box-shadow] duration-[var(--duration-base)] ease-signal-spring
        enabled:hover:bg-signal-rust-hover motion-safe:enabled:hover:scale-[1.02]
        motion-safe:enabled:active:scale-[.97] enabled:active:shadow-none motion-reduce:transition-none
        focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-signal-rust focus-visible:outline-offset-4
        disabled:cursor-not-allowed disabled:border-signal-outline disabled:bg-signal-surface disabled:text-signal-muted disabled:shadow-none">
        Find my signal
      </button>

      <span className="inline-flex rounded-full bg-[var(--success-subtle)] px-[.65rem] py-[.35rem]
        text-xs font-semibold leading-[1.4] text-signal-ink">Cited in response</span>
      <span className="inline-flex rounded-full bg-[var(--warning-subtle)] px-[.65rem] py-[.35rem]
        text-xs font-semibold leading-[1.4] text-signal-ink">Needs attention</span>

      <article className="rounded-signal-lg border border-signal-clay bg-signal-elevated p-7 shadow-signal-soft">
        <p className="text-[.7rem] font-semibold uppercase tracking-[.09em] text-signal-muted">Signal insight</p>
        <h3 className="mb-3 mt-5 font-signal-display text-[1.7rem] font-medium leading-[1.2] tracking-[-.02em]">
          Your expertise is finding its audience.
        </h3>
        <p className="text-[.9375rem] leading-[1.7] text-signal-muted">Evidence makes the next step clearer.</p>
      </article>

      <section aria-label="Citation visibility" className="rounded-signal-lg border border-signal-clay bg-signal-elevated p-7">
        <p className="text-sm font-semibold">Citation visibility — illustrative data</p>
        <p className="my-5 font-signal-display text-[length:var(--text-metric)] font-medium leading-none tabular-nums">
          72<span className="ml-[.35rem] font-signal-body text-base font-normal text-signal-muted">%</span>
        </p>
        <div role="meter" aria-label="Citation visibility" aria-valuemin={0} aria-valuemax={100}
          aria-valuenow={72} aria-valuetext="72 percent of evaluated responses cited your brand"
          className="h-[10px] overflow-hidden rounded-full bg-signal-clay">
          <span className="block h-full w-[72%] rounded-full bg-signal-sage transition-[width]
            duration-[var(--duration-slow)] ease-signal-settle motion-reduce:transition-none" />
        </div>
        <p className="mt-[.9rem] text-[.8125rem] leading-[1.6] text-signal-muted">72 of 100 evaluated responses cited your brand.</p>
      </section>

      <div className="grid gap-[.6rem]">
        <label htmlFor="anatomy-website" className="text-sm font-medium">Your website (required)</label>
        <input id="anatomy-website" type="url" required aria-invalid="true" aria-describedby="anatomy-error"
          placeholder="https://yourbrand.com" className="box-border min-h-[48px] w-full rounded-signal-sm
          border-2 border-[var(--accent-error)] bg-signal-canvas px-4 py-[.9rem] text-base text-signal-ink
          placeholder:text-signal-muted placeholder:opacity-100
          focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-signal-rust focus-visible:outline-offset-4" />
        <p id="anatomy-error" className="text-[.8125rem] leading-[1.6] text-signal-ink">Enter a complete website URL.</p>
      </div>

      <a href="#evidence" className="text-signal-rust-hover underline underline-offset-4 hover:text-signal-ink">Review evidence</a>
      <span aria-hidden="true" className="inline-block size-3 rounded-full bg-signal-sage motion-safe:animate-signal-breathe" />
    </div>
  );
}
```

The button anatomy uses a single base/spring transition for brevity; the authoritative CSS Module separately times background at 120ms with `ease`, transform at 220ms with spring, and shadow at 220ms with `ease`. Use the shared button for exact timing/loading behavior. Normal input anatomy uses a 1px strong border; hints and disabled input text use muted. Neutral badges use surface with ink.

Supply a real evidence destination and unique input ids when composing multiple instances. Continuous decorative motion needs a pause control as well as reduced-motion support. Do not copy this static 72% specimen as live measurement logic. For secondary-button anatomy use a transparent light-surface background, ink text, strong border, no shadow, and surface hover; retain muted-on-surface for disabled/loading states and never use opacity to signal them.

### CSS/font setup and current route isolation

For this Next.js Pages Router workspace, [the app entry](../pages/_app.js) globally imports `../public/signal/tokens.css`. That import supplies **both font-face CSS and scoped tokens**. The living page supplies `.signal-theme` and its CSS Module root. Fonts and logo are served from `/signal/`; there is no need for a second font stylesheet, duplicate palette, or downloaded runtime script.

For a new site:

1. Reuse the canonical token/font CSS through shared source or managed distribution. Load it once in the framework's permitted global CSS entry (Pages Router: the app entry; other frameworks: their global/root entry).
2. Serve both font binaries at the paths referenced by the stylesheet, or explicitly adapt the asset URLs/base for that site's deployment. Loading the CSS from a remote URL does not make its root-relative font URLs portable automatically.
3. Put `.signal-theme` on the product root and provide a scoped canvas/body baseline and box sizing. The class declares variables, not a complete reset. Keep portalled content under a themed ancestor too. Avoid legacy layouts and typography; retain usable fallbacks.
4. Import the shared React barrel with its **companion CSS Module**. Source distribution requires React 18, TypeScript/TSX support, and a CSS Modules-capable build; the barrel alone is not a self-contained browser script. The page-only guide module is optional, not a dependency of the five components.
5. If using Tailwind anatomy/layouts, install the extension under `theme.extend`, compile utilities, and include all consumer/source locations in content scanning. The React components themselves work without this step.
6. Ship full font license notices with redistributed binaries and verify language coverage. Use managed updates rather than independently maintained component copies.

Current isolation is precise rather than absolute: the app checks `router.pathname === '/signal' || router.pathname.startsWith('/signal/')`, omits the three legacy stylesheet links on those routes, and renders the page without `RetainerProvider`, `Toaster`, or `RetainerModal`. Legacy routes retain their stylesheet links and wrapper. The global modal-video vendor CSS import **still exists**. Shared SEO/analytics infrastructure remains. Signal font declarations are globally available, but tokens are scoped and do not change legacy colors. The guide adds route head styles for body margin zero and light color-scheme. Do not claim that every global stylesheet was removed or that a standalone Tailwind bundle isolates the route.

Check direct SSR, hydration, client navigation in both directions, back/forward, computed styles, and legacy-route regressions before release. Conditional stylesheet links are implemented; visual isolation across every navigation path still needs runtime verification.

### Implemented static downloads

[The allowlisted asset API](../pages/api/signal/assets.ts) implements `GET` and `HEAD` at `/api/signal/assets?file=<name>`. The living page constructs its download links from these exact names:

| Allowed filename | Canonical source | Actual content type |
| --- | --- | --- |
| tokens.css | [Token/font CSS](../public/signal/tokens.css) | `text/css` |
| logo.svg | [Original mark](../public/signal/logo.svg) | `image/svg+xml` |
| STYLE_GUIDE.md | [This guide](STYLE_GUIDE.md) | `text/markdown` |
| signal.tailwind.js | [Theme extension](../signal.tailwind.js) | `text/javascript` |
| newsreader.woff2 | [Newsreader binary](../public/signal/newsreader.woff2) | `font/woff2` |
| jakarta.woff2 | [Jakarta binary](../public/signal/jakarta.woff2) | `font/woff2` |
| newsreader-license.txt | Full `LICENSE` resolved from `@fontsource-variable/newsreader` | `text/plain` |
| jakarta-license.txt | Full `LICENSE` resolved from `@fontsource-variable/plus-jakarta-sans` | `text/plain` |

License download names are API aliases for dependency license files; no corresponding license text files currently exist in the public Signal directory. The licenses contain the complete **SIL Open Font License 1.1** and upstream copyright notices for the Newsreader Project Authors and Plus Jakarta Sans Project Authors. Both fonts are third-party OFL fonts bundled by Manifest Signal, not fonts authored by Manifest. The dependencies are declared in [the package manifest](../package.json); retain the full upstream notices, not a one-line attribution, when redistributing. License text mentioning upstream italic filenames does not mean an italic face is included in this kit.

Do not sell font binaries by themselves, remove notices, or ignore reserved-name requirements when modifying font software. System monospace is a fallback stack, not a bundled font. Use lockfile versions, verify normal-Latin binary provenance and checksums for releases, and disclose subset limitations; do not claim a generated asset manifest already exists.

The handler uses a fixed server-side map, never a query-derived filesystem path. Missing, duplicate/array, non-string, unknown, case-mismatched, or traversal-style filename values return **404**. Unsupported methods return **405** with `Allow: GET, HEAD`. Successful responses send attachment filename, `X-Content-Type-Options: nosniff`, byte length, and **`Cache-Control: public, max-age=3600`**. `HEAD` reads the same asset and returns headers without its body. A mapped-file read failure returns **500 “Asset unavailable”**, not 404. The handler does not implement custom ETags, immutable versioned URLs, or a revalidation policy. Mutable downloads may remain cached for up to an hour.

The API serves canonical files, not handcrafted download copies. Tokens copied by the page come from `/signal/tokens.css`; color swatches are extracted from canonical CSS by `getStaticProps` at build time. Rebuild after changing tokens so swatch labels remain consistent. React source and CSS Modules are **not** API-allowlisted downloads; distribute them together through shared source access today or the future package.

### Production deployment and future package

Before declaring a deployment production-ready, validate the actual output/container, not just local source availability:

- Ensure runtime reads can access this guide, the extension, public assets, and both committed font licenses. The API uses allowlisted `process.cwd()` paths; [Next configuration](../next.config.js) includes these assets in API output tracing. Container builds must preserve the same runtime paths. No raw license files are imported into webpack.
- Test every allowed download, `HEAD`, attachment headers, byte equality to sources, unknown/duplicate/traversal values, unsupported methods, missing-asset behavior, and cache freshness. Check font URLs return font bytes, not an HTML fallback, in the real Nixpacks/production environment.
- Verify loaded font families, subset coverage, no synthetic italic, scoped variables, approved default/hover/disabled/error text mappings, focus boundaries, 200%/400% zoom, keyboard/screen-reader behavior, and reduced-motion/pause states before making broader conformance claims.
- Verify zero/null/nonfinite/clamped gauge states, upstream count consistency, URL validation feedback, loading prevention of repeated actions, route stylesheet switching, and representative legacy pages. Accessibility and deployment checks are not implied by version number.

A future private, versioned npm package (an illustrative name is `@manifest/signal`) should publish React exports/declarations, **compiled companion component CSS**, token/font CSS, this exact Tailwind extension, permitted font binaries with full licenses, approved mark assets, and a versioned guide. Define React/React DOM peers and supported builds, portable font paths, CSS import order, project code/artwork licensing, checksums, and release/migration notes. That package is **not currently available**; do not show working package-install claims.

Use ordinary build-time imports and authenticated package distribution when it ships. Never fetch/eval remote React source or treat the download API as a module loader. Keep one canonical implementation; derive release artifacts and guide downloads from it, pin versions, and verify contrast/licensing on each release. The living `/signal` route is already the shared-component reference for **v0.1.0**, while package publication remains the next distribution step.
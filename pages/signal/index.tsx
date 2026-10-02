import Head from 'next/head';
import type { GetStaticProps } from 'next';
import { useState } from 'react';
import { SignalBadge, SignalButton, SignalGauge, SignalInput, SignalInsightCard } from '../../components/signal';
import styles from '../../components/signal/Guide.module.css';

type Color = { token: string; value: string; label: string };
const navigation = ['Foundations', 'Color', 'Typography', 'Components', 'Motion', 'Resources'];
const download = (file: string) => `/api/signal/assets?file=${encodeURIComponent(file)}`;

export default function SignalGuide({ colors }: { colors: Color[] }) {
  const [variant, setVariant] = useState<'primary' | 'secondary'>('primary');
  const [loading, setLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(72);
  const [copied, setCopied] = useState('');

  async function copyTokens() {
    try {
      const response = await fetch('/signal/tokens.css');
      if (!response.ok) throw new Error('Unavailable');
      await navigator.clipboard.writeText(await response.text());
      setCopied('Tokens copied to clipboard.');
    } catch { setCopied('Clipboard unavailable. Use Download tokens instead.'); }
  }

  return <div className={`signal-theme ${styles.root}`}>
    <Head>
      <style key="signal-baseline">{'body { margin: 0; } html { color-scheme: light; }'}</style>
      <title key="title">Manifest Signal — Living design system</title>
      <meta key="description" name="description" content="A warm, human design language. Explore the shared foundations and components behind Manifest Signal." />
      <meta key="og:title" property="og:title" content="Manifest Signal — Living design system" />
      <meta key="og:description" property="og:description" content="Human intelligence meets elastic precision." />
      <meta key="robots" name="robots" content="noindex, follow" />
    </Head>
    <a className={styles.skip} href="#guide-content">Skip to content</a>
    <header className={styles.header}>
      <a href="#foundations" className={styles.brand} aria-label="Manifest Signal foundations">
        <img src="/signal/logo.svg" width="40" height="40" alt="" />
        <span>manifest <strong>signal</strong><small>A product by Manifest FTS</small></span>
      </a>
      <div className={styles.headerEnd}><span className={styles.version}>Design system / v0.1</span><a className={styles.resourceLink} href={download('STYLE_GUIDE.md')}>Get the guide <span aria-hidden="true">↗</span></a></div>
    </header>
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <p className={styles.eyebrow}>The living library</p>
        <nav aria-label="Style guide sections">{navigation.map((name, index) => <a key={name} href={`#${name.toLowerCase()}`}><span>0{index + 1}</span>{name}</a>)}</nav>
        <div className={styles.sidebarNote}><span className={styles.smallMark} aria-hidden="true">∿</span><p>One language.<br />Many possibilities.</p><small>Built to be shared.<br />Designed to feel human.</small></div>
      </aside>
      <main id="guide-content" className={styles.main}>
        <section id="foundations" className={styles.hero} aria-labelledby="hero-title">
          <p className={styles.eyebrow}><span className={styles.statusDot} />Manifest Signal / Foundations</p>
          <h1 id="hero-title">Intelligence, with<br /><em>a human touch.</em></h1>
          <p className={styles.heroCopy}>A living design language for finding your signal in the wild. Warm by nature. Precise by design. Made for the people on the other side of the screen.</p>
          <div className={styles.heroActions}><a className={styles.solidLink} href="#components">Explore the components <span aria-hidden="true">↓</span></a><a className={styles.textLink} href="#resources">Take it with you <span aria-hidden="true">↗</span></a></div>
          <div className={styles.wave} aria-hidden="true"><svg viewBox="0 0 920 150" fill="none"><path d="M-20 90C90-20 180 210 300 90S480-20 590 90 760 210 940 30" /><path d="M-20 110C90 0 180 230 300 110S480 0 590 110 760 230 940 50" /><path d="M-20 70C90-40 180 190 300 70S480-40 590 70 760 190 940 10" /></svg></div>
          <div className={styles.principles}>
            <div><span>01 / Human</span><h3>Clarity before cleverness.</h3><p>Editorial warmth, honest language, and a place to breathe.</p></div>
            <div><span>02 / Tactile</span><h3>Something you can feel.</h3><p>Soft edges, grounded surfaces, and depth with intention.</p></div>
            <div><span>03 / Elastic</span><h3>Responsive, never restless.</h3><p>Gentle spring feedback. Fast decisions. A quieter kind of energy.</p></div>
          </div>
        </section>

        <section id="color" className={styles.section} aria-labelledby="color-title">
          <SectionHeading number="02" title="A warmer spectrum." id="color-title" description="Earth, paper, and a little fire. A palette that feels familiar, not futuristic." />
          <div className={styles.swatches}>{colors.map((color) => <div key={color.token} className={styles.swatch}>
            <div style={{ background: `var(${color.token})` }} className={styles.swatchColor} aria-hidden="true" />
            <div className={styles.swatchInfo}><strong>{color.label}</strong><span>{color.value}</span><code>{color.token}</code></div>
          </div>)}</div>
          <div className={styles.annotation}><strong>Warmth without compromise.</strong><span>Primary and secondary text meet WCAG AAA on our neutral surfaces. Color is always paired with a label; clay borders are decorative, not focus indicators.</span></div>
          <div className={styles.inlineActions}><SignalButton variant="secondary" onClick={copyTokens}>Copy CSS tokens</SignalButton><a className={styles.textLink} href={download('tokens.css')}>Download tokens ↗</a><span role="status">{copied}</span></div>
        </section>

        <section id="typography" className={styles.section} aria-labelledby="type-title">
          <SectionHeading number="03" title="Words with character." id="type-title" description="Newsreader brings the soul. Plus Jakarta Sans brings the clarity." />
          <div className={styles.typeGrid}>
            <div className={styles.typeSpecimen}><p className={styles.eyebrow}>Display / Newsreader</p><div className={styles.serifSample}>Aa<span>Good things<br />come into focus.</span></div><p>Editorial, generous, quietly confident.<br />Headlines · 400–700 · variable serif</p></div>
            <div className={styles.typeSpecimen}><p className={styles.eyebrow}>Interface / Plus Jakarta Sans</p><div className={styles.sansSample}>Aa<span>A clear view.<br />A confident next step.</span></div><p>Approachable precision at every size.<br />Body & interface · 400–700 · variable sans</p></div>
          </div>
          <div className={styles.typeScale}>
            <div><code>H1 / 44–80</code><span className={styles.scaleH1}>Find your signal.</span></div>
            <div><code>H2 / 32–48</code><span className={styles.scaleH2}>See the bigger picture.</span></div>
            <div><code>H3 / 24</code><span className={styles.scaleH3}>Small details. Meaningful insights.</span></div>
            <div><code>Body / 16</code><span>Understand where your brand shows up, and what to do next.</span></div>
            <div><code>Caption / 13</code><span className={styles.caption}>Last evaluated October 2, 2026 · illustrative data</span></div>
            <div><code>Data / mono</code><span className={styles.mono}>model: sample · responses: 100 · cited: 72</span></div>
          </div>
        </section>

        <section id="components" className={styles.section} aria-labelledby="components-title">
          <SectionHeading number="04" title="Familiar pieces. Fresh possibilities." id="components-title" description="The actual components your products will use. No lookalike demos. No duplicated styles." />
          <div className={styles.componentGrid}>
            <div className={styles.componentPanel}><div className={styles.panelTitle}><h3>Buttons</h3><code>SignalButton</code></div>
              <div className={styles.buttonDemo}><SignalButton variant={variant} loading={loading} onClick={() => setFeedback('Button activated. This is an interaction preview.')}>Find my signal <span aria-hidden="true">↗</span></SignalButton><SignalButton disabled>Unavailable</SignalButton></div>
              <fieldset className={styles.controls}><legend>Preview states</legend><label><input type="checkbox" checked={variant === 'secondary'} onChange={e => setVariant(e.target.checked ? 'secondary' : 'primary')} /> Secondary</label><label><input type="checkbox" checked={loading} onChange={e => setLoading(e.target.checked)} /> Loading</label></fieldset><p className={styles.smallNote}>48px touch target · visible keyboard focus · elastic press</p>
            </div>
            <div className={styles.componentPanel}><div className={styles.panelTitle}><h3>Status, with context</h3><code>SignalBadge</code></div><div className={styles.badgeDemo}><SignalBadge tone="success">Cited in response</SignalBadge><SignalBadge tone="warning">Needs attention</SignalBadge><SignalBadge>Awaiting evaluation</SignalBadge></div><p className={styles.smallNote}>Readable labels, not color alone. No implied certainty.</p></div>
            <div className={styles.fullPanel}><div className={styles.panelTitle}><h3>Insights & visibility</h3><span className={styles.smallNote}>Illustrative data, not a live connection</span></div>
              <div className={styles.insightGrid}><SignalInsightCard title="Your expertise is finding its audience." status={<SignalBadge tone="success">Opportunity</SignalBadge>}><p>In this example, 72 of 100 evaluated responses cite your brand. Make your strongest answers easier to discover.</p><SignalButton variant="secondary" onClick={() => setFeedback('Example insight: publish a clear, sourced answer to your audience’s most frequent question.')}>Explore the insight ↗</SignalButton></SignalInsightCard>
                <div><SignalGauge value={score} label="Citation visibility" citations={score} sampleSize={100} /><label className={styles.rangeLabel}>Preview citation percentage<input aria-label="Citation percentage preview" type="range" min="0" max="100" value={score} onChange={e => setScore(Number(e.target.value))} /></label></div></div>
            </div>
            <div className={styles.fullPanel}><div className={styles.panelTitle}><h3>A thoughtful first step</h3><code>SignalInput</code></div>
              <form className={styles.form} noValidate onSubmit={e => { e.preventDefault(); let valid = false; try { const url = new URL(domain); valid = ['http:', 'https:'].includes(url.protocol) && url.hostname.includes('.'); } catch {} setError(valid ? '' : 'Enter a complete website URL, such as https://yourbrand.com.'); setFeedback(valid ? 'Website accepted. This preview does not submit or store data.' : 'Please correct the website URL.'); }}>
                <SignalInput label="Your website" type="url" required placeholder="https://yourbrand.com" value={domain} onChange={e => { setDomain(e.target.value); setError(''); }} hint="A starting point for understanding your visibility. Nothing is sent from this preview." error={error} autoComplete="url" /><SignalButton type="submit">Check the format ↗</SignalButton>
              </form>
            </div>
          </div><p className={styles.feedback} role="status">{feedback}</p>
        </section>

        <section id="motion" className={styles.section} aria-labelledby="motion-title">
          <SectionHeading number="05" title="A little give. A lot of intention." id="motion-title" description="Human intelligence meets elastic precision. Motion confirms your action—it never competes for your attention." />
          <div className={styles.motionGrid}><div className={styles.motionPreview}><div className={`${styles.orbit} ${paused ? styles.paused : ''}`} aria-hidden="true"><span /></div><strong>Signal in the wild</strong><p>Organic breath / 2.8 seconds</p><SignalButton variant="secondary" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? 'Resume' : 'Pause'} animation</SignalButton></div>
            <div className={styles.motionSpecs}><div><strong>Soft spring</strong><code>cubic-bezier(.34, 1.35, .64, 1)</code><p>Buttons: hover 1.02, press 0.97. Settle in 220ms.</p></div><div><strong>Fluid settle</strong><code>cubic-bezier(.22, 1, .36, 1)</code><p>Cards and popovers: 360ms. No disorienting travel.</p></div><div><strong>Respect the person</strong><p>Reduced-motion settings remove pulse, transforms, and transitions. Status remains readable when completely still.</p></div></div></div>
        </section>

        <section id="resources" className={styles.section} aria-labelledby="resources-title">
          <SectionHeading number="06" title="Made to travel." id="resources-title" description="Shared foundations for the next Manifest sites and apps. Download the essentials, keep the language consistent." />
          <div className={styles.resources}>{[
            ['Design specification', 'STYLE_GUIDE.md', 'Principles, anatomy, accessibility, and integration.'],
            ['CSS design tokens', 'tokens.css', 'One canonical palette, type scale, and motion language.'],
            ['Tailwind extension', 'signal.tailwind.js', 'Portable utilities for new sites and applications.'],
            ['Signal wave mark', 'logo.svg', 'Original, scalable vector artwork.'],
            ['Newsreader font', 'newsreader.woff2', 'Latin variable display font · SIL Open Font License.'],
            ['Plus Jakarta Sans font', 'jakarta.woff2', 'Latin variable interface font · SIL Open Font License.'],
            ['Newsreader license', 'newsreader-license.txt', 'Include this license when redistributing the font.'],
            ['Jakarta Sans license', 'jakarta-license.txt', 'Include this license when redistributing the font.'],
          ].map(([label, file, description]) => <a href={download(file)} key={file}><div><strong>{label}</strong><p>{description}</p></div><span aria-hidden="true">↓</span><span className={styles.visuallyHidden}>Download {label}</span></a>)}</div>
          <div className={styles.annotation}><strong>One source. Not another copy.</strong><span>Today, pages import the shared Signal components. Next, a versioned package will let every Manifest product use that same library. Existing proprietary logo fonts are not included in this download kit.</span></div>
        </section>
        <footer className={styles.footer}><span>Manifest Signal <span aria-hidden="true">∿</span> A product by Manifest FTS</span><span>Human by design. / v0.1.0</span></footer>
      </main>
    </div>
  </div>;
}

function SectionHeading({ number, title, description, id }: { number: string; title: string; description: string; id: string }) {
  return <div className={styles.sectionHeading}><p className={styles.eyebrow}>Chapter {number}</p><h2 id={id}>{title}</h2><p>{description}</p></div>;
}

export const getStaticProps: GetStaticProps = async () => {
  const { readFile } = await import('fs/promises');
  const { join } = await import('path');
  const source = await readFile(join(process.cwd(), 'public/signal/tokens.css'), 'utf8');
  const labels: Record<string, string> = {
    '--bg-canvas': 'Sand', '--bg-surface': 'Warm stone', '--bg-elevated': 'Paper', '--text-primary': 'Espresso',
    '--text-secondary': 'Taupe', '--accent-signal-primary': 'Terracotta', '--accent-warning': 'Copper',
    '--accent-success': 'Forest', '--border-subtle': 'Soft clay',
  };
  const colors = Object.entries(labels).map(([token, label]) => {
    const match = source.match(new RegExp(`${token}:\\s*(#[0-9a-fA-F]{6})`));
    if (!match) throw new Error(`Missing design token ${token}`);
    return { token, label, value: match[1] };
  });
  return { props: { colors } };
};
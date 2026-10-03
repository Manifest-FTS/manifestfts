import { useState } from 'react';
import Link from 'next/link';

export function Button({ href, variant = 'primary', className = '', children, ...props }) {
  const classes = `mf-button ${variant === 'primary' ? '' : `mf-button--${variant}`} ${className}`.trim();
  if (href) return <Link href={href}><a className={classes} {...props}>{children}</a></Link>;
  return <button className={classes} {...props}>{children}</button>;
}

export function Tag({ tone = 'neutral', children }) {
  return <span className={`mf-tag ${tone === 'neutral' ? '' : `mf-tag--${tone}`}`}>{children}</span>;
}

export function SectionIntro({ eyebrow, title, copy, action }) {
  return <div className={`mf-section-head ${action ? 'mf-section-head--row' : ''}`}>
    <div><p className="mf-eyebrow">{eyebrow}</p><h2 className="mf-title">{title}</h2>{copy && <p className="mf-lede">{copy}</p>}</div>
    {action}
  </div>;
}

const engines = [
  { name: 'ChatGPT', pct: 72 },
  { name: 'Perplexity', pct: 64 },
  { name: 'Claude', pct: 48 },
  { name: 'Gemini', pct: 36 },
  { name: 'Google AI Overviews', pct: 22 },
];
const prompts = [
  'How do I choose a reliable technology partner?',
  'Best approach to protect customer data on a website',
  'When should a business move to a headless CMS?',
];

export function SignalPreview() {
  const [prompt, setPrompt] = useState(0);
  return <div className="mf-signal-preview" aria-label="Illustrative Manifest Signal interface preview">
    <div className="mf-signal-preview__top"><span className="mf-signal-preview__label">Manifest Signal / Visibility sample</span><Tag tone="success">Sample data</Tag></div>
    <label className="mf-signal-preview__prompt" htmlFor="signal-prompt">Tracked buyer question</label>
    <select id="signal-prompt" value={prompt} onChange={(event) => setPrompt(Number(event.target.value))} aria-label="Select a sample buyer question">
      {prompts.map((item, index) => <option key={item} value={index}>{item}</option>)}
    </select>
    <div className="mf-signal-preview__models" aria-label="Illustrative answer engine results">
      {engines.map((engine, index) => {
        const value = Math.max(8, Math.min(96, engine.pct + (prompt === 1 ? (index % 2 ? 9 : -7) : prompt === 2 ? (index % 2 ? -8 : 5) : 0)));
        return <div className="mf-signal-preview__row" key={engine.name}>
          <span>{engine.name}</span><div className="mf-signal-preview__track" aria-hidden="true"><div className="mf-signal-preview__fill" style={{ width: `${value}%` }} /></div><span className="mf-signal-preview__score">{value}%</span>
        </div>;
      })}
    </div>
    <div className="mf-signal-preview__footer"><span>Illustrative response share · not live data</span><Link href="/services#signal" legacyBehavior><a className="mf-text-link" aria-label="Learn about AI search and Manifest Signal">Explore Signal ↗</a></Link></div>
  </div>;
}

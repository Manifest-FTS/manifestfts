import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { Button, SectionIntro, Tag } from '../components/manifest-site';

const needs = [
  { id: 'new-build', title: 'New build or redesign', detail: 'Website, product, or platform' },
  { id: 'infrastructure', title: 'Managed hosting & data trust', detail: 'Infrastructure, domains, security, support' },
  { id: 'signal', title: 'AEO optimization with Manifest Signal', detail: 'AI search visibility and citation work' },
  { id: 'retainer', title: 'Full technology retainer', detail: 'Ongoing strategy, design, and engineering' },
];

function buildBrief(selected, context) {
  const labels = needs.filter((need) => selected.includes(need.id)).map((need) => need.title);
  return [
    'MANIFEST FTS / PROJECT BRIEF',
    '',
    `Primary needs: ${labels.length ? labels.join('; ') : 'Not selected yet'}`,
    '',
    'Context and priorities:',
    context.trim() || 'Add a short description of the organization, current challenge, and desired outcome.',
    '',
    'Next step: Manifest FTS will review the request and follow up to clarify scope, constraints, and a sensible path forward. This form does not calculate or promise a project price.',
  ].join('\n');
}

export default function ContactPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState([]);
  const [context, setContext] = useState('');
  const [form, setForm] = useState({ fullname: '', email: '', phone: '', company: '' });
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const queryNeed = typeof router.query.need === 'string' ? router.query.need : '';
    if (queryNeed && needs.some((need) => need.id === queryNeed)) setSelected((current) => current.includes(queryNeed) ? current : [...current, queryNeed]);
  }, [router.query.need]);

  const brief = useMemo(() => buildBrief(selected, context), [selected, context]);
  const toggleNeed = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const changeField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function submitRequest(event) {
    event.preventDefault();
    setError('');
    if (!selected.length) { setStep(1); setError('Choose at least one primary need.'); return; }
    if (!consent) { setError('Please confirm that Manifest FTS may use these details to respond to your inquiry.'); return; }
    setSubmitting(true);
    try {
      const categoryNames = needs.filter((need) => selected.includes(need.id)).map((need) => need.title);
      const response = await fetch('/api/mail', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'getQuote', ...form,
          inquiry: categoryNames.join(' + '),
          message: `${context.trim()}\n\n--- Tailored project brief ---\n${brief}`,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.status !== 'Ok') throw new Error(result.error || 'We could not send your inquiry. Please try again.');
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'We could not send your inquiry. Please try again.');
    } finally { setSubmitting(false); }
  }

  return <Layout><div className="mfts-site">
    <header className="mf-page-hero"><div className="mf-container"><p className="mf-eyebrow">MANIFEST FTS / START A CONVERSATION</p><h1>Start with what needs to change.</h1><p>Share the primary need and a little context. We’ll shape a clear brief together—there is no automated price estimate or commitment in this form.</p></div></header>
    <section className="mf-section"><div className="mf-container">
      {submitted ? <div className="mf-card mf-success-panel"><Tag tone="success">Request received</Tag><h2>Thank you. We’ll take a thoughtful look.</h2><p className="mf-body-copy">Your project brief has been sent to Manifest FTS. We’ll follow up using the contact details you provided.</p><Button href="/services" variant="secondary">Review our services</Button></div> : <>
        <SectionIntro eyebrow="PROJECT INTAKE" title="A short brief that starts a useful conversation." copy="Select all needs that apply. Your brief preview updates as you go and is included with your inquiry." />
        <div className="mf-intake">
          <form className="mf-card mf-intake__panel" onSubmit={submitRequest}>
            <div className="mf-intake__progress" aria-label={`Step ${step} of 3`}>
              {['Primary needs', 'Project context', 'Contact details'].map((label, index) => <span key={label} className={`mf-intake__step ${step === index + 1 ? 'is-current' : ''} ${step > index + 1 ? 'is-done' : ''}`} data-step={step > index + 1 ? '✓' : index + 1} aria-current={step === index + 1 ? 'step' : undefined}>{label}</span>)}
            </div>
            {step === 1 && <div><p className="mf-eyebrow">STEP 1 / WHAT DO YOU NEED?</p><h2 style={{margin:'0 0 16px',fontSize:24,letterSpacing:'-.035em'}}>Choose one or more priorities</h2><div className="mf-intake__choices">{needs.map((need) => <button type="button" key={need.id} className="mf-choice" aria-pressed={selected.includes(need.id)} onClick={() => toggleNeed(need.id)}><span className="mf-choice__mark" aria-hidden="true">{selected.includes(need.id) ? '✓' : ''}</span><span><strong>{need.title}</strong><small>{need.detail}</small></span></button>)}</div><div className="mf-intake__actions"><span className="mf-form-note">Select multiple if your needs overlap.</span><Button type="button" onClick={() => { if (!selected.length) setError('Choose at least one primary need.'); else { setError(''); setStep(2); } }}>Continue →</Button></div></div>}
            {step === 2 && <div><p className="mf-eyebrow">STEP 2 / ADD CONTEXT</p><h2 style={{margin:'0 0 8px',fontSize:24,letterSpacing:'-.035em'}}>What should we understand first?</h2><p className="mf-form-note" style={{marginBottom:18}}>A few sentences are enough. Mention a goal, constraint, existing system, or target timing if useful.</p><div className="mf-field"><label htmlFor="project-context">Organization and project context</label><textarea id="project-context" value={context} onChange={(event) => setContext(event.target.value)} placeholder="We are a ... Our current challenge is ... A useful outcome would be ..." maxLength={3000} /></div><div className="mf-intake__actions"><Button type="button" variant="secondary" onClick={() => setStep(1)}>← Back</Button><Button type="button" onClick={() => setStep(3)}>Continue →</Button></div></div>}
            {step === 3 && <div><p className="mf-eyebrow">STEP 3 / HOW CAN WE REACH YOU?</p><h2 style={{margin:'0 0 17px',fontSize:24,letterSpacing:'-.035em'}}>Share your contact details</h2><div className="mf-grid-2"><div className="mf-field"><label htmlFor="contact-name">Name *</label><input id="contact-name" name="fullname" value={form.fullname} onChange={changeField} autoComplete="name" required maxLength={120} /></div><div className="mf-field"><label htmlFor="contact-email">Work email *</label><input id="contact-email" type="email" name="email" value={form.email} onChange={changeField} autoComplete="email" required maxLength={254} /></div><div className="mf-field"><label htmlFor="contact-company">Organization</label><input id="contact-company" name="company" value={form.company} onChange={changeField} autoComplete="organization" maxLength={120} /></div><div className="mf-field"><label htmlFor="contact-phone">Phone (optional)</label><input id="contact-phone" name="phone" type="tel" value={form.phone} onChange={changeField} autoComplete="tel" maxLength={60} /></div></div><label className="mf-form-note" style={{display:'flex',gap:9,alignItems:'flex-start',marginTop:4}}><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required style={{marginTop:4,accentColor:'#4353c7'}} />I agree that Manifest FTS may use these details to respond to this project inquiry. See the <Link href="/privacy-policy" legacyBehavior><a className="mf-text-link">Privacy Policy</a></Link>.</label><div className="mf-intake__actions"><Button type="button" variant="secondary" onClick={() => setStep(2)}>← Back</Button><Button type="submit" disabled={submitting}>{submitting ? 'Sending brief…' : 'Send project brief ↗'}</Button></div></div>}
            {error && <p role="alert" className="mf-tag mf-tag--warning" style={{marginTop:16,whiteSpace:'normal'}}>{error}</p>}
          </form>
          <aside className="mf-card mf-brief-preview"><Tag tone="info">Live brief preview</Tag><h3>What we’ll send</h3><p className="mf-form-note">This draft is included in your inquiry so we can start with relevant context.</p><pre>{brief}</pre><p className="mf-form-note" style={{marginTop:12}}>We review scope and constraints together; this tool does not estimate a price.</p></aside>
        </div>
      </>}
    </div></section>
  </div></Layout>;
}

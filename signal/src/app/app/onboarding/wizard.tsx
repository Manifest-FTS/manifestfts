'use client';
import * as React from 'react';
import { useActionState } from 'react';
import { ArrowLeft, ArrowRight, Check, Plus, Sparkles, Trash2 } from 'lucide-react';
import { createWorkspace, type ActionState } from '../_actions/workspace';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/ui/submit-button';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { suggestPrompts, INDUSTRIES, type SuggestedPrompt } from '@/lib/suggestions';
import { ENGINES } from '@/lib/engines';
import type { EngineId, Intent } from '@/lib/db/schema';
import { cn } from '@/lib/cn';
import { track } from '@/lib/analytics';

const STEPS = ['Brand', 'Competitors', 'Prompts', 'Engines'] as const;
const INTENT_LABEL: Record<Intent, string> = { discovery: 'Discovery', comparison: 'Comparison', evaluation: 'Evaluation', brand: 'Brand' };

interface PromptRow extends SuggestedPrompt { selected: boolean; key: string }

export function OnboardingWizard({ firstName }: { firstName: string }) {
  const [step, setStep] = React.useState(0);
  const [brand, setBrand] = React.useState({ brandName: '', domain: '', category: '', audience: '', industry: '', description: '', aliases: '' });
  const [competitors, setCompetitors] = React.useState([{ name: '', domain: '' }, { name: '', domain: '' }, { name: '', domain: '' }]);
  const [prompts, setPrompts] = React.useState<PromptRow[]>([]);
  const [custom, setCustom] = React.useState('');
  const [engines, setEngines] = React.useState<EngineId[]>(['chatgpt', 'perplexity', 'gemini', 'claude']);
  const [runFrequency, setRunFrequency] = React.useState<'daily' | 'weekly' | 'manual'>('weekly');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [state, action] = useActionState<ActionState, FormData>(createWorkspace, {});
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    headingRef.current?.focus();
    track('onboarding_step', { step: STEPS[step] });
  }, [step]);

  const validCompetitors = competitors.filter((c) => c.name.trim().length >= 2 && c.domain.trim().length >= 4);

  const goToPrompts = () => {
    if (!prompts.length) {
      const suggestions = suggestPrompts({ brand: brand.brandName.trim(), category: brand.category, audience: brand.audience, competitors: validCompetitors.map((c) => c.name.trim()) });
      setPrompts(suggestions.map((s, i) => ({ ...s, selected: true, key: `s${i}` })));
    }
    setStep(2);
  };

  const next = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (brand.brandName.trim().length < 2) e.brandName = 'Enter your brand name.';
      if (!/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i.test(brand.domain.trim())) e.domain = 'Enter a domain like example.com.';
      if (brand.category.trim().length < 3) e.category = 'Describe what you offer in a few words.';
    }
    if (step === 2 && prompts.filter((p) => p.selected).length < 3) e.prompts = 'Choose at least three prompts.';
    if (step === 3 && !engines.length) e.engines = 'Choose at least one engine.';
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step === 1) return goToPrompts();
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const payload = JSON.stringify({
    brandName: brand.brandName, domain: brand.domain, category: brand.category, audience: brand.audience, industry: brand.industry, description: brand.description,
    aliases: brand.aliases.split(',').map((a) => a.trim()).filter((a) => a.length >= 2),
    competitors: validCompetitors,
    prompts: prompts.filter((p) => p.selected).map(({ text, topic, intent }) => ({ text, topic, intent })),
    engines, runFrequency,
  });

  const selectedCount = prompts.filter((p) => p.selected).length;

  return (
    <div>
      <ol className="mb-10 grid grid-cols-4 gap-2" aria-label="Setup progress">
        {STEPS.map((label, i) => (
          <li key={label} aria-current={i === step ? 'step' : undefined}>
            <div className={cn('h-1 rounded-full transition-colors duration-300', i <= step ? 'bg-accent' : 'bg-bg-muted')} />
            <p className={cn('mt-2 text-[12.5px] font-medium', i === step ? 'text-fg' : 'text-fg-faint')}>
              <span className="sr-only">Step {i + 1} of {STEPS.length}: </span>{label}{i < step && <span className="sr-only"> (complete)</span>}
            </p>
          </li>
        ))}
      </ol>

      {state.error && <Alert tone="danger" className="mb-6">{state.error}</Alert>}

      <div key={step} className="animate-rise">
        {step === 0 && (
          <section aria-labelledby="step-title" className="grid gap-5">
            <header>
              <h1 id="step-title" ref={headingRef} tabIndex={-1} className="text-[26px] font-semibold tracking-[-0.03em] text-fg outline-none">Welcome, {firstName}. Let’s set up your first brand.</h1>
              <p className="mt-2 text-[15px] text-fg-muted">Signal uses these details to recognize mentions of you and citations of your site.</p>
            </header>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Brand name" htmlFor="brandName" error={errors.brandName}>
                <Input id="brandName" value={brand.brandName} onChange={(e) => setBrand({ ...brand, brandName: e.target.value })} placeholder="Northwind Health" autoComplete="organization" aria-invalid={!!errors.brandName} />
              </Field>
              <Field label="Primary domain" htmlFor="domain" error={errors.domain}>
                <Input id="domain" value={brand.domain} onChange={(e) => setBrand({ ...brand, domain: e.target.value })} placeholder="northwind.health" inputMode="url" spellCheck={false} aria-invalid={!!errors.domain} />
              </Field>
            </div>
            <Field label="What do you offer?" htmlFor="category" error={errors.category} hint="A few words a customer would use, like “telehealth scheduling software”.">
              <Input id="category" value={brand.category} onChange={(e) => setBrand({ ...brand, category: e.target.value })} placeholder="telehealth scheduling software" aria-invalid={!!errors.category} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Who is it for?" htmlFor="audience" optional>
                <Input id="audience" value={brand.audience} onChange={(e) => setBrand({ ...brand, audience: e.target.value })} placeholder="small clinics" />
              </Field>
              <Field label="Industry" htmlFor="industry" optional>
                <Select id="industry" value={brand.industry} onChange={(e) => setBrand({ ...brand, industry: e.target.value })}>
                  <option value="">Select an industry</option>
                  {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                </Select>
              </Field>
            </div>
            <Field label="Other names people use" htmlFor="aliases" optional hint="Comma-separated, for example an abbreviation or former name.">
              <Input id="aliases" value={brand.aliases} onChange={(e) => setBrand({ ...brand, aliases: e.target.value })} placeholder="Northwind, NWH" />
            </Field>
            <Field label="One-sentence description" htmlFor="description" optional>
              <Textarea id="description" rows={2} value={brand.description} onChange={(e) => setBrand({ ...brand, description: e.target.value })} placeholder="Northwind Health helps independent clinics offer same-day telehealth appointments." />
            </Field>
          </section>
        )}

        {step === 1 && (
          <section aria-labelledby="step-title" className="grid gap-5">
            <header>
              <h1 id="step-title" ref={headingRef} tabIndex={-1} className="text-[26px] font-semibold tracking-[-0.03em] text-fg outline-none">Who do buyers compare you with?</h1>
              <p className="mt-2 text-[15px] text-fg-muted">Add up to six competitors. Signal measures share of voice against them and shows where they appear and you don’t. You can change these later.</p>
            </header>
            <ul className="grid gap-3">
              {competitors.map((c, i) => (
                <li key={i} className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
                  <Field label={i === 0 ? 'Name' : `Competitor ${i + 1} name`} htmlFor={`cn${i}`} className={i === 0 ? '' : '[&_label]:sr-only'}>
                    <Input id={`cn${i}`} value={c.name} placeholder="Contoso Care" onChange={(e) => setCompetitors(competitors.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                  </Field>
                  <Field label={i === 0 ? 'Domain' : `Competitor ${i + 1} domain`} htmlFor={`cd${i}`} className={i === 0 ? '' : '[&_label]:sr-only'}>
                    <Input id={`cd${i}`} value={c.domain} placeholder="contoso.com" spellCheck={false} onChange={(e) => setCompetitors(competitors.map((x, j) => (j === i ? { ...x, domain: e.target.value } : x)))} />
                  </Field>
                  <Button type="button" variant="ghost" size="icon" aria-label={`Remove competitor ${i + 1}`} onClick={() => setCompetitors(competitors.filter((_, j) => j !== i))} disabled={competitors.length === 1}>
                    <Trash2 aria-hidden />
                  </Button>
                </li>
              ))}
            </ul>
            {competitors.length < 6 && (
              <Button type="button" variant="secondary" size="sm" className="justify-self-start" onClick={() => setCompetitors([...competitors, { name: '', domain: '' }])}>
                <Plus aria-hidden />Add competitor
              </Button>
            )}
          </section>
        )}

        {step === 2 && (
          <section aria-labelledby="step-title" className="grid gap-5">
            <header>
              <h1 id="step-title" ref={headingRef} tabIndex={-1} className="text-[26px] font-semibold tracking-[-0.03em] text-fg outline-none">Choose the questions to track</h1>
              <p className="mt-2 text-[15px] text-fg-muted">We drafted these from what you offer. Keep the ones your customers would really ask, edit freely, and add your own.</p>
            </header>
            {errors.prompts && <Alert tone="danger">{errors.prompts}</Alert>}
            <div className="flex items-center justify-between text-[13px] text-fg-muted">
              <span className="flex items-center gap-1.5"><Sparkles className="size-3.5 text-accent" aria-hidden />{selectedCount} selected</span>
              <button type="button" className="font-medium text-accent hover:underline" onClick={() => setPrompts(prompts.map((p) => ({ ...p, selected: selectedCount !== prompts.length })))}>
                {selectedCount === prompts.length ? 'Clear all' : 'Select all'}
              </button>
            </div>
            <ul className="grid gap-2">
              {prompts.map((p, i) => (
                <li key={p.key} className={cn('flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors', p.selected ? 'border-accent/40 bg-accent-subtle/40' : 'border-border bg-panel')}>
                  <input type="checkbox" id={`p${i}`} checked={p.selected} onChange={() => setPrompts(prompts.map((x, j) => (j === i ? { ...x, selected: !x.selected } : x)))} className="size-4 shrink-0 accent-[var(--accent)]" aria-label={`Track: ${p.text}`} />
                  <input value={p.text} onChange={(e) => setPrompts(prompts.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} className="min-w-0 flex-1 bg-transparent text-[14px] text-fg focus:outline-none" aria-label={`Prompt ${i + 1} text`} />
                  <Badge tone="outline" className="hidden sm:inline-flex">{INTENT_LABEL[p.intent]}</Badge>
                </li>
              ))}
            </ul>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (custom.trim().length >= 8) { setPrompts([...prompts, { text: custom.trim(), topic: 'Custom', intent: 'discovery', selected: true, key: `c${Date.now()}` }]); setCustom(''); } }}>
              <label htmlFor="custom" className="sr-only">Add your own prompt</label>
              <Input id="custom" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Add your own question…" />
              <Button type="submit" variant="secondary"><Plus aria-hidden />Add</Button>
            </form>
          </section>
        )}

        {step === 3 && (
          <section aria-labelledby="step-title" className="grid gap-6">
            <header>
              <h1 id="step-title" ref={headingRef} tabIndex={-1} className="text-[26px] font-semibold tracking-[-0.03em] text-fg outline-none">Choose engines and cadence</h1>
              <p className="mt-2 text-[15px] text-fg-muted">Your workspace starts with labeled sample data so you can explore right away. Live collection can be switched on in settings.</p>
            </header>
            <fieldset>
              <legend className="text-[13.5px] font-medium text-fg">Answer engines</legend>
              {errors.engines && <p className="mt-1 text-[13px] text-danger" role="alert">{errors.engines}</p>}
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {ENGINES.map((e) => {
                  const checked = engines.includes(e.id);
                  return (
                    <label key={e.id} className={cn('flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors', checked ? 'border-accent/50 bg-accent-subtle/40' : 'border-border hover:border-border-strong/60')}>
                      <input type="checkbox" checked={checked} onChange={() => setEngines(checked ? engines.filter((x) => x !== e.id) : [...engines, e.id])} className="size-4 accent-[var(--accent)]" />
                      <span className="size-2 rounded-full" style={{ background: `var(--series-${e.slot})` }} aria-hidden />
                      <span className="flex-1">
                        <span className="block text-[14px] font-medium text-fg">{e.name}</span>
                        <span className="block text-[12px] text-fg-muted">{e.vendor}{!e.liveAdapter && ' · sample only'}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-[13.5px] font-medium text-fg">Run frequency</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {([['weekly', 'Weekly', 'Best for steady baselines'], ['daily', 'Daily', 'Faster feedback after changes'], ['manual', 'Manual', 'Run only when you choose']] as const).map(([value, label, hint]) => (
                  <label key={value} className={cn('flex cursor-pointer flex-col rounded-xl border px-4 py-3 transition-colors', runFrequency === value ? 'border-accent/50 bg-accent-subtle/40' : 'border-border hover:border-border-strong/60')}>
                    <span className="flex items-center gap-2 text-[14px] font-medium text-fg">
                      <input type="radio" name="freq" checked={runFrequency === value} onChange={() => setRunFrequency(value)} className="accent-[var(--accent)]" />{label}
                    </span>
                    <span className="mt-1 pl-6 text-[12px] text-fg-muted">{hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="rounded-xl border border-border bg-bg-subtle p-4 text-[13.5px] text-fg-soft">
              <p className="font-medium text-fg">Summary</p>
              <ul className="mt-2 grid gap-1">
                <li className="flex items-center gap-2"><Check className="size-3.5 text-success" aria-hidden />{brand.brandName} · {brand.domain}</li>
                <li className="flex items-center gap-2"><Check className="size-3.5 text-success" aria-hidden />{validCompetitors.length} competitor{validCompetitors.length === 1 ? '' : 's'}</li>
                <li className="flex items-center gap-2"><Check className="size-3.5 text-success" aria-hidden />{selectedCount} prompts × {engines.length} engines = {selectedCount * engines.length} answers per run</li>
              </ul>
            </div>
          </section>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-6">
        <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}><ArrowLeft aria-hidden />Back</Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={next}>Continue<ArrowRight aria-hidden /></Button>
        ) : (
          <form action={action} onSubmit={(e) => { if (!engines.length) { e.preventDefault(); setErrors({ engines: 'Choose at least one engine.' }); } else track('onboarding_completed'); }}>
            <input type="hidden" name="payload" value={payload} />
            <SubmitButton pendingLabel="Building your workspace…">Create workspace<ArrowRight aria-hidden /></SubmitButton>
          </form>
        )}
      </div>
    </div>
  );
}

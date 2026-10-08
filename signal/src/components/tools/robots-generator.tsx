'use client';
import * as React from 'react';
import { Field, Input, Textarea } from '@/components/ui/field';
import { CRAWLERS } from '@/lib/readiness/crawlers';
import { CodeOutput } from './shared';
import { cn } from '@/lib/cn';

type Policy = 'allow' | 'block';

export function RobotsGenerator() {
  const [retrieval, setRetrieval] = React.useState<Policy>('allow');
  const [training, setTraining] = React.useState<Policy>('allow');
  const [privatePaths, setPrivatePaths] = React.useState('/admin/\n/api/\n/cart\n/checkout');
  const [sitemap, setSitemap] = React.useState('https://www.example.com/sitemap.xml');

  const paths = privatePaths.split(/\n|,/).map((p) => p.trim()).filter((p) => p.startsWith('/'));
  const group = (agents: string[], allow: boolean) => [...agents.map((a) => `User-agent: ${a}`), ...(allow ? ['Allow: /', ...paths.map((p) => `Disallow: ${p}`)] : ['Disallow: /']), ''];
  const retrievalBots = CRAWLERS.filter((c) => c.kind === 'retrieval' && c.agent !== 'Googlebot' && c.agent !== 'Bingbot').map((c) => c.agent);
  const trainingBots = CRAWLERS.filter((c) => c.kind === 'training').map((c) => c.agent);
  const output = [
    '# robots.txt generated with Manifest Signal',
    `# AI retrieval crawlers: ${retrieval === 'allow' ? 'allowed' : 'blocked'} · AI training crawlers: ${training === 'allow' ? 'allowed' : 'blocked'}`,
    '',
    ...group(['*'], true),
    '# Answer engines that fetch pages to answer and cite in real time',
    ...group(retrievalBots, retrieval === 'allow'),
    '# Model training crawlers and opt-out tokens',
    ...group(trainingBots, training === 'allow'),
    ...(sitemap.trim() ? [`Sitemap: ${sitemap.trim()}`] : []),
    '',
  ].join('\n');

  const choice = (value: Policy, current: Policy, set: (p: Policy) => void, label: string, hint: string) => (
    <label className={cn('flex cursor-pointer gap-3 rounded-xl border p-3.5 transition', current === value ? 'border-accent bg-accent-subtle/50 ring-1 ring-accent' : 'border-border hover:border-border-strong/60')}>
      <input type="radio" checked={current === value} onChange={() => set(value)} className="mt-1 accent-[var(--accent)]" />
      <span><span className="block text-[14px] font-medium text-fg">{label}</span><span className="block text-[12.5px] text-fg-muted">{hint}</span></span>
    </label>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="grid content-start gap-5 rounded-2xl border border-border bg-panel p-5 shadow-raised">
        <fieldset className="grid gap-2">
          <legend className="mb-1 text-[13.5px] font-semibold text-fg">AI search and answer crawlers</legend>
          {choice('allow', retrieval, setRetrieval, 'Allow (recommended)', 'Keeps you eligible for citations in ChatGPT search, Claude, Perplexity, and others.')}
          {choice('block', retrieval, setRetrieval, 'Block', 'Removes your pages from those engines’ live answers.')}
        </fieldset>
        <fieldset className="grid gap-2">
          <legend className="mb-1 text-[13.5px] font-semibold text-fg">AI training crawlers</legend>
          {choice('allow', training, setTraining, 'Allow', 'Content may be used to train models such as GPT and Claude.')}
          {choice('block', training, setTraining, 'Block', 'Opt out of training. Does not affect live search citations or Google Search.')}
        </fieldset>
        <Field label="Private paths to disallow" htmlFor="rg-paths" hint="One per line, starting with /."><Textarea id="rg-paths" rows={4} value={privatePaths} onChange={(e) => setPrivatePaths(e.target.value)} className="font-mono text-[13px]" /></Field>
        <Field label="Sitemap URL" htmlFor="rg-sitemap"><Input id="rg-sitemap" value={sitemap} onChange={(e) => setSitemap(e.target.value)} spellCheck={false} /></Field>
      </div>
      <CodeOutput code={output} filename="robots.txt" language="text" title="robots.txt" />
    </div>
  );
}

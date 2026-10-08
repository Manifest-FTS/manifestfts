'use client';
import * as React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { CodeOutput } from './shared';
import { cn } from '@/lib/cn';

type SchemaType = 'Organization' | 'LocalBusiness' | 'FAQPage' | 'Article' | 'Product' | 'SoftwareApplication';

const TYPES: { id: SchemaType; hint: string }[] = [
  { id: 'Organization', hint: 'Your company entity' },
  { id: 'LocalBusiness', hint: 'A physical location' },
  { id: 'FAQPage', hint: 'Questions and answers' },
  { id: 'Article', hint: 'Posts and guides' },
  { id: 'Product', hint: 'A product with price' },
  { id: 'SoftwareApplication', hint: 'An app or SaaS' },
];

const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);
const clean = (o: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v !== undefined && !(Array.isArray(v) && !v.length) && !(v && typeof v === 'object' && !Array.isArray(v) && Object.keys(clean(v as Record<string, unknown>)).length <= 1)).map(([k, v]) => [k, v && typeof v === 'object' && !Array.isArray(v) ? clean(v as Record<string, unknown>) : v]));

export function SchemaGenerator() {
  const [type, setType] = React.useState<SchemaType>('Organization');
  const [f, setF] = React.useState<Record<string, string>>({ name: '', url: '', logo: '', description: '', sameAs: '', email: '', phone: '', street: '', city: '', region: '', postal: '', country: '', hours: 'Mo-Fr 09:00-17:00', priceRange: '', headline: '', author: '', datePublished: '', dateModified: '', image: '', brand: '', price: '', currency: 'USD', availability: 'InStock', sku: '', category: 'BusinessApplication', os: 'Web' });
  const [faqs, setFaqs] = React.useState([{ q: '', a: '' }]);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const address = { '@type': 'PostalAddress', streetAddress: f.street, addressLocality: f.city, addressRegion: f.region, postalCode: f.postal, addressCountry: f.country };
  const offer = { '@type': 'Offer', price: f.price, priceCurrency: f.currency, availability: f.availability ? `https://schema.org/${f.availability}` : '', url: f.url };
  const data: Record<string, unknown> = { '@context': 'https://schema.org', '@type': type };
  if (type === 'Organization' || type === 'LocalBusiness') {
    Object.assign(data, { name: f.name, url: f.url, logo: f.logo, description: f.description, sameAs: lines(f.sameAs), email: f.email, telephone: f.phone });
    if (type === 'LocalBusiness') Object.assign(data, { image: f.logo, address, priceRange: f.priceRange, openingHours: lines(f.hours) });
  } else if (type === 'FAQPage') {
    data.mainEntity = faqs.filter((x) => x.q.trim() && x.a.trim()).map((x) => ({ '@type': 'Question', name: x.q.trim(), acceptedAnswer: { '@type': 'Answer', text: x.a.trim() } }));
  } else if (type === 'Article') {
    Object.assign(data, { headline: f.headline, description: f.description, image: f.image, datePublished: f.datePublished, dateModified: f.dateModified || f.datePublished, author: f.author ? { '@type': 'Person', name: f.author } : '', publisher: f.name ? { '@type': 'Organization', name: f.name, logo: f.logo ? { '@type': 'ImageObject', url: f.logo } : '' } : '', mainEntityOfPage: f.url });
  } else if (type === 'Product') {
    Object.assign(data, { name: f.name, description: f.description, image: f.image, sku: f.sku, brand: f.brand ? { '@type': 'Brand', name: f.brand } : '', offers: f.price ? offer : '' });
  } else {
    Object.assign(data, { name: f.name, description: f.description, url: f.url, applicationCategory: f.category, operatingSystem: f.os, offers: f.price ? offer : '' });
  }
  const code = `<script type="application/ld+json">\n${JSON.stringify(clean(data), null, 2)}\n</script>`;

  const text = (k: string, label: string, placeholder = '', props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <Field label={label} htmlFor={`sg-${k}`}><Input id={`sg-${k}`} value={f[k]} onChange={set(k)} placeholder={placeholder} {...props} /></Field>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="grid content-start gap-5 rounded-2xl border border-border bg-panel p-5 shadow-raised">
        <fieldset>
          <legend className="mb-2 text-[13.5px] font-semibold text-fg">Schema type</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup">
            {TYPES.map((t) => (
              <button key={t.id} type="button" role="radio" aria-checked={type === t.id} onClick={() => setType(t.id)}
                className={cn('rounded-xl border px-3 py-2 text-left transition', type === t.id ? 'border-accent bg-accent-subtle/50 ring-1 ring-accent' : 'border-border hover:border-border-strong/60')}>
                <span className="block font-mono text-[12.5px] font-semibold text-fg">{t.id}</span>
                <span className="block text-[11.5px] text-fg-muted">{t.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {(type === 'Organization' || type === 'LocalBusiness') && (
          <div className="grid gap-4 sm:grid-cols-2">
            {text('name', 'Name', 'Acme Inc.')}
            {text('url', 'Website', 'https://www.acme.com', { inputMode: 'url' })}
            {text('logo', 'Logo URL', 'https://www.acme.com/logo.png')}
            {text('email', 'Email', 'hello@acme.com')}
            {text('phone', 'Phone', '+1-555-555-0100')}
            {type === 'LocalBusiness' && text('priceRange', 'Price range', '$$')}
            <Field label="Description" htmlFor="sg-description" className="sm:col-span-2"><Textarea id="sg-description" rows={2} value={f.description} onChange={set('description')} /></Field>
            <Field label="Official profiles (sameAs)" htmlFor="sg-sameAs" hint="One URL per line: LinkedIn, Crunchbase, Wikipedia, social accounts." className="sm:col-span-2"><Textarea id="sg-sameAs" rows={3} value={f.sameAs} onChange={set('sameAs')} className="font-mono text-[12.5px]" /></Field>
            {type === 'LocalBusiness' && (
              <>
                {text('street', 'Street address')}
                {text('city', 'City')}
                {text('region', 'State or region')}
                {text('postal', 'Postal code')}
                {text('country', 'Country', 'US')}
                <Field label="Opening hours" htmlFor="sg-hours" hint="One range per line, e.g. Mo-Fr 09:00-17:00."><Textarea id="sg-hours" rows={2} value={f.hours} onChange={set('hours')} className="font-mono text-[12.5px]" /></Field>
              </>
            )}
          </div>
        )}

        {type === 'FAQPage' && (
          <div className="grid gap-3">
            {faqs.map((x, i) => (
              <div key={i} className="grid gap-2 rounded-xl border border-border p-3">
                <div className="flex items-center justify-between"><span className="text-[12.5px] font-medium text-fg-muted">Question {i + 1}</span>
                  <Button type="button" size="icon-sm" variant="ghost" aria-label={`Remove question ${i + 1}`} disabled={faqs.length === 1} onClick={() => setFaqs(faqs.filter((_, j) => j !== i))}><Trash2 aria-hidden /></Button></div>
                <label className="sr-only" htmlFor={`faq-q-${i}`}>Question {i + 1}</label>
                <Input id={`faq-q-${i}`} value={x.q} placeholder="What does Acme cost?" onChange={(e) => setFaqs(faqs.map((y, j) => (j === i ? { ...y, q: e.target.value } : y)))} />
                <label className="sr-only" htmlFor={`faq-a-${i}`}>Answer {i + 1}</label>
                <Textarea id={`faq-a-${i}`} rows={2} value={x.a} placeholder="Plans start at $49 per month…" onChange={(e) => setFaqs(faqs.map((y, j) => (j === i ? { ...y, a: e.target.value } : y)))} />
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" className="justify-self-start" onClick={() => setFaqs([...faqs, { q: '', a: '' }])}><Plus aria-hidden />Add question</Button>
            <p className="text-[12.5px] text-fg-faint">Only mark up questions and answers that are visible on the page.</p>
          </div>
        )}

        {type === 'Article' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">{text('headline', 'Headline')}</div>
            {text('author', 'Author name')}
            {text('url', 'Article URL', '', { inputMode: 'url' })}
            {text('datePublished', 'Published', '', { type: 'date' })}
            {text('dateModified', 'Updated', '', { type: 'date' })}
            {text('image', 'Image URL')}
            {text('name', 'Publisher name')}
            <Field label="Summary" htmlFor="sg-description" className="sm:col-span-2"><Textarea id="sg-description" rows={2} value={f.description} onChange={set('description')} /></Field>
          </div>
        )}

        {(type === 'Product' || type === 'SoftwareApplication') && (
          <div className="grid gap-4 sm:grid-cols-2">
            {text('name', 'Name')}
            {type === 'Product' ? text('brand', 'Brand') : text('url', 'URL', '', { inputMode: 'url' })}
            {text('price', 'Price', '49.00', { inputMode: 'decimal' })}
            {text('currency', 'Currency', 'USD')}
            {type === 'Product' ? (
              <>
                {text('sku', 'SKU')}
                <Field label="Availability" htmlFor="sg-availability"><Select id="sg-availability" value={f.availability} onChange={set('availability')}><option>InStock</option><option>OutOfStock</option><option>PreOrder</option><option>OnlineOnly</option></Select></Field>
                {text('image', 'Image URL')}
              </>
            ) : (
              <>
                <Field label="Category" htmlFor="sg-category"><Select id="sg-category" value={f.category} onChange={set('category')}><option>BusinessApplication</option><option>DeveloperApplication</option><option>FinanceApplication</option><option>EducationalApplication</option><option>HealthApplication</option><option>LifestyleApplication</option></Select></Field>
                {text('os', 'Operating system', 'Web, iOS, Android')}
              </>
            )}
            <Field label="Description" htmlFor="sg-description" className="sm:col-span-2"><Textarea id="sg-description" rows={2} value={f.description} onChange={set('description')} /></Field>
          </div>
        )}
      </div>
      <div className="grid content-start gap-3">
        <CodeOutput code={code} filename={`${type.toLowerCase()}-schema.html`} language="JSON-LD" title={`${type} markup`} />
        <p className="text-[12.5px] text-fg-faint">Paste into the page’s HTML. Mark up only information visible on the page, then check it with the structured data validator.</p>
      </div>
    </div>
  );
}

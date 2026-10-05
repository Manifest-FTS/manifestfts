import { Mail, MessagesSquare, Wrench } from 'lucide-react';
import { PageHero } from '@/components/marketing/page-hero';
import { JsonLd } from '@/components/json-ld';
import { ContactForm } from './contact-form';
import { pageMetadata, breadcrumbLd, organizationLd } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata = pageMetadata({ title: 'Contact sales', description: 'Talk to the Manifest FTS team about Manifest Signal demos, pricing, annual plans, or hands-on AI visibility work.', path: '/contact' });

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[{ '@type': 'ContactPage', name: 'Contact Manifest Signal', mainEntity: { ...organizationLd, email: site.salesEmail } }, breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])]} />
      <PageHero eyebrow="Contact" title="Talk to the team behind Signal" lede="Questions about the product, pricing, or getting hands-on help from Manifest FTS? Send a note and a person will reply within one business day." />
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_1.5fr]">
        <ul className="grid content-start gap-6">
          {[
            { icon: MessagesSquare, title: 'Product demos', body: 'A 30-minute walkthrough using your brand and competitors.' },
            { icon: Wrench, title: 'Hands-on help', body: 'Manifest FTS can run content, technical, and structured-data work using Signal as the evidence base.' },
            { icon: Mail, title: 'Email', body: <a href={`mailto:${site.salesEmail}`} className="font-medium text-accent hover:underline">{site.salesEmail}</a> },
          ].map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-subtle text-accent"><Icon className="size-5" aria-hidden /></span>
              <div>
                <h2 className="text-[15.5px] font-semibold text-fg">{title}</h2>
                <p className="mt-1 text-[14.5px] leading-relaxed text-fg-muted">{body}</p>
              </div>
            </li>
          ))}
        </ul>
        <ContactForm />
      </div>
    </>
  );
}

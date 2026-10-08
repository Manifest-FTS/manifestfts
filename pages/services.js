import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { Button, SectionIntro, Tag } from '../components/manifest-site';
import { services } from '../data/manifestSiteContent';

export default function ServicesPage() {
  return <Layout><div className="mfts-site">
    <header className="mf-page-hero"><div className="mf-container"><p className="mf-eyebrow">MANIFEST FTS / SERVICES</p><h1>Connected disciplines. One accountable partner.</h1><p>Product design, full-stack engineering, resilient infrastructure, and practical AI search work—planned around your organization’s actual needs.</p><div className="mf-hero__actions"><Button href="/contact">Discuss your priorities ↗</Button><Button href="/work" variant="secondary">See selected work</Button></div></div></header>
    <section className="mf-section"><div className="mf-container">
      <SectionIntro eyebrow="CAPABILITIES" title="Build what matters. Maintain what works." copy="Choose a focused project or combine disciplines through an ongoing partnership. Scope and ownership are defined with you before implementation." />
      <div>{services.map((service) => <article className="mf-service-detail" id={service.id} key={service.id}>
        <span className="mf-service-detail__index">{service.number}</span>
        <div><p className="mf-eyebrow">{service.signal ? 'MANIFEST SIGNAL / ANSWER-ENGINE VISIBILITY' : 'MANIFEST FTS / ENGINEERING DISCIPLINE'}</p><h2>{service.title}</h2><p>{service.description}</p>
          <div className="mf-service-detail__meta">{service.capabilities.map((capability) => <Tag key={capability}>{capability}</Tag>)}</div>
          <div style={{marginTop:20}}><Link href={`/contact?need=${service.id}`} legacyBehavior><a className="mf-text-link">Discuss {service.title.toLowerCase()} ↗</a></Link></div>
        </div>
      </article>)}</div>
    </div></section>
    <section className="mf-section mf-section--soft"><div className="mf-container mf-grid-2" style={{alignItems:'center'}}><div><p className="mf-eyebrow">HOW WE WORK</p><h2 className="mf-title">The engineering does not end at launch.</h2></div><div className="mf-body-copy"><p>We can work to a project brief, continue through a monthly retainer, or help your team assess an existing platform. Each engagement starts with clear outcomes, roles, decision points, and an honest view of constraints.</p><p>For ongoing work, Manifest FTS can help sequence roadmap changes, keep systems maintained, and provide technical context when vendors or internal priorities change.</p><Button href="/capabilities" variant="secondary">Review the retainer model ↗</Button></div></div></section>
    <section className="mf-section"><div className="mf-container mf-band"><p className="mf-eyebrow">READY WHEN YOU ARE</p><h2>Start with the challenge—not a tool list.</h2><p>Tell us what your team needs to accomplish. We will help identify the right first conversation.</p><Button href="/contact">Create a tailored project brief ↗</Button></div></section>
  </div></Layout>;
}

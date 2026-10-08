import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/layout/Layout';
import { Button, SectionIntro, SignalPreview, Tag } from '../components/manifest-site';
import { services, stories } from '../data/manifestSiteContent';

const pillars = [
  { icon: '⌁', title: 'Data trust & resilient infrastructure', body: 'Secure access, clear ownership, recoverable data, and infrastructure that is maintained with care. We make operational responsibilities visible instead of hiding them behind a hosting plan.' },
  { icon: '◇', title: 'Appropriate, sustainable technology', body: 'We select tools to fit the real problem, the team that will run them, and the cost of change. That means fewer unnecessary dependencies and platforms built for measured evolution.' },
  { icon: '↗', title: 'Continuous partnership', body: 'Roadmaps keep moving after launch. A consistent engineering partner helps prioritize improvements, resolve technical issues, and manage the steady work that keeps digital products useful.' },
];

export default function Home() {
  const featured = stories.slice(0, 2);
  return <Layout>
    <div className="mfts-site">
      <section className="mf-hero">
        <div className="mf-container mf-hero__layout">
          <div>
            <p className="mf-eyebrow"><span className="mf-dot" /> TRUSTED TECHNOLOGY PARTNER · EST. DIGITAL PARTNERSHIP</p>
            <h1>Technology that holds up as your organization grows.</h1>
            <p className="mf-hero__copy">Manifest FTS designs, builds, and supports durable digital platforms. We bring product thinking and engineering together—and stay accountable for the systems we put into the world.</p>
            <div className="mf-hero__actions"><Button href="/contact">Tell us what you’re working on <span aria-hidden="true">↗</span></Button><Button href="/services" variant="secondary">Explore our services</Button></div>
            <div className="mf-hero__micro"><span><i className="mf-dot" /> PRACTICAL BY DEFAULT</span><span>SECURITY IN THE DELIVERY PLAN</span><span>PARTNER AFTER LAUNCH</span></div>
          </div>
          <SignalPreview />
        </div>
      </section>

      <section className="mfts-site mf-trustbar" aria-label="Selected client partnerships">
        <div className="mf-container"><span className="mf-trustbar__label">Trusted by teams building useful things</span><div className="mf-trustbar__text"><span>NC Waterfalls</span><span>Barclay Rex</span><span>Garden State Equality</span><span>Community Coalition on Race</span></div></div>
      </section>

      <section className="mfts-site mf-section">
        <div className="mf-container">
          <SectionIntro eyebrow="A PARTNER FOR THE WHOLE SYSTEM" title="Good technology is useful, understandable, and cared for." copy="We help ambitious organizations make sound decisions about their digital products, platform architecture, data, and the people who depend on them." />
          <div className="mf-grid-3">{pillars.map((pillar, index) => <article className="mf-card mf-pillar" key={pillar.title}><span className="mf-pillar__icon" aria-hidden="true">{pillar.icon}</span><p className="mf-eyebrow">0{index + 1} / MANIFEST PRINCIPLE</p><h3>{pillar.title}</h3><p>{pillar.body}</p></article>)}</div>
        </div>
      </section>

      <section className="mfts-site mf-section mf-section--soft">
        <div className="mf-container">
          <SectionIntro eyebrow="WHAT WE DO" title="From the first product decision to the work that follows." copy="One engineering-led team can connect discovery, design, development, infrastructure, and ongoing improvement." action={<Button href="/services" variant="secondary">See all services ↗</Button>} />
          <div className="mf-grid-4">{services.map((service) => <Link href={`/services#${service.id}`} key={service.id} legacyBehavior><a className="mf-card mf-service-card"><span className="mf-service-card__num">{service.number} / DISCIPLINE</span><h3>{service.title}</h3><p>{service.summary}</p><span className="mf-service-card__link">Explore capability ↗</span></a></Link>)}</div>
        </div>
      </section>

      <section className="mfts-site mf-section">
        <div className="mf-container">
          <SectionIntro eyebrow="SELECTED CLIENT STORIES" title="Durable work, shaped around real needs." copy="We measure what can be verified and say plainly when a result is qualitative, historical, or still unknown." action={<Button href="/work" variant="secondary">Explore client stories ↗</Button>} />
          <div className="mf-grid-2">{featured.map((story) => <Link href={story.href} key={story.slug} legacyBehavior><a className="mf-card mf-story-card"><Image className="mf-story-card__image" src={story.image} alt={story.alt} width={900} height={500} /><div className="mf-story-card__body"><Tag tone="info">{story.category}</Tag><h3>{story.name}</h3><p>{story.summary}</p><div className="mf-stat-row">{story.metrics.slice(0,2).map((metric) => <span className="mf-stat" key={metric.label}><strong>{metric.value}</strong><small>{metric.label}</small></span>)}</div><p className="mf-form-note" style={{marginTop:12}}>{story.note}</p></div></a></Link>)}</div>
        </div>
      </section>

      <section className="mfts-site mf-section mf-section--soft">
        <div className="mf-container mf-grid-2" style={{alignItems:'center'}}>
          <div><p className="mf-eyebrow">A PRACTICAL WAY TO WORK TOGETHER</p><h2 className="mf-title">One-time build or ongoing technology partner?</h2><p className="mf-lede">Some needs call for a clear project. Others need a steady engineering relationship. We help you choose a sensible starting point, define ownership, and make room for what changes next.</p><div className="mf-hero__actions"><Button href="/contact">Find the right engagement <span aria-hidden="true">↗</span></Button><Button href="/capabilities" variant="secondary">How the retainer works</Button></div></div>
          <blockquote className="mf-quote">“The right foundation changes what’s possible. Build for the work you have now—and leave a path for what comes next.”<cite>Manifest FTS / Engineering-led partnership</cite></blockquote>
        </div>
      </section>

      <section className="mfts-site mf-section" id="contact-us">
        <div className="mf-container mf-band"><p className="mf-eyebrow">START WITH A CONVERSATION</p><h2>Bring us the messy middle. We’ll help make the next step clear.</h2><p>Tell us what is changing, what is not working, or what you want to build. We will respond with practical questions—not a prewritten pitch.</p><Button href="/contact">Build a project brief <span aria-hidden="true">↗</span></Button></div>
      </section>
    </div>
  </Layout>;
}

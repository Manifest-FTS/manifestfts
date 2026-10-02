import Layout from '../components/layout/Layout';
import Image from 'next/image';
import { Button, SectionIntro, Tag } from '../components/manifest-site';
import { stories } from '../data/manifestSiteContent';

function StoryCard({ story }) {
  const content = <><Image className="mf-story-card__image" src={story.image} alt={story.alt} width={900} height={500} /><div className="mf-story-card__body"><Tag tone="info">{story.category}</Tag><h2>{story.name}</h2><p>{story.summary}</p><div className="mf-stat-row">{story.metrics.map((metric) => <span className="mf-stat" key={metric.label}><strong>{metric.value}</strong><small>{metric.label}</small></span>)}</div><p className="mf-form-note" style={{marginTop:14}}>{story.note}</p><span className="mf-story-card__cta">{story.external ? 'Visit organization ↗' : 'Read project story ↗'}</span></div></>;
  return story.external
    ? <a className="mf-card mf-story-card" href={story.href} target="_blank" rel="noreferrer">{content}</a>
    : <a className="mf-card mf-story-card" href={story.href}>{content}</a>;
}

export default function WorkPage() {
  return <Layout><div className="mfts-site">
    <header className="mf-page-hero"><div className="mf-container"><p className="mf-eyebrow">MANIFEST FTS / SELECTED PARTNERSHIPS</p><h1>Work shaped around the people and systems behind it.</h1><p>Explore selected projects across content platforms, commerce, public-interest outreach, and digital infrastructure.</p></div></header>
    <section className="mf-section"><div className="mf-container">
      <SectionIntro eyebrow="CLIENT STORIES" title="Outcomes with context." copy="We share the evidence available in each case. Published traffic figures are historical snapshots; qualitative work is labeled as such. We do not turn incomplete data into invented performance claims." />
      <div className="mf-grid-2">{stories.map((story) => <StoryCard key={story.slug} story={story} />)}</div>
    </div></section>
    <section className="mf-section mf-section--soft"><div className="mf-container mf-band"><p className="mf-eyebrow">YOUR PROJECT CAN BE THE NEXT STORY</p><h2>Start with a real constraint. Build toward a useful result.</h2><p>Tell us what is difficult, changing, or newly possible. We can help shape a practical plan.</p><Button href="/contact">Start a project conversation ↗</Button></div></section>
  </div></Layout>;
}

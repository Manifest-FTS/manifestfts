import Layout from '../../components/layout/Layout';
import { SectionIntro, Tag } from '../../components/manifest-site';
import { insights } from '../../data/manifestSiteContent';

export default function InsightsIndex() {
  return <Layout><div className="mfts-site">
    <header className="mf-page-hero"><div className="mf-container"><p className="mf-eyebrow">MANIFEST FTS / INSIGHTS</p><h1>Clear thinking for consequential technology decisions.</h1><p>Practical guidance on platform architecture, data trust, and answer-engine visibility—written for teams responsible for what happens next.</p></div></header>
    <section className="mf-section"><div className="mf-container">
      <SectionIntro eyebrow="EDITORIAL / FIELD NOTES" title="Useful context, without the hype." copy="Our editorial focus is the working detail: trade-offs, ownership, evidence, and the decisions that keep digital systems useful over time." />
      <div className="mf-grid-3">{insights.map((article) => <a className="mf-card mf-article-card" href={`/insights/${article.slug}`} key={article.slug}><div className="mf-article-card__body"><Tag tone="info">{article.category}</Tag><h2>{article.title}</h2><p>{article.summary}</p><div className="mf-stat-row"><span className="mf-stat"><strong>{article.readTime}</strong><small>Reading time</small></span><span className="mf-stat"><strong>Oct 2026</strong><small>Published</small></span></div><span className="mf-story-card__cta">Read the field note ↗</span></div></a>)}</div>
    </div></section>
    <section className="mf-section mf-section--soft"><div className="mf-container mf-grid-2" style={{alignItems:'center'}}><div><p className="mf-eyebrow">A NOTE ON OUR EDITORIAL STANDARD</p><h2 className="mf-title">Specific enough to act on. Careful enough to trust.</h2></div><div className="mf-body-copy"><p>We identify the conditions behind recommendations, distinguish observation from interpretation, and link to useful source material where appropriate. Technology changes; the durable value is knowing which questions to ask and what evidence to seek.</p></div></div></section>
  </div></Layout>;
}

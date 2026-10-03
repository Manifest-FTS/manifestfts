import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { Tag } from '../../components/manifest-site';
import { insights } from '../../data/manifestSiteContent';

export default function InsightArticle({ article }) {
  const articleUrl = `https://www.manifestfts.com/insights/${article.slug}`;
  const schema = {
    '@context': 'https://schema.org', '@type': 'Article', headline: article.title,
    description: article.summary, datePublished: article.date, dateModified: article.date,
    author: { '@type': 'Organization', name: 'Manifest FTS', url: 'https://www.manifestfts.com' },
    publisher: { '@type': 'Organization', name: 'Manifest FTS', url: 'https://www.manifestfts.com' },
    mainEntityOfPage: articleUrl, articleSection: article.category, inLanguage: 'en-US',
  };

  return <Layout><div className="mfts-site">
    <header className="mf-page-hero"><div className="mf-container"><p className="mf-eyebrow"><Link href="/insights" legacyBehavior><a>INSIGHTS</a></Link> / {article.category.toUpperCase()}</p><Tag tone="info">{article.readTime}</Tag><h1 style={{marginTop:16}}>{article.title}</h1><p>{article.summary}</p><p className="mf-form-note" style={{marginTop:15}}>Manifest FTS editorial · Updated October 2, 2026</p></div></header>
    <main className="mf-container mf-article-shell">
      <article className="mf-article-body"><p><strong>{article.intro}</strong></p>
        {article.sections.map((section, index) => <section id={`section-${index + 1}`} key={section.heading}><h2>{section.heading}</h2>{section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}
        <div className="mf-card" style={{padding:22,marginTop:40}}><p className="mf-eyebrow">PUT THE IDEAS TO WORK</p><h2 style={{margin:'0 0 10px',color:'var(--mfts-ink)'}}>Need help applying this to your platform?</h2><p>Manifest FTS can help your team assess the system, define a practical next step, and support the implementation.</p><Link href="/contact" legacyBehavior><a className="mf-button">Talk through a project ↗</a></Link></div>
      </article>
      <aside className="mf-article-aside"><strong>IN THIS FIELD NOTE</strong>{article.sections.map((section, index) => <a href={`#section-${index + 1}`} key={section.heading}>{section.heading}</a>)}<Link href="/insights">← All insights</Link></aside>
    </main>
    <Head><meta property="og:type" content="article" /><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema).replace(/</g, '\\u003c')}} /></Head>
  </div></Layout>;
}

export async function getStaticPaths() {
  return { paths: insights.map((article) => ({ params: { slug: article.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const article = insights.find((item) => item.slug === params.slug);
  if (!article) return { notFound: true };
  return { props: { article } };
}

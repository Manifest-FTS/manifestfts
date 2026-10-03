import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { Button, Tag } from '../components/manifest-site';
import { stories } from '../data/manifestSiteContent';

const FILTERS = ['All stories', 'Platforms', 'Commerce', 'Public impact', 'Infrastructure'];

function getStoryGroup(story) {
  if (story.slug === 'nc-waterfalls') return 'Platforms';
  if (story.slug === 'barclay-rex') return 'Commerce';
  if (story.slug === 'community-coalition') return 'Public impact';
  return 'Infrastructure';
}

function StoryLink({ story, className, children, ...props }) {
  if (story.external) {
    return <a className={className} href={story.href} target="_blank" rel="noreferrer" {...props}>{children}</a>;
  }
  return <Link href={story.href} legacyBehavior><a className={className} {...props}>{children}</a></Link>;
}

function StoryMetrics({ metrics }) {
  return <div className="mf-work-metrics">{metrics.map((metric) => <div className="mf-work-metric" key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>;
}

function FeaturedStory({ story }) {
  return <article className="mf-work-featured">
    <div className="mf-work-featured__copy">
      <p className="mf-work-kicker"><span>FEATURED PARTNERSHIP</span><span>01 / 04</span></p>
      <Tag tone="info">{story.category}</Tag>
      <h2>{story.name}</h2>
      <p className="mf-work-featured__summary">{story.summary}</p>
      <p className="mf-work-featured__detail">A long-term collaboration turned a fieldwork collection into a structured archive people can search, explore, and continue to learn from.</p>
      <StoryMetrics metrics={story.metrics} />
      <p className="mf-work-disclosure">{story.note}</p>
      <div className="mf-work-featured__actions"><StoryLink story={story} className="mf-button">Read the project story <span aria-hidden="true">↗</span></StoryLink><a className="mf-work-text-link" href="https://www.ncwaterfalls.com" target="_blank" rel="noreferrer">Visit NC Waterfalls <span aria-hidden="true">↗</span></a></div>
    </div>
    <StoryLink story={story} className="mf-work-featured__visual" aria-label={`Open ${story.name} project story`}>
      <Image src="/assets/imgs/work/dt-work-nc-waterfalls@2x.png" alt={story.alt} width={1100} height={820} priority />
      <span className="mf-work-image-index">FIELD NOTES / NC · 2022—ONGOING</span>
      <span className="mf-work-image-caption"><span>01</span> A living archive, built to grow.</span>
      <span className="mf-work-image-spark" aria-hidden="true">↗</span>
    </StoryLink>
  </article>;
}

function StoryCard({ story, index }) {
  const themes = ['violet', 'mint', 'orange'];
  const theme = themes[index % themes.length];
  return <article className={`mf-work-card mf-work-card--${theme}`}>
    <StoryLink story={story} className="mf-work-card__link" aria-label={`View ${story.name} story`}>
      <div className="mf-work-card__visual">
        <Image src={story.image} alt={story.alt} width={900} height={560} />
        <span className="mf-work-card__number">{String(index + 2).padStart(2, '0')}</span>
        <span className="mf-work-card__arrow" aria-hidden="true">↗</span>
      </div>
      <div className="mf-work-card__content">
        <div className="mf-work-card__meta"><Tag tone="info">{story.category}</Tag><span>{getStoryGroup(story)}</span></div>
        <h3>{story.name}</h3>
        <p>{story.summary}</p>
        <StoryMetrics metrics={story.metrics.slice(0, 2)} />
        <p className="mf-work-disclosure">{story.note}</p>
        <span className="mf-work-card__cta">{story.external ? 'Visit organization' : 'Read the story'} <span aria-hidden="true">↗</span></span>
      </div>
    </StoryLink>
  </article>;
}

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState('All stories');
  const featuredStory = stories[0];
  const filteredStories = useMemo(() => {
    return activeFilter === 'All stories'
      ? stories.slice(1)
      : stories.filter((story) => getStoryGroup(story) === activeFilter);
  }, [activeFilter]);

  return <Layout><div className="mfts-site mf-work-page">
    <header className="mf-work-hero">
      <div className="mf-container mf-work-hero__inner">
        <p className="mf-work-eyebrow"><span className="mf-work-eyebrow__mark">M</span> MANIFEST FTS / SELECTED PARTNERSHIPS</p>
        <div className="mf-work-hero__layout">
          <div><h1>Built with people.<br /><span>Made to matter.</span></h1><p>Client stories about lasting platforms, thoughtful engineering, and the work behind the outcomes.</p></div>
          <div className="mf-work-hero__aside"><div className="mf-work-hero__orbit" aria-hidden="true"><i /><i /><i /><span>M</span></div><span>THE WORK IS THE RELATIONSHIP.</span><p>Every project begins with a specific challenge. The strongest results come from understanding the people, systems, and constraints around it.</p><a href="#stories">Explore the stories <span aria-hidden="true">↓</span></a></div>
        </div>
        <div className="mf-work-hero__index" aria-hidden="true"><span>01 — DISCOVER</span><span>02 — BUILD</span><span>03 — SUPPORT</span><i /></div>
      </div>
    </header>

    {activeFilter === 'All stories' && <section className="mf-work-feature-section" aria-label="Featured client story">
      <div className="mf-container"><div className="mf-work-featured-wrap"><span className="mf-work-featured__scribble" aria-hidden="true">↗</span><span className="mf-work-featured__side-note" aria-hidden="true">A LONG VIEW<br />BY DESIGN</span><FeaturedStory story={featuredStory} /></div></div>
    </section>}

    <section id="stories" className="mf-work-gallery">
      <div className="mf-container">
        <div className="mf-work-gallery__heading"><div><p className="mf-eyebrow">A FEW GOOD COLLABORATIONS</p><h2>Different challenges.<br /><span>Thoughtful outcomes.</span></h2></div><p>From mission-led organizations to established businesses, we adapt the work to the people who will depend on it.</p></div>
        <div className="mf-work-filters" role="group" aria-label="Filter stories by discipline">
          {FILTERS.map((filter) => <button type="button" key={filter} className={activeFilter === filter ? 'is-active' : ''} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}<span>{filter === 'All stories' ? stories.length : stories.filter((story) => getStoryGroup(story) === filter).length}</span></button>)}
        </div>
        {filteredStories.length ? <div className="mf-work-grid">{filteredStories.map((story, index) => <StoryCard story={story} index={index} key={story.slug} />)}</div> : <div className="mf-work-empty">More stories in this discipline are being prepared. <button type="button" onClick={() => setActiveFilter('All stories')}>See all stories →</button></div>}
      </div>
    </section>

    <section className="mf-work-note-section"><div className="mf-container mf-work-note"><span className="mf-work-note__asterisk" aria-hidden="true">✳</span><div><p className="mf-eyebrow">A NOTE ON THE NUMBERS</p><h2>Useful evidence, with the context attached.</h2><p>Metrics on this page are drawn from published project materials. Some are historical or client-reported; others describe qualitative work where no verified numeric outcome is available. They are not guarantees of future performance.</p></div><Link href="/insights/choosing-a-technology-partner" legacyBehavior><a className="mf-work-text-link">How we think about outcomes ↗</a></Link></div></section>

    <section className="mf-section"><div className="mf-container mf-work-cta"><div><p className="mf-eyebrow">YOUR STORY STARTS WITH A CONVERSATION</p><h2>What should your technology make possible?</h2><p>Bring us the ambition, the constraint, or the complicated middle. We’ll help you decide what to do next.</p></div><Button href="/contact">Start a project brief <span aria-hidden="true">↗</span></Button><span className="mf-work-cta__shape" aria-hidden="true">M</span></div></section>
  </div></Layout>;
}

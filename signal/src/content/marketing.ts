export const FAQS = [
  {
    q: 'What is Manifest Signal?',
    a: 'Manifest Signal is a web application from Manifest FTS that measures how AI answer engines such as ChatGPT, Perplexity, Gemini, and Claude describe and cite an organization. It asks each engine the questions your customers ask, records every answer and source, reports visibility with sample sizes and confidence intervals, checks your site’s technical readiness for AI crawlers, and turns gaps into prioritized, evidence-linked tasks.',
  },
  {
    q: 'How is this different from an SEO rank tracker?',
    a: 'Rank trackers record a position in a list of links. Answer engines return a written answer that may name several organizations, cite a handful of sources, and change from one request to the next. Signal stores the full answer, measures mention, citation, position, and accuracy across many samples, and reports rates with confidence intervals instead of a single rank.',
  },
  {
    q: 'Which answer engines do you track?',
    a: 'ChatGPT, Perplexity, Gemini, and Claude through their official APIs with web search enabled. Google AI Overviews and Microsoft Copilot are available as labeled sample data while official access is evaluated. Every observation records the model identifier.',
  },
  {
    q: 'Can you guarantee that AI engines will recommend us?',
    a: 'No, and you should be wary of anyone who does. Signal shows what engines say today, why, and which changes are most likely to help. It reports results honestly, including when a change is within normal variation.',
  },
  {
    q: 'Is the data in a new workspace real?',
    a: 'New workspaces start with sample data so every screen is useful immediately. Sample data is labeled everywhere it appears and is never mixed into live metrics. Switch to live collection in workspace settings when live engines are enabled.',
  },
  {
    q: 'Do you need access to our website or analytics?',
    a: 'No. Signal only needs your brand name, domain, competitors, and prompts. Readiness audits fetch public pages the way a crawler would.',
  },
  {
    q: 'How long is the trial, and do I need a card?',
    a: 'Fourteen days with Growth plan limits. No card is required. If you do not choose a plan, the workspace becomes read-only; nothing is deleted.',
  },
  {
    q: 'Who builds Signal?',
    a: 'Signal is built and supported by Manifest FTS, an engineering-led digital partner that designs, builds, and maintains web platforms. Teams that want hands-on help can engage Manifest FTS for content, technical, and structured-data work.',
  },
];

export const FEATURES = [
  {
    id: 'visibility',
    title: 'Visibility tracking',
    summary: 'Mention rate, citation rate, share of voice, and position for every prompt and engine, with sample sizes and 95% intervals on every number.',
    points: ['Daily or weekly runs across up to six engines', 'Filter by period, engine, topic, and intent', 'Changes flagged only when intervals separate'],
  },
  {
    id: 'answers',
    title: 'Answer inspector',
    summary: 'Read the exact answer each engine gave, with your brand, competitors, and cited sources highlighted in place.',
    points: ['Full answer text and model identifier', 'Highlighted mentions and positions', 'Cited sources with domains and titles'],
  },
  {
    id: 'sources',
    title: 'Source intelligence',
    summary: 'See which domains engines rely on for your category and whether they cite you, your competitors, or third parties.',
    points: ['Citation share by domain and engine', 'Owned, competitor, and third-party breakdown', 'Authority tasks for influential sources'],
  },
  {
    id: 'accuracy',
    title: 'Accuracy monitoring',
    summary: 'Keep a fact sheet, review claims engines make about you, and turn inaccuracies into corrections with an audit trail.',
    points: ['Automatic claim extraction', 'Auto-confirmation for exact fact matches', 'Review queue with notes and history'],
  },
  {
    id: 'readiness',
    title: 'Readiness audits',
    summary: 'Check robots.txt rules for eleven AI crawlers, indexability, structured data, and server-rendered content in seconds.',
    points: ['Retrieval vs training crawler policy', 'JSON-LD entity and metadata checks', 'Failing checks become tasks automatically'],
  },
  {
    id: 'tasks',
    title: 'Evidence-linked tasks',
    summary: 'Every recommendation links to the observation or check behind it, so teams can prioritize work they can defend.',
    points: ['Generated from gaps, sources, audits, and claims', 'Owners, priorities, and due dates', 'Closed automatically when checks pass'],
  },
  {
    id: 'reports',
    title: 'Stakeholder reports',
    summary: 'Snapshot a period into a clean report with your summary, then print it or share a private, revocable link.',
    points: ['Fixed snapshots that do not drift', 'Print and PDF ready', 'Private share links for clients and leadership'],
  },
  {
    id: 'team',
    title: 'Built for teams',
    summary: 'Roles, invitations, notifications, activity history, and JSON export, with data handled the way Manifest FTS handles client systems.',
    points: ['Owner, admin, editor, and viewer roles', 'Weekly digest and run alerts', 'Full workspace export'],
  },
];

export const CHANGELOG = [
  {
    version: '1.0',
    date: '2026-10-05',
    title: 'Manifest Signal is generally available',
    items: [
      'Visibility tracking across ChatGPT, Perplexity, Gemini, and Claude with confidence intervals on every rate.',
      'Answer inspector with highlighted mentions, positions, and cited sources.',
      'Readiness audits covering eleven AI crawlers, indexability, metadata, and structured data, plus a free public checker.',
      'Accuracy monitoring with a fact sheet, claim extraction, and a review queue.',
      'Evidence-linked tasks, period reports with private share links, team roles, and billing.',
    ],
  },
];

import type { EngineId } from '@/lib/db/schema';

export type ToolComponent = 'geo-audit' | 'robots-checker' | 'llms-txt' | 'robots-generator' | 'schema-generator' | 'structured-data' | 'sitemap' | 'prompt-generator' | 'visibility';
export type ToolCategory = 'Audit and analysis' | 'Generators' | 'Validators';

export interface ToolDef {
  slug: string;
  component: ToolComponent;
  category: ToolCategory;
  name: string;
  title: string;
  description: string;
  lede: string;
  engine?: EngineId;
  embeddable?: boolean;
  measures: string[];
  steps: string[];
  why: string;
  faq: { q: string; a: string }[];
}

const VISIBILITY_FAQ = [
  { q: 'Is one answer enough to judge visibility?', a: 'No. Answer engines vary from one request to the next, so a single answer is a snapshot. Signal tracks many prompts on a schedule and reports rates with confidence intervals.' },
  { q: 'Why might this tool be unavailable?', a: 'Live checks call each engine’s official API and cost money per request, so they run only when the engine is configured for this deployment and are rate limited per visitor.' },
  { q: 'Does this use my account or browsing history?', a: 'No. Questions are sent from our servers through the vendor API with web search enabled, which approximates a fresh, signed-out session.' },
];

function engineTool(engine: EngineId, name: string, vendor: string): ToolDef {
  return {
    slug: `${engine === 'chatgpt' ? 'chatgpt' : engine}-visibility-checker`,
    component: 'visibility',
    engine,
    category: 'Audit and analysis',
    name: `${name} visibility checker`,
    title: `Free ${name} visibility checker: does ${name} mention your brand?`,
    description: `Ask ${name} a real buyer question and see whether it names or cites your brand, which sources it uses, and how it describes you.`,
    lede: `Ask ${name} (${vendor}) the question your customers ask and see whether your brand is named, cited, and described accurately.`,
    measures: [`Whether ${name} names your brand`, 'Whether it cites a page on your domain', 'Which sources it relies on', 'The tone of sentences about you'],
    steps: ['Enter your brand, domain, and a buyer question', `Signal asks ${name} through its official API with web search`, 'Review the answer, citations, and mention', 'Track it over time in Signal'],
    why: `${name} answers purchase questions directly. If it names competitors and not you, buyers may never reach your site.`,
    faq: VISIBILITY_FAQ,
  };
}

export const TOOLS: ToolDef[] = [
  {
    slug: 'ai-readiness-checker',
    component: 'geo-audit',
    category: 'Audit and analysis',
    embeddable: true,
    name: 'GEO audit',
    title: 'Free GEO audit: can ChatGPT, Perplexity, Gemini, and Claude cite your site?',
    description: 'A free generative engine optimization audit: crawler access for 26 AI bots, citability, schema, entity clarity, E-E-A-T signals, and a composite GEO score.',
    lede: 'Check whether generative engines can discover, parse, trust, and cite your page. Get a composite GEO score across six dimensions and a prioritized fix list.',
    measures: ['AI crawler access for 26 retrieval and training bots', 'Citability: quotable, fact-rich, self-contained passages', 'Structured data and entity clarity', 'E-E-A-T signals: authorship, dates, sources, trust pages', 'Platform health: indexability, speed, metadata, server rendering'],
    steps: ['Enter a page URL', 'Review the composite score and the six dimensions', 'Fix the priority issues: crawl access, schema, content, proof', 'Re-run after deploying to confirm improvements'],
    why: 'A page can rank in traditional search and still be unusable as an AI answer source. A GEO audit exposes the gap between SEO visibility and citation readiness.',
    faq: [
      { q: 'What is a GEO audit?', a: 'A generative engine optimization audit checks whether answer engines such as ChatGPT, Perplexity, Gemini, Claude, and Google AI Overviews can access a page, understand it, trust it, and quote it.' },
      { q: 'How is GEO different from AEO?', a: 'The terms overlap. AEO (answer engine optimization) and GEO (generative engine optimization) both describe improving how AI systems find, cite, and describe you. GEO is often used for generative assistants and AEO for answer surfaces including featured snippets.' },
      { q: 'Does this replace a technical SEO audit?', a: 'No. It focuses on AI citation readiness. Crawlability, structured data, and speed overlap with SEO, but a full SEO audit also covers rankings, backlinks, and site-wide architecture.' },
      { q: 'Should I block GPTBot or other AI crawlers?', a: 'Blocking training crawlers such as GPTBot, ClaudeBot, or Google-Extended is a policy choice and does not remove you from live answers. Blocking retrieval crawlers such as OAI-SearchBot, ChatGPT-User, Claude-SearchBot, or PerplexityBot does.' },
    ],
  },
  {
    slug: 'robots-txt-checker',
    component: 'robots-checker',
    category: 'Validators',
    embeddable: true,
    name: 'AI robots.txt checker',
    title: 'AI robots.txt checker: which AI crawlers can access your site?',
    description: 'Check your robots.txt rules for 26 AI and search crawlers including GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, and Bingbot.',
    lede: 'See exactly which AI and search crawlers your robots.txt allows, which it blocks, and which are blocked from pages in your own sitemap.',
    measures: ['Allowed, partial, or blocked status for 26 crawlers', 'Retrieval crawlers vs training crawlers', 'The exact rule that matched each crawler', 'Sitemap pages blocked for specific bots'],
    steps: ['Enter your domain', 'Review retrieval crawlers first: these power live answers', 'Decide your training-crawler policy deliberately', 'Generate a clean robots.txt if needed'],
    why: 'A single Disallow line can silently remove your site from ChatGPT search or Perplexity answers. Many sites block AI bots by accident through broad rules or CDN templates.',
    faq: [
      { q: 'What does “partial” mean?', a: 'The audited page is allowed, but the crawler is blocked from at least one page listed in your sitemap. Blocking private areas such as /admin is fine and stays “allowed”.' },
      { q: 'Does robots.txt guarantee a crawler will not visit?', a: 'No. robots.txt is a convention that reputable crawlers follow. It is not access control; protect private content with authentication.' },
      { q: 'Which crawlers matter most for AI visibility?', a: 'Retrieval crawlers: OAI-SearchBot and ChatGPT-User (ChatGPT), Claude-SearchBot and Claude-User (Claude), PerplexityBot and Perplexity-User, Googlebot (AI Overviews), and Bingbot (Copilot).' },
    ],
  },
  engineTool('chatgpt', 'ChatGPT', 'OpenAI'),
  engineTool('perplexity', 'Perplexity', 'Perplexity AI'),
  engineTool('gemini', 'Gemini', 'Google'),
  engineTool('claude', 'Claude', 'Anthropic'),
  {
    slug: 'ai-visibility-checker',
    component: 'visibility',
    category: 'Audit and analysis',
    name: 'AI visibility checker',
    title: 'Free AI visibility checker: do ChatGPT, Perplexity, Gemini, and Claude mention you?',
    description: 'Ask several answer engines the same buyer question and compare whether each names or cites your brand.',
    lede: 'Ask ChatGPT, Perplexity, Gemini, and Claude the same buyer question and compare which ones name you, cite you, and how.',
    measures: ['Brand mention by engine', 'Citation of your domain', 'Sources each engine relies on', 'Tone of sentences about you'],
    steps: ['Enter your brand, domain, and a buyer question', 'Choose the engines to ask', 'Compare answers side by side', 'Track the question over time in Signal'],
    why: 'Each engine draws on different sources, so visibility varies widely between them. Comparing engines shows where to focus.',
    faq: VISIBILITY_FAQ,
  },
  {
    slug: 'ai-prompt-generator',
    component: 'prompt-generator',
    category: 'Generators',
    embeddable: true,
    name: 'AI prompt generator',
    title: 'AEO query generator: the questions buyers ask AI about your category',
    description: 'Generate the discovery, comparison, evaluation, and brand questions buyers ask ChatGPT and other answer engines, ready to track.',
    lede: 'Turn what you offer into the questions buyers actually ask answer engines, grouped by intent and ready to track.',
    measures: ['Discovery questions (“best X for Y”)', 'Comparison questions (“X vs Y”)', 'Evaluation questions (pricing, pros and cons)', 'Brand and local questions'],
    steps: ['Describe what you offer and who it is for', 'Add competitors and a location if relevant', 'Edit and copy the questions you want', 'Track them across engines in Signal'],
    why: 'Visibility is only meaningful against the questions that drive decisions. A good prompt set mirrors how customers phrase their research.',
    faq: [
      { q: 'How many prompts should I track?', a: 'Start with 15 to 30 across all four intents. More prompts narrow the confidence interval on your metrics.' },
      { q: 'Should brand questions be included?', a: 'Yes, but report them separately. Brand questions almost always mention you, so they measure accuracy more than discovery.' },
      { q: 'Where do the best prompts come from?', a: 'Sales calls, support tickets, site search, and People Also Ask boxes. Use generated prompts as a starting point and edit them to match real language.' },
    ],
  },
  {
    slug: 'llms-txt-generator',
    component: 'llms-txt',
    category: 'Generators',
    name: 'llms.txt generator',
    title: 'Free llms.txt generator: draft an llms.txt from your sitemap',
    description: 'Draft an llms.txt file from your site’s pages and descriptions, grouped into sections, ready to edit and publish at /llms.txt.',
    lede: 'Draft an llms.txt from your sitemap and page descriptions, grouped into clear sections. Edit, then publish it at your site root.',
    measures: ['Site name and summary', 'Key pages with titles and descriptions', 'Sections for pricing, docs, articles, and company', 'An optional section for legal pages'],
    steps: ['Enter your domain', 'Review the drafted sections and summary', 'Edit the facts you most want AI systems to get right', 'Publish at https://yourdomain.com/llms.txt'],
    why: 'llms.txt gives language models a concise map of your most authoritative pages. It is optional and not a ranking factor, but it is cheap to publish and helps agents that read it.',
    faq: [
      { q: 'Do ChatGPT or Google use llms.txt?', a: 'No major engine has committed to using it. It is an emerging convention, most useful for AI agents and tools that look for it.' },
      { q: 'What should go in llms.txt?', a: 'A one-paragraph summary, then links to your most authoritative pages with one-line descriptions. Keep it short and factual.' },
      { q: 'What is llms-full.txt?', a: 'A companion file containing the full text of key pages in Markdown, for tools that want complete context in one request.' },
    ],
  },
  {
    slug: 'robots-txt-generator',
    component: 'robots-generator',
    category: 'Generators',
    name: 'robots.txt generator for AI crawlers',
    title: 'robots.txt generator for AI crawlers: allow search, choose your training policy',
    description: 'Build a robots.txt that keeps AI retrieval crawlers allowed, sets a deliberate training-crawler policy, protects private paths, and declares your sitemap.',
    lede: 'Create a robots.txt with a deliberate AI policy: keep answer-engine retrieval open, choose your training stance, and protect private paths.',
    measures: ['Retrieval crawler access', 'Training crawler policy', 'Private path rules', 'Sitemap declaration'],
    steps: ['Choose your policy for retrieval and training crawlers', 'List private paths to disallow', 'Add your sitemap URL', 'Copy the file and publish it at /robots.txt'],
    why: 'Copy-pasted robots.txt templates often block AI retrieval bots by accident. An explicit policy keeps you citable while respecting your training preferences.',
    faq: [
      { q: 'Can I allow AI search but block AI training?', a: 'Yes. Allow retrieval crawlers such as OAI-SearchBot, Claude-SearchBot, and PerplexityBot, and disallow training crawlers such as GPTBot, ClaudeBot, Google-Extended, and CCBot.' },
      { q: 'Does blocking Google-Extended affect Google Search?', a: 'No. Google-Extended is a token that controls use for Gemini training and grounding; Googlebot crawling for Search, including AI Overviews, is unaffected.' },
      { q: 'Where does robots.txt go?', a: 'At the root of each host, for example https://www.example.com/robots.txt. Subdomains need their own file.' },
    ],
  },
  {
    slug: 'schema-generator',
    component: 'schema-generator',
    category: 'Generators',
    embeddable: true,
    name: 'Schema markup generator',
    title: 'Schema markup generator for AI search: Organization, FAQ, Article, Product JSON-LD',
    description: 'Generate valid JSON-LD for Organization, LocalBusiness, FAQPage, Article, Product, and SoftwareApplication so engines can resolve your entity.',
    lede: 'Generate valid JSON-LD that describes your organization, products, and content so search and answer engines can resolve who you are.',
    measures: ['Organization and LocalBusiness entities', 'FAQPage questions and answers', 'Article authorship and dates', 'Product and SoftwareApplication offers'],
    steps: ['Choose a schema type', 'Fill in the fields that match your visible content', 'Copy the generated script tag', 'Validate it with the structured data validator'],
    why: 'Structured data removes ambiguity about entities: who you are, what you sell, and which profiles are yours. Engines use it to connect your brand across sources.',
    faq: [
      { q: 'Does schema guarantee rich results or citations?', a: 'No. Schema helps systems understand content; eligibility for rich results and citation still depends on content quality and relevance.' },
      { q: 'Where do I put JSON-LD?', a: 'In a script tag with type="application/ld+json" in the page head or body. It must match the content visible on the page.' },
      { q: 'What is sameAs for?', a: 'sameAs lists your official profiles (LinkedIn, Crunchbase, Wikipedia, social accounts) so engines can confirm they all describe the same entity.' },
    ],
  },
  {
    slug: 'structured-data-validator',
    component: 'structured-data',
    category: 'Validators',
    name: 'Structured data validator',
    title: 'Structured data validator: check JSON-LD for AI search',
    description: 'Fetch a page and validate its JSON-LD: syntax errors, required and recommended properties for 24 schema.org types, and absolute URLs.',
    lede: 'Check that a page’s JSON-LD parses, uses the right types, and includes the properties engines rely on.',
    measures: ['JSON syntax errors', 'Required properties by type', 'Recommended properties by type', 'FAQ question and answer completeness'],
    steps: ['Enter a page URL', 'Fix syntax errors first', 'Add missing required properties', 'Re-run to confirm'],
    why: 'Broken JSON-LD is silently ignored. A single syntax error can hide your organization, product, or FAQ data from every engine.',
    faq: [
      { q: 'Does this replace Google’s Rich Results Test?', a: 'Use both. This tool focuses on entity clarity for AI search and checks many types quickly; Google’s test shows eligibility for specific Google features.' },
      { q: 'Are microdata and RDFa checked?', a: 'They are detected and counted. JSON-LD is the recommended format and is validated in detail.' },
      { q: 'Why are recommended properties flagged?', a: 'They are optional, but richer entities are easier for engines to match and describe accurately.' },
    ],
  },
  {
    slug: 'sitemap-validator',
    component: 'sitemap',
    category: 'Validators',
    name: 'XML sitemap validator',
    title: 'XML sitemap validator: check your sitemap for AI and search crawlers',
    description: 'Validate your XML sitemap: format, limits, duplicates, off-host and http URLs, lastmod dates, and a live spot-check of listed pages.',
    lede: 'Make sure crawlers can find your important pages: validate format and limits, and spot-check that listed URLs actually resolve.',
    measures: ['Sitemap and sitemap index format', '50,000 URL and 50 MB limits', 'Duplicates, off-host, and http URLs', 'lastmod coverage and a live spot-check'],
    steps: ['Enter your domain or sitemap URL', 'Fix errors, then warnings', 'Declare the sitemap in robots.txt', 'Re-run after publishing'],
    why: 'Sitemaps are how crawlers discover new and updated pages quickly. Broken or redirected entries waste crawl budget and delay updates in answers.',
    faq: [
      { q: 'Where should my sitemap live?', a: 'Usually at /sitemap.xml, declared with a "Sitemap:" line in robots.txt. Large sites use a sitemap index that lists several files.' },
      { q: 'Does lastmod matter?', a: 'Yes, when it is accurate. Crawlers use it to prioritize recrawls; do not set every entry to today’s date.' },
      { q: 'Should redirected URLs be listed?', a: 'No. List the final canonical URL of each page.' },
    ],
  },
];

export const TOOL_BY_SLUG = Object.fromEntries(TOOLS.map((t) => [t.slug, t])) as Record<string, ToolDef>;
export const TOOL_CATEGORIES: ToolCategory[] = ['Audit and analysis', 'Generators', 'Validators'];

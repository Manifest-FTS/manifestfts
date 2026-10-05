export interface Doc {
  slug: string;
  title: string;
  description: string;
  category: 'Getting started' | 'Measuring visibility' | 'Improving visibility' | 'Account and billing' | 'Reference';
  updated: string;
  body: string;
}

export const DOC_CATEGORIES: Doc['category'][] = ['Getting started', 'Measuring visibility', 'Improving visibility', 'Account and billing', 'Reference'];

export const docs: Doc[] = [
  {
    slug: 'getting-started',
    title: 'Getting started with Manifest Signal',
    description: 'Set up a workspace, choose the questions to track, and read your first visibility baseline in about ten minutes.',
    category: 'Getting started',
    updated: '2026-10-05',
    body: `
Manifest Signal shows how AI answer engines such as ChatGPT, Perplexity, Gemini, and Claude respond when people ask questions about your category, and whether those answers mention, recommend, or cite your organization. This guide walks through the first session.

## 1. Create a workspace

A workspace represents one brand or organization. During onboarding you enter the brand name, the primary domain, any alternate names people use (for example an abbreviation), and a one-sentence description. Signal uses the names to detect mentions and the domain to detect citations of your own pages.

## 2. Add competitors

Add up to the number of competitors your plan allows. Competitors are used to calculate share of voice and to show which organizations engines name when they do not name you. Choose organizations a buyer would realistically compare you with, not only the largest companies in your industry.

## 3. Choose prompts

Prompts are the questions Signal asks each engine. Onboarding suggests a starting set based on your category; edit them so they reflect how your customers actually phrase questions. A good starting set has 10 to 25 prompts spread across discovery ("best X for Y"), comparison ("X vs Y"), evaluation ("is X worth it"), and brand questions ("what is X"). See [Choosing and organizing prompts](/docs/tracking-prompts).

## 4. Read the baseline

New workspaces start with labeled **sample data** so you can explore every screen immediately. Sample answers are generated deterministically from your prompts and competitors; they are not observations of real engines and are never mixed into live metrics. When live engines are enabled for your workspace, switch the data source in **Settings → General** to begin collecting real observations. See [Answer engines and data sources](/docs/answer-engines).

## 5. Run a readiness audit

The readiness audit fetches your site the way an AI crawler would and checks crawler access in robots.txt, indexability, structured data, server-rendered content, and response time. Failing checks become tasks automatically. The same check is available without an account at [/tools/ai-readiness-checker](/tools/ai-readiness-checker).

## 6. Work the task list

Signal turns observations into prioritized tasks, and every task links to the evidence that created it: a failing check, a prompt where competitors appear and you do not, a source engines rely on, or a claim reviewed as inaccurate. Assign tasks, mark progress, and watch the related metrics over the following runs.
`,
  },
  {
    slug: 'tracking-prompts',
    title: 'Choosing and organizing prompts',
    description: 'How to build a prompt set that reflects real buyer questions, and how topics and intent labels shape your reporting.',
    category: 'Measuring visibility',
    updated: '2026-10-05',
    body: `
A prompt is a question Signal asks every enabled answer engine on each run. Your metrics are only as meaningful as the prompts behind them, so it is worth spending time on this step.

## Write prompts the way customers ask

Use the language customers use in sales calls, support tickets, and search queries. Prefer complete questions ("What is the best accounting software for a 20-person nonprofit?") over keyword fragments ("nonprofit accounting software"). Answer engines respond to intent and context; specific prompts produce answers that are easier to act on.

## Cover four intents

| Intent | Example | What it tells you |
| --- | --- | --- |
| Discovery | Best project management tools for agencies | Whether you are on the shortlist at all |
| Comparison | Acme vs Contoso for client reporting | How you are positioned against a named rival |
| Evaluation | Is Acme worth it for small teams? | How engines describe your strengths and drawbacks |
| Brand | What does Acme do? | Whether engines describe you accurately |

Brand prompts almost always mention you, so they inflate mention rate. Signal reports metrics by intent so you can separate "are we discovered" from "are we described correctly."

## Group prompts by topic

Topics are free-text labels such as "Pricing", "Integrations", or "Nonprofits". Use them to group prompts that map to a product line, audience, or content cluster. Topic filters apply to every chart and table.

## Keep the set stable

Changing prompts changes the denominator. When you add or remove prompts, trend lines reflect a different question set. Prefer pausing a prompt over deleting it; paused prompts keep their history but are skipped on new runs.

## How many prompts do you need?

Each prompt is asked once per engine per run. With 25 prompts and 4 engines, one run produces 100 answers, which supports a mention-rate estimate with a 95% interval of roughly ±10 percentage points. Precision improves as answers accumulate across runs. See [Metrics, denominators, and confidence intervals](/docs/metrics).
`,
  },
  {
    slug: 'answer-engines',
    title: 'Answer engines and data sources',
    description: 'Which engines Signal observes, how live observations are collected, and how sample data is labeled and kept separate.',
    category: 'Measuring visibility',
    updated: '2026-10-05',
    body: `
Signal records an **observation** each time it asks an engine a prompt: the full answer text, the sources the engine cited, the model identifier, and the time. Metrics are calculated from these stored observations, and you can open any answer to read it in full.

## Engines

| Engine | Vendor | Live collection |
| --- | --- | --- |
| ChatGPT | OpenAI | Responses API with web search |
| Perplexity | Perplexity AI | Sonar API with citations |
| Gemini | Google | Gemini API with Google Search grounding |
| Claude | Anthropic | Messages API with web search |
| AI Overviews | Google Search | Sample data only |
| Copilot | Microsoft | Sample data only |

Live collection uses each vendor's official API with web search enabled, which closely approximates, but is not identical to, what a signed-in consumer sees in the vendor's app. Consumer answers can vary by account, location, conversation history, and product experiments. Signal records the model identifier on every observation so changes in the underlying model are visible.

## Sample data

Every new workspace starts in sample mode. Sample answers are generated from your prompts, brand, and competitors so that charts, tables, and tasks have realistic structure. Sample data is labeled throughout the interface, is never presented as an observation of a real engine, and is excluded from live metrics. You can switch to live collection once your workspace has live engines available; sample data remains viewable until you clear it.

## Variability

Answer engines are not deterministic. The same prompt can produce different answers minutes apart. Signal treats each answer as one sample from a distribution and reports rates with confidence intervals rather than single-answer "rankings."
`,
  },
  {
    slug: 'metrics',
    title: 'Metrics, denominators, and confidence intervals',
    description: 'Definitions for every Signal metric, how each is calculated, and why every rate is shown with its sample size and a 95% interval.',
    category: 'Measuring visibility',
    updated: '2026-10-05',
    body: `
Every rate in Signal is shown with its denominator (n) and a 95% confidence interval. These are the definitions used throughout the product, in reports, and in exports.

## Mention rate

The share of answers that name your brand or one of its alternate names. **Denominator:** all answers in the selected period, engines, and topics. Mentions are matched on whole words, so "Acme" does not match "Acmeville."

## Citation rate

The share of answers that cite at least one URL on your domain or its subdomains. **Denominator:** all answers. A citation is stronger evidence of influence than a mention because the engine relied on your content.

## Share of voice

Your brand's mentions divided by all brand and competitor mentions. **Denominator:** total mentions of tracked organizations. Share of voice only covers the competitors you track, so adding a competitor changes it.

## First-position rate and average position

Position is the order in which tracked organizations are first named in an answer (1 = named first). First-position rate is the share of answers that mention you in which you are named first. **Denominator:** answers that mention you.

## Sentiment

A lexicon heuristic applied to the sentences that mention your brand, labeled positive, neutral, or negative. It is designed to surface answers worth reading, not to certify tone. Open the answer to read the full context.

## Accuracy

The share of reviewed claims about your brand marked accurate. Claims are sentences that mention your brand and contain a checkable statement such as a date, price, location, or capability. Claims that exactly restate a value on your fact sheet are confirmed automatically; everything else waits for review.

## Confidence intervals

Signal uses the Wilson score interval at 95% confidence. For 30 mentions in 100 answers, the mention rate is 30% with an interval of 21.9% to 39.6%, shown as "30% ±8.8 pts." When two periods' intervals overlap, Signal does not label the change as meaningful. Small samples produce wide intervals; that width is information, not a defect.

## What these metrics do not measure

Visibility in answers is not the same as traffic, conversions, or revenue, and an engine citing you does not mean a user clicked. Signal reports what was observed in answers. Connect outcomes in your analytics tools and compare timing rather than assuming causation.
`,
  },
  {
    slug: 'citations-and-sources',
    title: 'Citations and source analysis',
    description: 'How Signal collects the sources engines cite, and how to use source data to find the pages and third-party sites that shape answers.',
    category: 'Measuring visibility',
    updated: '2026-10-05',
    body: `
When an engine cites sources, Signal stores each URL with its domain and title. The **Sources** view aggregates these citations across answers so you can see which sites shape answers in your category.

## Reading the sources table

For each domain Signal shows how many answers cited it, the share of all answers, which engines cite it most, and whether it is your domain, a competitor's domain, or a third party. Third-party domains that appear often (review sites, directories, publications, community forums) are where engines learn about your category.

## Turning sources into work

- **Your own pages:** find which of your URLs are cited and which important pages never are. Strengthen pages that answer high-intent prompts directly.
- **Competitor pages:** read the cited competitor pages to understand the format and depth engines reward.
- **Third parties:** make sure your profiles and listings on frequently cited domains are accurate and complete. Signal opens an authority task when a third-party domain appears in a meaningful share of recent answers.

## Limitations

Engines differ in how they expose sources. Some cite inline, some list sources separately, and some return redirect links that hide the final URL. Signal normalizes what each API returns but cannot see sources an engine used without citing.
`,
  },
  {
    slug: 'accuracy-monitoring',
    title: 'Accuracy monitoring and the fact sheet',
    description: 'Record the facts that matter about your organization, review claims engines make, and turn inaccuracies into corrections.',
    category: 'Improving visibility',
    updated: '2026-10-05',
    body: `
Being mentioned is only useful if the description is right. Accuracy monitoring compares what engines say about you with facts you control.

## The fact sheet

In **Accuracy → Fact sheet**, record short label and value pairs: founding year, headquarters, pricing starting point, number of locations, certifications, supported integrations, and anything customers ask about. Keep values specific and current.

## Claims

After each run Signal extracts claims: sentences that mention your brand and contain a checkable statement. Each claim is matched to the most relevant fact. A claim that restates the fact's value is confirmed automatically. Other claims enter the review queue.

## Reviewing

For each claim choose **Accurate**, **Inaccurate**, **Outdated**, or **Unverifiable**, and optionally add a note. Reviewed-inaccurate claims create a high-priority accuracy task that links back to the answer, so the team can see exactly what was said, by which engine, and when.

## Correcting inaccuracies

Engines repeat what their sources say. Publish the correct information on an authoritative page on your site, describe it in structured data where appropriate, and update third-party profiles that may be the origin of the error. Then watch whether the claim reappears in later runs.
`,
  },
  {
    slug: 'readiness-checks',
    title: 'AI readiness checks explained',
    description: 'What each readiness check tests, which AI crawlers Signal evaluates in robots.txt, and how scores are calculated.',
    category: 'Improving visibility',
    updated: '2026-10-05',
    body: `
The readiness audit fetches a page from Signal's servers and evaluates whether answer engines can access, understand, and attribute it. It runs on demand in the app and in the free [AI readiness checker](/tools/ai-readiness-checker).

## Crawler access

Signal parses robots.txt according to RFC 9309 and evaluates each crawler against the audited path. Crawlers are split into two groups because they have different consequences.

| Crawler | Operator | Purpose | Group |
| --- | --- | --- | --- |
| OAI-SearchBot | OpenAI | ChatGPT search results and citations | Retrieval |
| ChatGPT-User | OpenAI | Pages fetched when a user asks | Retrieval |
| PerplexityBot | Perplexity | Perplexity answer index | Retrieval |
| Claude-SearchBot | Anthropic | Claude search results | Retrieval |
| Googlebot | Google | Google Search, including AI Overviews | Retrieval |
| Bingbot | Microsoft | Bing index, which grounds Copilot | Retrieval |
| GPTBot | OpenAI | Model training | Training |
| ClaudeBot | Anthropic | Model training | Training |
| Google-Extended | Google | Gemini training opt-out token | Training |
| Applebot-Extended | Apple | Apple Intelligence training opt-out token | Training |
| CCBot | Common Crawl | Open web corpus | Training |

Blocking a **retrieval** crawler removes the page from that engine's live answers and is reported as a failure. Blocking a **training** crawler is a legitimate policy choice and is reported for information only.

## Discovery, content, and schema

The audit also checks for a sitemap declared in robots.txt, an optional llms.txt file, noindex directives, a canonical URL, a descriptive title and meta description, a single H1, the amount of readable text present without JavaScript, Open Graph metadata, valid JSON-LD, and an Organization, Product, or SoftwareApplication entity.

## Scoring

Each check is pass (1), warning (0.5), or fail (0). Informational checks are not scored. The score is the average of scored checks, from 0 to 100. A high score means the page is technically accessible and well described; it does not guarantee that any engine will index, cite, or recommend it.

## Network and privacy

The audit fetches only public http and https URLs on standard ports, refuses private and reserved network addresses, follows at most four redirects, and reads at most 1.5 MB of HTML. Requests identify as ManifestSignalBot.
`,
  },
  {
    slug: 'tasks-and-reports',
    title: 'Tasks, evidence, and reports',
    description: 'How Signal creates evidence-linked tasks from observations and audits, and how to share period reports with stakeholders.',
    category: 'Improving visibility',
    updated: '2026-10-05',
    body: `
## Evidence-linked tasks

Signal creates tasks from four kinds of evidence:

- **Readiness checks** that fail or warn. When a later audit passes the check, the task closes automatically.
- **Prompt gaps**, where competitors are named but your brand is absent in most recent answers to a prompt.
- **Influential sources**, third-party domains cited in a meaningful share of recent answers.
- **Accuracy findings**, claims your team reviewed as inaccurate.

Each task records the evidence that created it and links back to it. You can also add tasks manually, set priority, assign an owner, and set a due date. Signal never creates the same automatic task twice.

## Reports

A report captures a period's metrics, engine breakdown, top sources, accuracy status, and completed tasks as a fixed snapshot, so numbers do not shift after you share them. Add an executive summary in your own words. Reports can be printed or saved as PDF from the browser, and owners and admins can create a private share link for stakeholders without accounts. Share links can be revoked at any time.
`,
  },
  {
    slug: 'team-and-permissions',
    title: 'Team members and roles',
    description: 'Invite teammates, assign roles, and understand what owners, admins, editors, and viewers can do.',
    category: 'Account and billing',
    updated: '2026-10-05',
    body: `
Invite teammates from **Settings → Members**. Invitations are sent by email and expire after seven days.

| Role | Can view data | Edit prompts, facts, tasks | Run audits and runs | Manage members | Billing and deletion |
| --- | --- | --- | --- | --- | --- |
| Viewer | Yes | No | No | No | No |
| Editor | Yes | Yes | Yes | No | No |
| Admin | Yes | Yes | Yes | Yes | No |
| Owner | Yes | Yes | Yes | Yes | Yes |

Each workspace has at least one owner. An owner can transfer ownership by promoting another member to owner. Workspace activity, including membership and settings changes, is recorded in **Settings → Activity**.
`,
  },
  {
    slug: 'billing-and-plans',
    title: 'Billing, trials, and plans',
    description: 'How the 14-day trial works, what each plan includes, and how to change or cancel a subscription.',
    category: 'Account and billing',
    updated: '2026-10-05',
    body: `
Every workspace starts with a 14-day trial with Growth plan limits. No payment card is required to start.

## Plans

Plans are billed per workspace each month. See [Pricing](/pricing) for current limits. Limits apply to tracked prompts, competitors, engines, run frequency, and seats.

## When a trial ends

If you do not choose a plan, the workspace becomes read-only: you can view and export everything, but new runs and audits pause. Choosing a plan restores full access immediately. Nothing is deleted.

## Changing or cancelling

Owners manage billing from **Settings → Billing**, which opens the Stripe customer portal for payment methods, invoices, plan changes, and cancellation. Cancellation takes effect at the end of the paid period.

## Payment security

Payments are processed by Stripe. Signal never receives or stores card numbers.
`,
  },
  {
    slug: 'data-and-security',
    title: 'Data handling and security',
    description: 'What data Signal stores, how accounts are protected, how to export or delete data, and which providers process it.',
    category: 'Account and billing',
    updated: '2026-10-05',
    body: `
Manifest FTS builds Signal around the same data-trust principles it applies to client work: collect what the product needs, be clear about where it goes, and make it easy to take out.

## What Signal stores

Account details (name, email, a salted scrypt password hash), workspace configuration (brand, domain, competitors, prompts, facts), observations (answer text, citations, analysis), audits, tasks, reports, and an activity log. Signal does not need and does not request access to your website, analytics, or ad accounts.

## Account protection

Sessions use random tokens stored in HTTP-only, secure cookies; only a hash of each token is kept server-side. Sign-in, password reset, and public tools are rate limited. You can review and sign out other sessions from **Account → Security**.

## Processors

Live observations send your prompts (not your account data) to the answer-engine APIs you enable. Email is delivered through Mailjet and payments through Stripe. Hosting and database providers are listed in the [privacy policy](/privacy).

## Export and deletion

Owners and admins can export a workspace as JSON from **Settings → General**. Owners can delete a workspace, which permanently removes its prompts, observations, audits, tasks, and reports. You can delete your account from **Account**; if you are the only owner of a workspace, transfer or delete it first.

## Reporting a vulnerability

Email security reports to signal@manifestfts.com. See the [security page](/security) for scope.
`,
  },
  {
    slug: 'glossary',
    title: 'AI search glossary',
    description: 'Plain-language definitions of the terms used in AI search visibility: answer engines, citations, share of voice, GEO, llms.txt, and more.',
    category: 'Reference',
    updated: '2026-10-05',
    body: `
## Answer engine

A system that responds to a question with a synthesized answer rather than a list of links, often citing sources. Examples include ChatGPT with search, Perplexity, Gemini, Claude with web search, Google AI Overviews, and Microsoft Copilot.

## Generative engine optimization (GEO)

The practice of improving how content is discovered, understood, cited, and represented by answer engines. Also called answer engine optimization (AEO) or AI search optimization. It overlaps heavily with technical SEO and with publishing clear, factual, well-structured content.

## Observation

One answer from one engine to one prompt at one time, stored with its text, citations, and model identifier.

## Mention

An answer names an organization. Signal matches whole words against the brand name and alternate names.

## Citation

An answer links to a source URL. A citation of your own domain indicates the engine relied on your content.

## Share of voice

Your mentions as a share of all mentions of tracked organizations in the same answers.

## Retrieval crawler

A crawler that fetches pages to answer or cite them in real time, such as OAI-SearchBot or PerplexityBot. Blocking one removes your pages from that engine's live answers.

## Training crawler

A crawler or opt-out token that governs whether content is used to train models, such as GPTBot or Google-Extended. Allowing or blocking training is a policy decision separate from live citation.

## llms.txt

A proposed convention: a Markdown file at /llms.txt that summarizes a site and links to its most useful pages for language models. It is optional and not a ranking factor in any published engine documentation.

## Structured data

Machine-readable descriptions of page content, usually JSON-LD using the schema.org vocabulary, that help systems identify entities such as organizations, products, and articles.

## Confidence interval

A range that expresses the uncertainty of a rate measured from a sample. Signal reports 95% Wilson score intervals.
`,
  },
];

export const DOC_BY_SLUG = Object.fromEntries(docs.map((d) => [d.slug, d]));

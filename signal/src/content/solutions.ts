export interface Solution {
  slug: string;
  name: string;
  title: string;
  description: string;
  lede: string;
  challenge: string;
  prompts: string[];
  how: { title: string; body: string }[];
  metrics: string[];
}

export const SOLUTIONS: Solution[] = [
  {
    slug: 'agencies',
    name: 'Agencies',
    title: 'AI search visibility reporting for agencies',
    description: 'Run AEO and GEO programs for multiple clients: one workspace per client, white-label reports, evidence-linked tasks, and measurement your clients can trust.',
    lede: 'Give every client a defensible answer to “what does AI say about us?” and a prioritized plan to change it, under your own brand.',
    challenge: 'Clients are asking about ChatGPT and AI Overviews, but most tooling reports single answers as rankings. That makes progress impossible to defend and easy to overstate.',
    prompts: ['Best marketing agency for B2B SaaS companies', 'Who are the top web design agencies in Chicago?', 'Is [client] a good choice for enterprise teams?'],
    how: [
      { title: 'One workspace per client', body: 'Separate prompts, competitors, facts, and billing for each client, with roles for your team and theirs.' },
      { title: 'White-label reports', body: 'Fixed-period snapshots with your logo and colors, shared by private link or printed to PDF.' },
      { title: 'Work you can bill', body: 'GEO audits and visibility gaps become evidence-linked tasks and content briefs your team can execute.' },
      { title: 'Results that hold up', body: 'Every rate carries its sample size and a 95% interval, so you report real change rather than noise.' },
    ],
    metrics: ['Share of voice against named competitors', 'Mention and citation rates by engine', 'Tasks completed per period', 'AI-referred landings after content ships'],
  },
  {
    slug: 'saas',
    name: 'SaaS companies',
    title: 'AI search visibility for SaaS: get recommended in ChatGPT and Perplexity',
    description: 'Track how ChatGPT, Perplexity, Gemini, and Claude compare your software with alternatives, fix inaccurate pricing and feature claims, and measure AI-referred signups.',
    lede: 'Buyers ask assistants for the best tool, the cheapest alternative, and how you compare. Know what they hear, and fix what is wrong.',
    challenge: 'Software buyers increasingly shortlist through answer engines. Outdated pricing pages, thin comparison content, and missing reviews quietly route them to competitors.',
    prompts: ['Best project management software for agencies', 'Asana vs [your product] for small teams', 'Cheapest alternative to HubSpot for startups'],
    how: [
      { title: 'Comparison coverage', body: 'See which “vs” and “alternatives” questions name competitors and not you, and which sources engines cite for them.' },
      { title: 'Accuracy on pricing and features', body: 'Keep a fact sheet of prices, plans, and integrations; review claims engines make and correct the sources.' },
      { title: 'Review-site presence', body: 'Spot when G2, Capterra, or Reddit threads drive answers, and strengthen your presence there.' },
      { title: 'Signups from AI', body: 'The AI traffic snippet shows which assistants send visitors and which pages convert them.' },
    ],
    metrics: ['Mention rate on discovery and comparison prompts', 'Accuracy of pricing and capability claims', 'Citation rate of your docs and comparison pages', 'AI-referred landings to pricing and signup'],
  },
  {
    slug: 'professional-services',
    name: 'Professional services',
    title: 'AI visibility for law firms, accountants, and consultancies',
    description: 'See whether AI assistants recommend your firm for the services and locations you serve, and fix the entity, review, and content gaps that keep you out of answers.',
    lede: 'When someone asks an assistant for a lawyer, accountant, or consultant near them, make sure your firm is named, described accurately, and cited.',
    challenge: 'Local and practice-area questions are answered from directories, reviews, and a few authoritative pages. Firms with inconsistent listings or thin practice pages rarely appear.',
    prompts: ['Best personal injury lawyer in Austin', 'Which accounting firms specialize in nonprofits?', 'How much does a business valuation cost?'],
    how: [
      { title: 'Practice and location prompts', body: 'Track questions by practice area and city, and see which firms engines name instead.' },
      { title: 'Entity and listing consistency', body: 'GEO audits check Organization and LocalBusiness markup; Sources shows which directories engines rely on.' },
      { title: 'Accurate credentials', body: 'Record bar admissions, certifications, locations, and fees as facts; review what engines claim.' },
      { title: 'Answer-ready practice pages', body: 'Content briefs outline pages that answer client questions directly, with the proof engines quote.' },
    ],
    metrics: ['Mention rate on practice-area and city prompts', 'Directory and review sources cited', 'Accuracy of credentials and fees', 'AI-referred consultations and contact-page landings'],
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    title: 'AI search visibility for healthcare providers and health tech',
    description: 'Monitor how answer engines describe your services, locations, and credentials, catch inaccurate health claims early, and keep content accurate and attributable.',
    lede: 'Patients ask assistants which clinic to choose and what treatments cost. Accuracy matters more here than anywhere else.',
    challenge: 'Health answers lean on authoritative sources and clear credentials. Outdated service lists, missing reviewer information, and inconsistent locations lead to wrong or missing answers.',
    prompts: ['Best telehealth providers for anxiety', 'Pediatric urgent care near Raleigh open on weekends', 'Does [clinic] accept Medicare?'],
    how: [
      { title: 'Accuracy monitoring first', body: 'Fact sheets for services, insurance, locations, and hours; every new claim is checked or queued for review.' },
      { title: 'E-E-A-T signals', body: 'GEO audits check reviewer, author, and date signals that health content needs to be trusted.' },
      { title: 'Location coverage', body: 'Track questions by city and service line to see where competitors are recommended instead.' },
      { title: 'Privacy by design', body: 'Signal stores no patient data. The traffic snippet is cookieless and records no personal information.' },
    ],
    metrics: ['Accuracy of service, insurance, and location claims', 'Mention rate by service line and city', 'E-E-A-T dimension of the GEO score', 'AI-referred appointment-page landings'],
  },
  {
    slug: 'ecommerce',
    name: 'Ecommerce',
    title: 'AI search visibility for ecommerce brands and retailers',
    description: 'Track whether shopping questions in ChatGPT, Perplexity, and Google AI Overviews recommend your products, and fix product data, reviews, and comparison gaps.',
    lede: 'Shoppers ask assistants for the best product for their need and budget. Get your products into those shortlists with accurate prices and specs.',
    challenge: 'Product recommendations come from structured product data, reviews, and roundup articles. Missing schema, stale prices, and absence from roundups keep products out of answers.',
    prompts: ['Best running shoes for flat feet under $150', 'Is [brand] good quality?', 'Best gifts for coffee lovers'],
    how: [
      { title: 'Product and offer schema', body: 'GEO audits and the validator check Product, Offer, and Review markup across key pages.' },
      { title: 'Roundup and review sources', body: 'See which review sites and roundups engines cite, and where your products are missing.' },
      { title: 'Price and spec accuracy', body: 'Record prices, materials, and sizes as facts and catch outdated claims.' },
      { title: 'Revenue signals', body: 'Measure AI-referred landings to product and collection pages alongside visibility.' },
    ],
    metrics: ['Mention rate on category and budget prompts', 'Citation of product pages', 'Accuracy of price and spec claims', 'AI-referred product-page landings'],
  },
  {
    slug: 'local-business',
    name: 'Local businesses',
    title: 'AI search visibility for local businesses',
    description: 'Find out whether AI assistants recommend your business for “near me” and city questions, and fix the listings, reviews, and pages that decide it.',
    lede: 'From plumbers to restaurants, assistants now answer “who should I call?” Make sure the answer can be you.',
    challenge: 'Local answers depend on consistent listings, reviews, and clear service-area pages. A single mismatched address or missing category can drop you from recommendations.',
    prompts: ['Best emergency plumber in Denver', 'Family-friendly restaurants near Lincoln Park', 'Who installs solar panels in Phoenix?'],
    how: [
      { title: 'City and service prompts', body: 'Track the exact questions customers ask, by service and neighborhood.' },
      { title: 'LocalBusiness markup', body: 'Generate and validate address, hours, and service-area schema.' },
      { title: 'Directory sources', body: 'See which directories and review sites engines cite for your area.' },
      { title: 'Calls and visits', body: 'Track AI-referred landings to contact and booking pages.' },
    ],
    metrics: ['Mention rate on local prompts', 'Listings and review sources cited', 'Accuracy of hours, address, and services', 'AI-referred contact-page landings'],
  },
];

export const SOLUTION_BY_SLUG = Object.fromEntries(SOLUTIONS.map((s) => [s.slug, s])) as Record<string, Solution>;

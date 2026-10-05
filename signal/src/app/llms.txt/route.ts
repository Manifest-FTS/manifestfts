import { docs } from '@/content/docs';
import { FEATURES } from '@/content/marketing';
import { PLANS } from '@/lib/plans';
import { site, absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const body = `# ${site.name}

> ${site.description}

${site.name} is a web application built by ${site.company} (${site.companyUrl}). It is used by marketing, communications, and SEO teams and by agencies to measure and improve how AI answer engines represent an organization. Every rate is reported with its sample size and a 95% Wilson confidence interval, sample data is labeled and kept separate from live observations, and every recommendation links to the evidence behind it.

## Product
- [Features](${absoluteUrl('/features')}): ${FEATURES.map((f) => f.title.toLowerCase()).join(', ')}.
- [Methodology](${absoluteUrl('/methodology')}): How answers are collected and how metrics and confidence intervals are calculated.
- [Pricing](${absoluteUrl('/pricing')}): ${PLANS.map((p) => `${p.name} $${p.price}/month (${p.prompts} prompts)`).join('; ')}. 14-day trial with Growth limits, no card required.
- [Free AI readiness checker](${absoluteUrl('/tools/ai-readiness-checker')}): Checks robots.txt access for eleven AI and search crawlers, indexability, metadata, structured data, and server-rendered content.

## Documentation
${docs.map((d) => `- [${d.title}](${absoluteUrl(`/docs/${d.slug}`)}): ${d.description}`).join('\n')}

## Company
- [About](${absoluteUrl('/about')})
- [Security](${absoluteUrl('/security')})
- [Contact](${absoluteUrl('/contact')})
- [Manifest FTS](${site.companyUrl})

## Optional
- [Full documentation as plain text](${absoluteUrl('/llms-full.txt')})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

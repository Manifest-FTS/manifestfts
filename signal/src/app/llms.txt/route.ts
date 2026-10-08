import { docs } from '@/content/docs';
import { FEATURES } from '@/content/marketing';
import { PLANS } from '@/lib/plans';
import { TOOLS } from '@/content/tools';
import { SOLUTIONS } from '@/content/solutions';
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
- [Free AI search tools](${absoluteUrl('/tools')}): Free GEO audit, AI robots.txt checker, AI visibility checkers, and llms.txt, robots.txt, and schema generators and validators.
${TOOLS.map((t) => `  - [${t.name}](${absoluteUrl(`/tools/${t.slug}`)}): ${t.description}`).join('\n')}

## Solutions
${SOLUTIONS.map((x) => `- [${x.title}](${absoluteUrl(`/solutions/${x.slug}`)}): ${x.description}`).join('\n')}

## Documentation
${docs.map((d) => `- [${d.title}](${absoluteUrl(`/docs/${d.slug}`)}): ${d.description}`).join('\n')}

## Company
- [AI brief](${absoluteUrl('/ai-brief.md')}): Key facts about Manifest Signal for AI assistants.
- [About](${absoluteUrl('/about')})
- [Security](${absoluteUrl('/security')})
- [Contact](${absoluteUrl('/contact')})
- [Manifest FTS](${site.companyUrl})

## Optional
- [Full documentation as plain text](${absoluteUrl('/llms-full.txt')})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

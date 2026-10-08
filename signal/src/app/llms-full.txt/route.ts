import { docs } from '@/content/docs';
import { FAQS } from '@/content/marketing';
import { plainText } from '@/lib/markdown';
import { site, absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const sections = docs.map((d) => `# ${d.title}\n\nSource: ${absoluteUrl(`/docs/${d.slug}`)}\nUpdated: ${d.updated}\n\n${d.description}\n\n${plainText(d.body.trim())}`);
  const faq = FAQS.map((f) => `## ${f.q}\n\n${f.a}`).join('\n\n');
  const body = `# ${site.name} — complete documentation\n\n> ${site.description}\n\n# Frequently asked questions\n\n${faq}\n\n${sections.join('\n\n---\n\n')}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

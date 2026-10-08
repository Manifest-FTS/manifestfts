import type { AuditSubscores } from '@/lib/db/schema';
import type { JsonLdNode, PageLink } from './html';

export interface PageSignals {
  https: boolean;
  status: number;
  ms: number;
  noindex: boolean;
  textLength: number;
  title: string | null;
  description: string | null;
  h1Count: number;
  canonical: string | null;
  ogTitle: string | null;
  ogImage: string | null;
  siteName: string | null;
  lang: string | null;
  viewport: boolean;
  sitemap: boolean;
  llms: boolean;
  nodes: JsonLdNode[];
  invalidJsonLd: number;
  links: PageLink[];
  externalCitations: number;
  authorMeta: boolean;
  timeTag: boolean;
}

/** Composite weights. Citability and crawler access matter most for being quoted at all. */
export const WEIGHTS: Record<keyof AuditSubscores, number> = { citability: 0.25, crawlers: 0.2, schema: 0.15, eeat: 0.15, platform: 0.15, brand: 0.1 };

export function composite(s: AuditSubscores) {
  return Math.round((Object.keys(WEIGHTS) as (keyof AuditSubscores)[]).reduce((sum, k) => sum + s[k] * WEIGHTS[k], 0));
}

const ENTITY = new Set(['Organization', 'Corporation', 'LocalBusiness', 'ProfessionalService', 'LegalService', 'MedicalBusiness', 'SoftwareApplication', 'Product', 'Brand', 'NGO', 'EducationalOrganization', 'Store', 'Restaurant']);
const CONTENT = new Set(['Article', 'BlogPosting', 'NewsArticle', 'FAQPage', 'HowTo', 'Product', 'Service', 'LocalBusiness', 'BreadcrumbList', 'QAPage', 'Review', 'Course', 'Event', 'Recipe', 'VideoObject']);

const has = (links: PageLink[], re: RegExp) => links.some((l) => l.internal && (re.test(l.text) || re.test(new URL(l.href).pathname)));
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function scoreSchema(s: PageSignals) {
  const types = new Set(s.nodes.map((n) => n.type));
  const entity = s.nodes.find((n) => ENTITY.has(n.type));
  const sameAs = entity && Array.isArray(entity.props.sameAs) ? (entity.props.sameAs as unknown[]).length : 0;
  return clamp(
    (types.size ? 25 : 0) +
    (entity ? 25 : 0) +
    (types.has('WebSite') ? 10 : 0) +
    Math.min([...types].filter((t) => CONTENT.has(t)).length, 3) * 10 +
    (sameAs >= 2 ? 10 : sameAs ? 5 : 0) -
    s.invalidJsonLd * 15,
  );
}

export function scoreBrand(s: PageSignals) {
  const entity = s.nodes.find((n) => ENTITY.has(n.type));
  const name = (entity?.props.name as string | undefined) ?? s.siteName ?? '';
  const sameAs = entity && Array.isArray(entity.props.sameAs) ? (entity.props.sameAs as unknown[]).length : 0;
  const social = s.links.some((l) => !l.internal && /(linkedin\.com|x\.com|twitter\.com|facebook\.com|instagram\.com|youtube\.com|github\.com|crunchbase\.com)/i.test(l.href));
  return clamp(
    (entity ? 30 : 0) +
    (entity?.props.logo ? 10 : 0) +
    (sameAs >= 2 ? 15 : sameAs ? 8 : 0) +
    (s.siteName ? 10 : 0) +
    (name && s.title?.toLowerCase().includes(name.toLowerCase()) ? 10 : 0) +
    (has(s.links, /about/i) ? 10 : 0) +
    (has(s.links, /contact/i) ? 5 : 0) +
    (social ? 10 : 0),
  );
}

export function scoreEeat(s: PageSignals) {
  const author = s.authorMeta || s.nodes.some((n) => n.type === 'Person' || 'author' in n.props);
  const dates = s.timeTag || s.nodes.some((n) => 'dateModified' in n.props || 'datePublished' in n.props);
  return clamp(
    (author ? 20 : 0) +
    (dates ? 20 : 0) +
    (has(s.links, /about/i) ? 10 : 0) +
    (has(s.links, /contact/i) ? 10 : 0) +
    (has(s.links, /privacy/i) ? 10 : 0) +
    (s.externalCitations >= 2 ? 15 : s.externalCitations ? 8 : 0) +
    (s.https ? 15 : 0),
  );
}

export function scorePlatform(s: PageSignals) {
  return clamp(
    (s.status < 400 && !s.noindex ? 15 : 0) +
    (s.ms < 1500 ? 15 : s.ms < 4000 ? 8 : 0) +
    (s.textLength > 1200 ? 15 : s.textLength > 300 ? 7 : 0) +
    (s.canonical ? 10 : 0) +
    (s.title ? 10 : 0) +
    (s.description ? 10 : 0) +
    (s.ogTitle && s.ogImage ? 5 : 0) +
    (s.lang ? 5 : 0) +
    (s.viewport ? 5 : 0) +
    (s.sitemap ? 5 : 0) +
    (s.llms ? 5 : 0),
  );
}

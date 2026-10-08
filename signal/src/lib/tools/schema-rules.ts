// Required and recommended properties for common schema.org types, following Google's
// structured data documentation and schema.org definitions. Used by the validator.

export interface TypeRule { required: string[]; recommended: string[]; note?: string }

export const RULES: Record<string, TypeRule> = {
  Organization: { required: ['name', 'url'], recommended: ['logo', 'sameAs', 'description', 'contactPoint', 'address'] },
  Corporation: { required: ['name', 'url'], recommended: ['logo', 'sameAs', 'description'] },
  LocalBusiness: { required: ['name', 'address'], recommended: ['telephone', 'url', 'openingHoursSpecification', 'geo', 'priceRange', 'image'] },
  ProfessionalService: { required: ['name', 'address'], recommended: ['telephone', 'url', 'areaServed', 'image'] },
  LegalService: { required: ['name', 'address'], recommended: ['telephone', 'url', 'areaServed'] },
  WebSite: { required: ['name', 'url'], recommended: ['potentialAction', 'publisher'] },
  WebPage: { required: ['name'], recommended: ['description', 'url', 'dateModified'] },
  Article: { required: ['headline'], recommended: ['author', 'datePublished', 'dateModified', 'image', 'publisher'] },
  BlogPosting: { required: ['headline'], recommended: ['author', 'datePublished', 'dateModified', 'image', 'publisher'] },
  NewsArticle: { required: ['headline'], recommended: ['author', 'datePublished', 'dateModified', 'image', 'publisher'] },
  FAQPage: { required: ['mainEntity'], recommended: [], note: 'Each Question needs name and acceptedAnswer.text.' },
  Question: { required: ['name', 'acceptedAnswer'], recommended: [] },
  HowTo: { required: ['name', 'step'], recommended: ['totalTime', 'supply', 'tool', 'image'] },
  Product: { required: ['name'], recommended: ['image', 'description', 'brand', 'offers', 'aggregateRating', 'review', 'sku'] },
  Offer: { required: ['price', 'priceCurrency'], recommended: ['availability', 'url', 'priceValidUntil'] },
  SoftwareApplication: { required: ['name'], recommended: ['offers', 'applicationCategory', 'operatingSystem', 'aggregateRating'] },
  Service: { required: ['name'], recommended: ['provider', 'areaServed', 'description', 'serviceType', 'offers'] },
  BreadcrumbList: { required: ['itemListElement'], recommended: [] },
  Person: { required: ['name'], recommended: ['url', 'jobTitle', 'sameAs', 'worksFor'] },
  Event: { required: ['name', 'startDate', 'location'], recommended: ['endDate', 'image', 'description', 'offers', 'organizer'] },
  Review: { required: ['author', 'reviewRating'], recommended: ['itemReviewed', 'datePublished'] },
  VideoObject: { required: ['name', 'thumbnailUrl', 'uploadDate'], recommended: ['description', 'duration', 'contentUrl'] },
  Course: { required: ['name', 'description'], recommended: ['provider', 'offers'] },
  Recipe: { required: ['name', 'image'], recommended: ['recipeIngredient', 'recipeInstructions', 'totalTime', 'author'] },
};

const present = (v: unknown) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0);

export interface NodeReport { type: string; name: string | null; errors: string[]; warnings: string[] }

export function validateNode(type: string, props: Record<string, unknown>): NodeReport {
  const rule = RULES[type];
  const errors: string[] = [];
  const warnings: string[] = [];
  if (rule) {
    for (const key of rule.required) if (!present(props[key])) errors.push(`Missing required property “${key}”.`);
    for (const key of rule.recommended) if (!present(props[key])) warnings.push(`Consider adding “${key}”.`);
  }
  if (type === 'FAQPage' && Array.isArray(props.mainEntity)) {
    (props.mainEntity as Record<string, unknown>[]).forEach((q, i) => {
      const answer = q?.acceptedAnswer as Record<string, unknown> | undefined;
      if (!q?.name) errors.push(`Question ${i + 1} is missing “name”.`);
      if (!answer?.text) errors.push(`Question ${i + 1} is missing “acceptedAnswer.text”.`);
    });
  }
  for (const key of ['url', 'logo', 'image']) {
    const v = props[key];
    if (typeof v === 'string' && v && !/^https?:\/\//i.test(v)) warnings.push(`“${key}” should be an absolute URL.`);
  }
  const name = typeof props.name === 'string' ? props.name : typeof props.headline === 'string' ? props.headline : null;
  return { type, name, errors, warnings };
}

'use client';
import { Suspense } from 'react';
import type { ToolComponent } from '@/content/tools';
import type { EngineId } from '@/lib/db/schema';
import { ReadinessChecker } from '@/components/readiness/checker';
import { PromptGenerator } from './prompt-generator';
import { RobotsGenerator } from './robots-generator';
import { SchemaGenerator } from './schema-generator';
import { LlmsTxtGenerator, SitemapValidator, StructuredDataValidator, VisibilityChecker } from './api-tools';

/** Maps a registry entry to its interactive tool. */
export function ToolRenderer({ component, engine, embed = false }: { component: ToolComponent; engine?: EngineId; embed?: boolean }) {
  switch (component) {
    case 'geo-audit':
      return <Suspense fallback={<div className="skeleton h-[68px] rounded-2xl" />}><ReadinessChecker embed={embed} /></Suspense>;
    case 'robots-checker':
      return <Suspense fallback={<div className="skeleton h-[68px] rounded-2xl" />}><ReadinessChecker embed={embed} focus="crawlers" /></Suspense>;
    case 'prompt-generator':
      return <PromptGenerator embed={embed} />;
    case 'robots-generator':
      return <RobotsGenerator />;
    case 'schema-generator':
      return <SchemaGenerator />;
    case 'llms-txt':
      return <LlmsTxtGenerator />;
    case 'structured-data':
      return <StructuredDataValidator />;
    case 'sitemap':
      return <SitemapValidator />;
    case 'visibility':
      return <VisibilityChecker engine={engine} />;
  }
}

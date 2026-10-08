import { z } from 'zod';
import { toolRoute } from '@/lib/tools/route';
import { validateSitemap } from '@/lib/tools/analyze';

export const maxDuration = 60;
export const POST = toolRoute('sitemap', z.object({ url: z.string().trim().min(3, 'Enter a site or sitemap address.').max(2048) }), 20, ({ url }) => validateSitemap(url));

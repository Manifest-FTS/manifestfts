import { z } from 'zod';
import { toolRoute } from '@/lib/tools/route';
import { draftLlmsTxt } from '@/lib/tools/analyze';

export const maxDuration = 60;
export const POST = toolRoute('llms-txt', z.object({ url: z.string().trim().min(3, 'Enter your website address.').max(2048) }), 15, ({ url }) => draftLlmsTxt(url));

import { z } from 'zod';
import { toolRoute } from '@/lib/tools/route';
import { validateStructuredData } from '@/lib/tools/analyze';

export const POST = toolRoute('structured-data', z.object({ url: z.string().trim().min(3, 'Enter a page address.').max(2048) }), 30, ({ url }) => validateStructuredData(url));

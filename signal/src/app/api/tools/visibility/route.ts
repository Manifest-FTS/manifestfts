import { NextResponse } from 'next/server';
import { z } from 'zod';
import { toolRoute } from '@/lib/tools/route';
import { checkVisibility, visibilityAvailability } from '@/lib/tools/visibility';
import { ENGINES } from '@/lib/engines';
import type { EngineId } from '@/lib/db/schema';

export const maxDuration = 120;

const engineIds = ENGINES.map((e) => e.id) as [EngineId, ...EngineId[]];
const schema = z.object({
  brand: z.string().trim().min(2, 'Enter your brand name.').max(80),
  domain: z.string().trim().min(3, 'Enter your domain.').max(200),
  question: z.string().trim().min(8, 'Write the question a buyer would ask.').max(300),
  engines: z.array(z.enum(engineIds)).min(1, 'Choose at least one engine.'),
});

// Live engine calls cost money, so this tool has the tightest limit.
export const POST = toolRoute('visibility', schema, 5, checkVisibility);

export function GET() {
  return NextResponse.json({ configured: visibilityAvailability() });
}

'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { schema } from '@/lib/db';
import { authorize, isReadOnly, logActivity } from '@/lib/workspace';
import { buildBrief } from '@/lib/content-brief';
import { draftFromBrief, draftingAvailable } from '@/lib/providers/drafting';
import { rateLimit } from '@/lib/rate-limit';
import { newId } from '@/lib/utils';
import type { ActionState } from './workspace';

export async function createBrief(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z.object({ workspaceId: z.string(), promptId: z.string().optional(), question: z.string().trim().max(300).optional() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: 'Choose a prompt or write a question.' };
  const auth = await authorize(parsed.data.workspaceId, 'editor');
  if (!auth.ok) return { error: auth.error };
  if (isReadOnly(auth.workspace)) return { error: 'This workspace is read-only.' };
  let question = parsed.data.question?.trim() ?? '';
  let promptId: string | null = null;
  if (parsed.data.promptId) {
    const [p] = await auth.db.select().from(schema.prompts).where(and(eq(schema.prompts.id, parsed.data.promptId), eq(schema.prompts.workspaceId, auth.workspace.id)));
    if (!p) return { error: 'That prompt no longer exists.' };
    question = p.text;
    promptId = p.id;
  }
  if (question.length < 8) return { fieldErrors: { question: ['Write the full question (8+ characters).'] } };
  const { title, brief } = await buildBrief(auth.workspace, { promptId, question });
  const id = newId('brf');
  await auth.db.insert(schema.contentBriefs).values({ id, workspaceId: auth.workspace.id, promptId, title, question, brief, createdById: auth.user.id });
  await logActivity(auth.workspace.id, auth.user.id, 'content.brief_created', title);
  redirect(`/app/${auth.workspace.slug}/content/${id}`);
}

export async function draftBrief(workspaceId: string, briefId: string): Promise<ActionState> {
  const auth = await authorize(workspaceId, 'editor');
  if (!auth.ok) return { error: auth.error };
  if (!draftingAvailable()) return { error: 'AI drafting is not enabled for this deployment. Write or paste your draft instead.' };
  if (auth.workspace.plan === 'starter') return { error: 'AI-drafted pages are available on Growth and Agency plans.' };
  if (!(await rateLimit(`draft:${workspaceId}`, 20, 86400)).ok) return { error: 'Daily drafting limit reached for this workspace.' };
  const [brief] = await auth.db.select().from(schema.contentBriefs).where(and(eq(schema.contentBriefs.id, briefId), eq(schema.contentBriefs.workspaceId, workspaceId)));
  if (!brief) return { error: 'Brief not found.' };
  try {
    const { text, model } = await draftFromBrief({ brandName: auth.workspace.brandName, domain: auth.workspace.domain, question: brief.question, brief: brief.brief });
    await auth.db.update(schema.contentBriefs).set({ draft: text, draftModel: model, status: 'in_review', updatedAt: new Date() }).where(eq(schema.contentBriefs.id, briefId));
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Drafting failed. Please try again.' };
  }
  revalidatePath(`/app/${auth.workspace.slug}/content/${briefId}`);
  return { ok: true, message: 'Draft ready. Review every [VERIFY] placeholder before publishing.' };
}

const updateSchema = z.object({
  workspaceId: z.string(), briefId: z.string(),
  status: z.enum(['brief', 'drafting', 'in_review', 'published']),
  draft: z.string().max(60_000).optional(),
  publishedUrl: z.string().trim().max(2048).optional().refine((u) => !u || /^https?:\/\//.test(u), 'Enter a full URL starting with https://'),
});

export async function updateBrief(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  const auth = await authorize(parsed.data.workspaceId, 'editor');
  if (!auth.ok) return { error: auth.error };
  const { workspaceId, briefId, ...values } = parsed.data;
  await auth.db.update(schema.contentBriefs).set({ ...values, publishedUrl: values.publishedUrl || null, updatedAt: new Date() })
    .where(and(eq(schema.contentBriefs.id, briefId), eq(schema.contentBriefs.workspaceId, workspaceId)));
  if (values.status === 'published') await logActivity(workspaceId, auth.user.id, 'content.published', values.publishedUrl ?? briefId);
  revalidatePath(`/app/${auth.workspace.slug}/content`, 'layout');
  return { ok: true, message: 'Saved.' };
}

export async function deleteBrief(workspaceId: string, briefId: string): Promise<ActionState> {
  const auth = await authorize(workspaceId, 'editor');
  if (!auth.ok) return { error: auth.error };
  await auth.db.delete(schema.contentBriefs).where(and(eq(schema.contentBriefs.id, briefId), eq(schema.contentBriefs.workspaceId, workspaceId)));
  revalidatePath(`/app/${auth.workspace.slug}/content`);
  return { ok: true, message: 'Brief deleted.' };
}

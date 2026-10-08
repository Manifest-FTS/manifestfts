'use server';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { randomBytes } from 'node:crypto';
import { schema } from '@/lib/db';
import { authorize, logActivity } from '@/lib/workspace';
import { dispatchEvent, submitIndexNow, verifyIndexNowKey } from '@/lib/integrations';
import { randomToken } from '@/lib/auth/tokens';
import { assertSafeUrl } from '@/lib/readiness/safe-fetch';
import { safeFetch } from '@/lib/readiness/safe-fetch';
import { rateLimit } from '@/lib/rate-limit';
import { limitsFor } from '@/lib/plans';
import type { ActionState } from './workspace';

const refresh = (slug: string) => revalidatePath(`/app/${slug}/settings`, 'layout');

function validHttps(url: string) {
  try {
    const u = assertSafeUrl(url);
    return u.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function saveDestinations(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z.object({ workspaceId: z.string(), slackWebhookUrl: z.string().trim().max(500), webhookUrl: z.string().trim().max(500) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: 'Invalid input.' };
  const auth = await authorize(parsed.data.workspaceId, 'admin');
  if (!auth.ok) return { error: auth.error };
  const { slackWebhookUrl, webhookUrl } = parsed.data;
  const fieldErrors: Record<string, string[]> = {};
  if (slackWebhookUrl && !/^https:\/\/hooks\.slack\.com\/services\//.test(slackWebhookUrl)) fieldErrors.slackWebhookUrl = ['Use a Slack incoming webhook URL (https://hooks.slack.com/services/…).'];
  if (webhookUrl && !validHttps(webhookUrl)) fieldErrors.webhookUrl = ['Use a public https URL.'];
  if (Object.keys(fieldErrors).length) return { fieldErrors };
  await auth.db.update(schema.workspaces).set({
    slackWebhookUrl: slackWebhookUrl || null,
    webhookUrl: webhookUrl || null,
    webhookSecret: webhookUrl ? auth.workspace.webhookSecret ?? `whsec_${randomToken(24)}` : null,
  }).where(eq(schema.workspaces.id, auth.workspace.id));
  await logActivity(auth.workspace.id, auth.user.id, 'integrations.updated', 'Updated notification destinations');
  refresh(auth.workspace.slug);
  return { ok: true, message: 'Destinations saved.' };
}

export async function sendTestEvent(workspaceId: string): Promise<ActionState> {
  const auth = await authorize(workspaceId, 'admin');
  if (!auth.ok) return { error: auth.error };
  if (!(await rateLimit(`test-event:${workspaceId}`, 10, 3600)).ok) return { error: 'Test limit reached. Try again later.' };
  const r = await dispatchEvent(auth.workspace, 'test', { title: 'Test notification from Manifest Signal', text: 'Your integration is connected. Run, audit, and accuracy events will arrive here.' });
  const parts = [r.slack !== null && `Slack: ${r.slack && r.slack < 300 ? 'delivered' : `failed${r.slack ? ` (HTTP ${r.slack})` : ''}`}`, r.webhook !== null && `Webhook: ${r.webhook && r.webhook < 300 ? 'delivered' : `failed${r.webhook ? ` (HTTP ${r.webhook})` : ''}`}`].filter(Boolean);
  if (!parts.length) return { error: 'Add a Slack or webhook destination first.' };
  const failed = parts.some((p) => String(p).includes('failed'));
  return failed ? { error: parts.join(' · ') } : { ok: true, message: parts.join(' · ') };
}

export async function rotateWebhookSecret(workspaceId: string): Promise<ActionState> {
  const auth = await authorize(workspaceId, 'admin');
  if (!auth.ok) return { error: auth.error };
  await auth.db.update(schema.workspaces).set({ webhookSecret: `whsec_${randomToken(24)}` }).where(eq(schema.workspaces.id, workspaceId));
  refresh(auth.workspace.slug);
  return { ok: true, message: 'Signing secret rotated. Update your receiver.' };
}

export async function createIndexNowKey(workspaceId: string): Promise<ActionState> {
  const auth = await authorize(workspaceId, 'admin');
  if (!auth.ok) return { error: auth.error };
  await auth.db.update(schema.workspaces).set({ indexnowKey: randomBytes(16).toString('hex') }).where(eq(schema.workspaces.id, workspaceId));
  refresh(auth.workspace.slug);
  return { ok: true, message: 'Key created. Publish the key file, then verify.' };
}

export async function checkIndexNowKey(workspaceId: string): Promise<ActionState> {
  const auth = await authorize(workspaceId, 'admin');
  if (!auth.ok) return { error: auth.error };
  const r = await verifyIndexNowKey(auth.workspace);
  return r.ok ? { ok: true, message: r.message } : { error: r.message };
}

export async function submitToIndexNow(_: ActionState, formData: FormData): Promise<ActionState> {
  const workspaceId = String(formData.get('workspaceId'));
  const auth = await authorize(workspaceId, 'editor');
  if (!auth.ok) return { error: auth.error };
  if (!(await rateLimit(`indexnow:${workspaceId}`, 20, 86400)).ok) return { error: 'Daily IndexNow submission limit reached.' };
  let urls = String(formData.get('urls') ?? '').split(/\s+/).map((u) => u.trim()).filter(Boolean);
  if (formData.get('mode') === 'sitemap') {
    try {
      const res = await safeFetch(`https://${auth.workspace.domain}/sitemap.xml`, { accept: 'application/xml,text/xml', maxBytes: 5_000_000 });
      urls = [...res.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1]!).filter((u) => !u.endsWith('.xml'));
    } catch {
      return { error: `Could not read https://${auth.workspace.domain}/sitemap.xml.` };
    }
  }
  if (!urls.length) return { fieldErrors: { urls: ['Add at least one URL.'] } };
  const r = await submitIndexNow(auth.workspace, urls);
  await logActivity(workspaceId, auth.user.id, 'indexnow.submitted', `${r.submitted} URL(s)`);
  return r.ok ? { ok: true, message: `${r.submitted} URL(s): ${r.message}` } : { error: r.message };
}

const brandingSchema = z.object({
  workspaceId: z.string(),
  reportBrandName: z.string().trim().max(80),
  reportAccentColor: z.string().trim().regex(/^(#[0-9a-fA-F]{6})?$/, 'Use a hex color like #1d4ed8.'),
  reportLogoUrl: z.string().trim().max(500).refine((u) => !u || /^https:\/\//.test(u), 'Use an https image URL.'),
  hideSignalBranding: z.string().optional(),
});

export async function saveBranding(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = brandingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  const auth = await authorize(parsed.data.workspaceId, 'admin');
  if (!auth.ok) return { error: auth.error };
  if (limitsFor(auth.workspace.plan).id !== 'agency' && auth.workspace.plan !== 'trial') return { error: 'White-label reports are available on the Agency plan.' };
  await auth.db.update(schema.workspaces).set({
    reportBrandName: parsed.data.reportBrandName || null,
    reportAccentColor: parsed.data.reportAccentColor || null,
    reportLogoUrl: parsed.data.reportLogoUrl || null,
    hideSignalBranding: parsed.data.hideSignalBranding === 'on',
  }).where(eq(schema.workspaces.id, auth.workspace.id));
  refresh(auth.workspace.slug);
  return { ok: true, message: 'Report branding saved.' };
}

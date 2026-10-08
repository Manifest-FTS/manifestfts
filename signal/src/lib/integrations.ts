import 'server-only';
import { createHmac } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import type { Workspace } from '@/lib/db/schema';
import { safeFetch, safePostJson } from '@/lib/readiness/safe-fetch';
import { absoluteUrl } from '@/lib/site';

export type SignalEvent = 'run.completed' | 'run.failed' | 'audit.completed' | 'accuracy.inaccurate' | 'test';

export interface EventPayload {
  title: string;
  text: string;
  path?: string;
  data?: Record<string, unknown>;
}

export function signPayload(secret: string, body: string) {
  return `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;
}

/** Sends an event to the workspace's Slack and webhook destinations. Never throws. */
export async function dispatchEvent(workspaceOrId: Workspace | string, event: SignalEvent, payload: EventPayload) {
  let workspace = typeof workspaceOrId === 'string' ? null : workspaceOrId;
  if (!workspace) {
    const db = await getDb();
    [workspace] = await db.select().from(schema.workspaces).where(eq(schema.workspaces.id, workspaceOrId as string));
  }
  if (!workspace || (!workspace.slackWebhookUrl && !workspace.webhookUrl)) return { slack: null, webhook: null };
  const link = payload.path ? absoluteUrl(payload.path) : absoluteUrl(`/app/${workspace.slug}/overview`);
  const results: { slack: number | null; webhook: number | null } = { slack: null, webhook: null };

  if (workspace.slackWebhookUrl) {
    try {
      const r = await safePostJson(workspace.slackWebhookUrl, {
        text: `${payload.title} · ${workspace.name}`,
        blocks: [
          { type: 'section', text: { type: 'mrkdwn', text: `*${payload.title}*\n${payload.text}` } },
          { type: 'context', elements: [{ type: 'mrkdwn', text: `${workspace.name} · <${link}|Open in Manifest Signal>` }] },
        ],
      });
      results.slack = r.status;
    } catch {
      results.slack = 0;
    }
  }
  if (workspace.webhookUrl && workspace.webhookSecret) {
    const body = JSON.stringify({ event, sentAt: new Date().toISOString(), workspace: { id: workspace.id, slug: workspace.slug, name: workspace.name }, title: payload.title, text: payload.text, url: link, data: payload.data ?? {} });
    try {
      const r = await safePostJson(workspace.webhookUrl, body, { 'x-signal-event': event, 'x-signal-signature': signPayload(workspace.webhookSecret, body) });
      results.webhook = r.status;
    } catch {
      results.webhook = 0;
    }
  }
  return results;
}

/* IndexNow */

export function indexNowKeyLocation(workspace: Workspace) {
  return workspace.indexnowKey ? `https://${workspace.domain}/${workspace.indexnowKey}.txt` : null;
}

export async function verifyIndexNowKey(workspace: Workspace) {
  const location = indexNowKeyLocation(workspace);
  if (!location) return { ok: false, message: 'Generate a key first.' };
  try {
    const res = await safeFetch(location, { accept: 'text/plain', maxBytes: 10_000 });
    if (res.status !== 200) return { ok: false, message: `${location} returned HTTP ${res.status}.` };
    return res.body.trim() === workspace.indexnowKey ? { ok: true, message: 'Key file found and valid.' } : { ok: false, message: 'The key file exists but its contents do not match the key.' };
  } catch {
    return { ok: false, message: `Could not reach ${location}.` };
  }
}

const INDEXNOW_STATUS: Record<number, string> = {
  200: 'Submitted. Participating engines (Bing, Yandex, Naver, Seznam, and others) were notified.',
  202: 'Accepted. The key is being validated; submissions are queued.',
  400: 'Bad request: check the URLs.',
  403: 'Key not valid: make sure the key file is published and matches.',
  422: 'Some URLs do not belong to this host or the key location.',
  429: 'Too many requests. Try again later.',
};

export async function submitIndexNow(workspace: Workspace, urls: string[]) {
  const location = indexNowKeyLocation(workspace);
  if (!location || !workspace.indexnowKey) return { ok: false, message: 'Generate and publish a key first.', submitted: 0 };
  const host = workspace.domain;
  const valid = [...new Set(urls)].filter((u) => {
    try {
      const h = new URL(u).hostname.replace(/^www\./, '');
      return h === host || h.endsWith(`.${host}`);
    } catch {
      return false;
    }
  }).slice(0, 10_000);
  if (!valid.length) return { ok: false, message: `No URLs on ${host} to submit.`, submitted: 0 };
  // IndexNow requires one host per request; group by exact hostname.
  const byHost = new Map<string, string[]>();
  for (const u of valid) {
    const h = new URL(u).hostname;
    byHost.set(h, [...(byHost.get(h) ?? []), u]);
  }
  let last = 0;
  for (const [h, list] of byHost) {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: h, key: workspace.indexnowKey, keyLocation: location, urlList: list }),
      signal: AbortSignal.timeout(15_000),
    });
    last = res.status;
    if (res.status >= 300) break;
  }
  return { ok: last === 200 || last === 202, message: INDEXNOW_STATUS[last] ?? `IndexNow responded with HTTP ${last}.`, submitted: valid.length };
}

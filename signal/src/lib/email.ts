import 'server-only';
import { site, absoluteUrl } from '@/lib/site';

interface Message {
  to: string;
  subject: string;
  /** Short paragraphs of plain text. Rendered into both the text and HTML parts. */
  paragraphs: string[];
  action?: { label: string; url: string };
  footnote?: string;
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function renderEmail(message: Message) {
  const text = [
    ...message.paragraphs,
    ...(message.action ? [`${message.action.label}: ${message.action.url}`] : []),
    ...(message.footnote ? ['', message.footnote] : []),
    '',
    `— ${site.name}, a product by ${site.company}`,
  ].join('\n\n');

  const button = message.action
    ? `<p style="margin:28px 0"><a href="${escapeHtml(message.action.url)}" style="display:inline-block;background:#4353c7;color:#fff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:8px">${escapeHtml(message.action.label)}</a></p>
       <p style="margin:0 0 16px;color:#667085;font-size:13px">Or paste this link into your browser:<br><span style="word-break:break-all">${escapeHtml(message.action.url)}</span></p>`
    : '';
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(message.subject)}</title></head>
<body style="margin:0;background:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;color:#101828">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border:1px solid #e4e7ec;border-radius:14px">
<tr><td style="padding:32px 36px 8px;font-weight:700;font-size:15px;letter-spacing:-.01em"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#4353c7;margin-right:8px"></span>${site.name}</td></tr>
<tr><td style="padding:8px 36px 32px;font-size:15px;line-height:1.65">
<h1 style="font-size:22px;line-height:1.3;margin:12px 0 16px;letter-spacing:-.02em">${escapeHtml(message.subject)}</h1>
${message.paragraphs.map((p) => `<p style="margin:0 0 14px;color:#344054">${escapeHtml(p)}</p>`).join('')}
${button}
${message.footnote ? `<p style="margin:20px 0 0;color:#667085;font-size:13px">${escapeHtml(message.footnote)}</p>` : ''}
</td></tr></table>
<p style="color:#98a2b3;font-size:12px;margin:20px 0 0">${site.name} · a product by ${site.company} · <a href="${absoluteUrl('/app/account')}" style="color:#98a2b3">Email preferences</a></p>
</td></tr></table></body></html>`;
  return { text, html };
}

/** Sends through Mailjet when configured; otherwise logs the message so local flows stay testable. */
export async function sendEmail(message: Message) {
  const { text, html } = renderEmail(message);
  const key = process.env.MAILJET_API_KEY;
  const secret = process.env.MAILJET_SECRET_KEY;
  if (!key || !secret) {
    console.info(`[email:dev] to=${message.to} subject="${message.subject}"\n${text}`);
    return { delivered: false as const };
  }
  const response = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}` },
    body: JSON.stringify({
      Messages: [{
        From: { Email: process.env.MAILJET_FROM_EMAIL ?? 'noreply@manifestfts.com', Name: process.env.MAILJET_FROM_NAME ?? site.name },
        To: [{ Email: message.to }],
        Subject: message.subject,
        TextPart: text,
        HTMLPart: html,
      }],
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    // Never log the recipient's message body; status is enough to debug delivery.
    console.error(`[email] Mailjet responded ${response.status} for subject "${message.subject}"`);
    return { delivered: false as const };
  }
  return { delivered: true as const };
}

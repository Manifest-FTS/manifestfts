'use server';
import { z } from 'zod';
import { getDb, schema } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { clientInfo } from '@/lib/auth/session';
import { sendEmail } from '@/lib/email';
import { newId } from '@/lib/utils';
import { site } from '@/lib/site';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(120),
  email: z.email('Enter a valid work email.').max(200),
  company: z.string().trim().max(160).optional().default(''),
  topic: z.enum(['demo', 'pricing', 'services', 'support', 'other'], 'Choose a topic.'),
  message: z.string().trim().min(10, 'Add a few details so we can help.').max(4000),
  website: z.string().max(0).optional(), // honeypot
});

export type ContactState = { ok?: boolean; error?: string; fieldErrors?: Partial<Record<keyof z.infer<typeof contactSchema>, string[]>>; values?: Record<string, string> };

export async function submitContact(_: ContactState, formData: FormData): Promise<ContactState> {
  const values = Object.fromEntries([...formData.entries()].map(([k, v]) => [k, String(v)]));
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  if (parsed.data.website) return { ok: true }; // silently drop bots

  const { ip } = await clientInfo();
  const limit = await rateLimit(`contact:${ip}`, 5, 3600);
  if (!limit.ok) return { error: 'Too many messages from this network. Please try again later or email us directly.', values };

  const db = await getDb();
  const { name, email, company, topic, message } = parsed.data;
  await db.insert(schema.inquiries).values({ id: newId('inq'), name, email: email.toLowerCase(), company, topic, message });
  await sendEmail({
    to: site.salesEmail,
    subject: `Signal inquiry (${topic}) from ${name}`,
    paragraphs: [`Name: ${name}`, `Email: ${email}`, `Company: ${company || '—'}`, `Topic: ${topic}`, message],
  });
  await sendEmail({
    to: email,
    subject: 'We received your message',
    paragraphs: [`Hi ${name.split(' ')[0]},`, 'Thanks for contacting the Manifest Signal team. A member of Manifest FTS will reply within one business day.', `For reference, you wrote: “${message.slice(0, 500)}${message.length > 500 ? '…' : ''}”`],
  });
  return { ok: true };
}

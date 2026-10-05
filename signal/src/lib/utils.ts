import { randomBytes } from 'node:crypto';

export { cn } from './cn';

export function newId(prefix: string) {
  return `${prefix}_${randomBytes(12).toString('base64url')}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'workspace';
}

/** Normalizes "https://www.Example.com/path" or "example.com" to "example.com". */
export function normalizeDomain(input: string) {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return '';
  try {
    const url = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

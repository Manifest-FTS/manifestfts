import { describe, expect, it } from 'vitest';
import { isSameOrigin } from './same-origin';

const req = (headers: Record<string, string>) => new Request('http://0.0.0.0:3000/api/tools/readiness', { method: 'POST', headers });

describe('isSameOrigin', () => {
  it('trusts the browser Sec-Fetch-Site signal', () => {
    expect(isSameOrigin(req({ 'sec-fetch-site': 'same-origin', origin: 'https://signal.example.com' }))).toBe(true);
    expect(isSameOrigin(req({ 'sec-fetch-site': 'cross-site', origin: 'https://evil.example' }))).toBe(false);
  });

  it('matches the forwarded host behind a reverse proxy', () => {
    expect(isSameOrigin(req({ origin: 'https://signal.example.com', host: '0.0.0.0:3000', 'x-forwarded-host': 'signal.example.com' }))).toBe(true);
    expect(isSameOrigin(req({ origin: 'http://localhost:3000', host: 'localhost:3000' }))).toBe(true);
  });

  it('rejects other origins', () => {
    expect(isSameOrigin(req({ origin: 'https://evil.example', host: 'signal.example.com' }))).toBe(false);
  });
});

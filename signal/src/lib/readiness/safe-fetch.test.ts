import { describe, expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
import { assertSafeUrl, isPrivateAddress } from './safe-fetch';

describe('SSRF guard', () => {
  it('blocks private, loopback, link-local, and mapped addresses', () => {
    for (const ip of ['127.0.0.1', '10.1.2.3', '172.16.0.1', '192.168.1.1', '169.254.169.254', '100.64.0.1', '0.0.0.0', '::1', 'fd00::1', 'fe80::1', '::ffff:127.0.0.1']) {
      expect(isPrivateAddress(ip), ip).toBe(true);
    }
  });

  it('allows public addresses', () => {
    for (const ip of ['8.8.8.8', '1.1.1.1', '2606:4700:4700::1111']) expect(isPrivateAddress(ip), ip).toBe(false);
  });

  it('rejects unsafe URLs before any request is made', () => {
    for (const url of ['ftp://example.com', 'http://localhost', 'http://127.0.0.1', 'https://example.com:8443', 'https://user:pw@example.com', 'http://intranet', 'http://metadata.google.internal']) {
      expect(() => assertSafeUrl(url), url).toThrow();
    }
    expect(assertSafeUrl('https://example.com/path').hostname).toBe('example.com');
  });
});

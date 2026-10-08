import { describe, expect, it } from 'vitest';
import { niceStep } from './chart-scale';

describe('niceStep', () => {
  it('gives round integer steps for counts', () => {
    expect(niceStep(10 / 4, true)).toBe(3);
    expect(niceStep(1 / 4, true)).toBe(1);
    expect(niceStep(1402 / 4, true)).toBe(400);
    expect(niceStep(90 / 4, true)).toBe(25);
  });
  it('allows fractional steps for rates', () => {
    expect(niceStep(0.92 / 4)).toBe(0.25);
    expect(niceStep(0.4 / 4)).toBe(0.1);
  });
});

/**
 * Picks a round axis step so four gridlines cover the data: 1, 2, 2.5, 3, 4, 5, or 10 × 10^k.
 * Integer scales (counts) skip fractional steps such as 2.5.
 */
export function niceStep(raw: number, integer = false) {
  if (!(raw > 0)) return integer ? 1 : 0.25;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const n = raw / pow;
  const candidates = [1, 2, 2.5, 3, 4, 5, 10].filter((c) => !integer || Number.isInteger(c * pow));
  const step = (candidates.find((c) => c >= n - 1e-9) ?? 10) * pow;
  return integer ? Math.max(1, Math.round(step)) : step;
}

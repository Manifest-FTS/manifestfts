export const RETAINER_MIN_HOURS = 3;
export const RETAINER_MAX_HOURS = 40;
export const RETAINER_DEFAULT_HOURS = 10;

const supportBands = [
  {
    min: 3,
    max: 9,
    rate: 120,
    label: 'Focused support',
    description:
      'Maintenance, improvements, and a focused monthly scope.',
  },
  {
    min: 10,
    max: 19,
    rate: 110,
    label: 'Steady momentum',
    description:
      'Ongoing design, development, and product progress.',
  },
  {
    min: 20,
    max: 29,
    rate: 100,
    label: 'Integrated support',
    description:
      'Consistent output across design and development.',
  },
  {
    min: 30,
    max: 40,
    rate: 90,
    label: 'Embedded partner',
    description:
      'Embedded partnership across strategy and execution.',
  },
];

export function clampRetainerHours(hours) {
  const value = Number(hours) || RETAINER_DEFAULT_HOURS;
  return Math.min(RETAINER_MAX_HOURS, Math.max(RETAINER_MIN_HOURS, value));
}

export function getRetainerBand(hours) {
  const safeHours = clampRetainerHours(hours);
  return supportBands.find((band) => safeHours >= band.min && safeHours <= band.max) || supportBands[1];
}

export function getRetainerSnapshot(hours) {
  const safeHours = clampRetainerHours(hours);
  const band = getRetainerBand(safeHours);

  return {
    hours: safeHours,
    effectiveRate: band.rate,
    monthlyTotal: safeHours * band.rate,
    supportLabel: band.label,
    supportDescription: band.description,
    anchorPoints: [3, 10, 20, 30, 40],
  };
}

export function formatUsd(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
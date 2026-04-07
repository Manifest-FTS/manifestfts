export const RETAINER_MIN_HOURS = 5;
export const RETAINER_MAX_HOURS = 40;
export const RETAINER_DEFAULT_HOURS = 10;

const supportBands = [
  {
    min: 5,
    max: 9,
    rate: 150,
    label: 'Focused support',
    description:
      'A good fit for maintenance, targeted improvements, strategic guidance, and a short list of meaningful priorities each month.',
  },
  {
    min: 10,
    max: 19,
    rate: 140,
    label: 'Steady momentum',
    description:
      'A balanced rhythm for ongoing design, development, UX improvements, implementation work, and steady product progress.',
  },
  {
    min: 20,
    max: 29,
    rate: 130,
    label: 'Integrated support',
    description:
      'Well-suited for organizations that need regular throughput across product, design, development, enhancements, and support.',
  },
  {
    min: 30,
    max: 40,
    rate: 120,
    label: 'Embedded partner',
    description:
      'Best for teams that want broader coverage and a more embedded monthly partnership across strategy and execution.',
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
    anchorPoints: [5, 10, 20, 40],
  };
}

export function formatUsd(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
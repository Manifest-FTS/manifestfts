import { FREE_WEBSITE_STATUSES, FreeWebsiteStatus } from "./freeWebsiteTypes";

export const PRIMARY_GOALS = [
  "visibility",
  "bookings",
  "calls",
  "leads",
  "credibility",
  "other",
] as const;

export const WEBSITE_STATUS_OPTIONS = [
  { value: "no_site", label: "No current site" },
  { value: "outdated_site", label: "Outdated site" },
  { value: "redesign", label: "Needs redesign" },
  { value: "active_site", label: "Active site, needs improvement" },
  { value: "other", label: "Other" },
] as const;

export const DOMAIN_STATUS_OPTIONS = [
  { value: "has_domain", label: "I already have a domain" },
  { value: "needs_domain", label: "I need help getting a domain" },
  { value: "unsure", label: "Not sure" },
] as const;

export const LOGO_STATUS_OPTIONS = [
  { value: "has_logo", label: "I have a logo" },
  { value: "needs_placeholder", label: "Need a simple placeholder" },
  { value: "none", label: "No logo yet" },
] as const;

export const GBP_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "not_set_up", label: "Not set up" },
  { value: "in_progress", label: "In progress" },
  { value: "unsure", label: "Unsure" },
] as const;

export const FULFILLMENT_OPTIONS = {
  contentReadiness: [
    { value: "not_ready", label: "Not ready" },
    { value: "in_progress", label: "In progress" },
    { value: "ready", label: "Ready" },
  ],
  assetReadiness: [
    { value: "missing", label: "Missing" },
    { value: "partial", label: "Partial" },
    { value: "ready", label: "Ready" },
  ],
  wordpressSetupStatus: [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In progress" },
    { value: "complete", label: "Complete" },
  ],
  handoffStatus: [
    { value: "not_started", label: "Not started" },
    { value: "scheduled", label: "Scheduled" },
    { value: "completed", label: "Completed" },
  ],
} as const;

export const FREE_WEBSITE_STATUS_OPTIONS = FREE_WEBSITE_STATUSES.map((status) => ({
  value: status,
  label: status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" "),
}));

export function freeWebsiteStatusLabel(status: FreeWebsiteStatus): string {
  const match = FREE_WEBSITE_STATUS_OPTIONS.find((item) => item.value === status);
  return match ? match.label : status;
}

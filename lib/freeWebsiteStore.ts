import { promises as fs } from "fs";
import path from "path";
import {
  ContentDraft,
  FreeWebsiteIntake,
  FreeWebsiteStatus,
  FreeWebsiteSubmission,
  FulfillmentState,
  SubmissionSummary,
  TimelineEvent,
} from "./freeWebsiteTypes";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "free-website-submissions.json");

const generateId = (): string => {
  return `fw_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

const generateTimelineId = (): string => {
  return `ev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

export async function readAllSubmissions(): Promise<FreeWebsiteSubmission[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  const parsed = JSON.parse(raw) as FreeWebsiteSubmission[];

  return parsed.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function writeAllSubmissions(
  submissions: FreeWebsiteSubmission[]
): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), "utf8");
}

export function buildDefaultDraft(intake: FreeWebsiteIntake): ContentDraft {
  const business = intake.businessName.trim() || "Your Business";
  const category = intake.businessCategory.trim() || "local business";
  const serviceArea = intake.serviceArea.trim() || "your service area";

  return {
    heroHeading: `${business} — Trusted ${category} in ${serviceArea}`,
    heroSubheading:
      "Clear, mobile-friendly, and launch-ready — built to help customers find and contact you quickly.",
    aboutSection:
      `${business} provides dependable service with a focus on professionalism, clarity, and customer experience. This draft can be personalized once final details are confirmed.`,
    servicesSummary:
      intake.servicesOffered ||
      "Core services can be listed here in plain language with short benefit-focused descriptions.",
    contactCTA:
      "Ready to Contact Us? Contact us today to request a quote or schedule your first conversation.",
    seoTitleSuggestion: `${business} | ${category} in ${serviceArea}`,
    metaDescriptionSuggestion:
      `${business} offers professional ${category} services in ${serviceArea}. Contact us for reliable support and clear next steps.`,
    locationServiceNotes:
      "Add nearby locations, neighborhoods, and service qualifiers as needed for premium SEO expansion.",
  };
}

export function buildDefaultFulfillment(): FulfillmentState {
  return {
    templateAssignment: "",
    contentReadiness: "not_ready",
    assetReadiness: "missing",
    wordpressSetupStatus: "pending",
    previewUrl: "",
    launchUrl: "",
    assignedTeamMember: "",
    handoffStatus: "not_started",
    readinessForFulfillment: false,
    contentMissing: true,
    contentApproved: false,
    paidConversion: false,
  };
}

export function buildTimelineEvent(
  type: TimelineEvent["type"],
  message: string,
  actor = "system"
): TimelineEvent {
  return {
    id: generateTimelineId(),
    type,
    message,
    createdAt: new Date().toISOString(),
    actor,
  };
}

export function buildSubmission(intake: FreeWebsiteIntake): FreeWebsiteSubmission {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    status: "new",
    intake,
    internalNotes: [],
    generatedContentDraft: buildDefaultDraft(intake),
    seoVisibilityNotes:
      "Basic on-page SEO is included. Review service + location specificity for premium strategy opportunities.",
    premiumUpsellRecommendations:
      "Evaluate for service pages, location pages, and enhanced copywriting after intake review.",
    fulfillment: buildDefaultFulfillment(),
    timeline: [
      buildTimelineEvent(
        "created",
        "Submission created from public free website intake.",
        "public_form"
      ),
    ],
  };
}

export function toSubmissionSummary(
  submission: FreeWebsiteSubmission
): SubmissionSummary {
  return {
    id: submission.id,
    createdAt: submission.createdAt,
    updatedAt: submission.updatedAt,
    status: submission.status,
    businessName: submission.intake.businessName,
    contactName: submission.intake.contactName,
    email: submission.intake.email,
    primaryGoal: submission.intake.primaryGoal,
    readinessForFulfillment: submission.fulfillment.readinessForFulfillment,
    paidConversion: submission.fulfillment.paidConversion,
  };
}

export function statusLabel(status: FreeWebsiteStatus): string {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

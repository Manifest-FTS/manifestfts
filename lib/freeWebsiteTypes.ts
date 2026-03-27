export const FREE_WEBSITE_STATUSES = [
  "new",
  "reviewed",
  "awaiting_assets",
  "awaiting_approval",
  "ready_for_setup",
  "setup_in_progress",
  "preview_sent",
  "revision_requested",
  "completed",
  "upsell_opportunity",
  "converted_to_paid",
  "archived",
] as const;

export type FreeWebsiteStatus = (typeof FREE_WEBSITE_STATUSES)[number];

export type WebsiteStatusOption =
  | "no_site"
  | "outdated_site"
  | "redesign"
  | "active_site"
  | "other";

export type DomainStatusOption = "has_domain" | "needs_domain" | "unsure";

export type LogoStatusOption =
  | "has_logo"
  | "needs_placeholder"
  | "none";

export type GBPStatusOption =
  | "active"
  | "not_set_up"
  | "in_progress"
  | "unsure";

export type WordPressSetupStatus = "pending" | "in_progress" | "complete";

export type HandoffStatus = "not_started" | "scheduled" | "completed";

export interface UpgradeInterest {
  advancedSEO: boolean;
  copywritingContentHelp: boolean;
  blogContentStrategy: boolean;
  domainEmailSetup: boolean;
  hostingMaintenance: boolean;
  customDesignFeatures: boolean;
}

export interface FreeWebsiteIntake {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessCategory: string;
  businessDescription: string;
  serviceArea: string;
  websiteStatus: WebsiteStatusOption;
  desiredPages: string;
  primaryGoal: string;
  servicesOffered: string;
  preferredStyleTone: string;
  socialLinks: string;
  googleBusinessProfileStatus: GBPStatusOption;
  domainStatus: DomainStatusOption;
  logoStatus: LogoStatusOption;
  imageUploadNotes: string;
  notesSpecialRequests: string;
  templateAcknowledged: boolean;
  upgradeInterests: UpgradeInterest;
}

export interface ContentDraft {
  heroHeading: string;
  heroSubheading: string;
  aboutSection: string;
  servicesSummary: string;
  contactCTA: string;
  seoTitleSuggestion: string;
  metaDescriptionSuggestion: string;
  locationServiceNotes: string;
}

export interface FulfillmentState {
  templateAssignment: string;
  contentReadiness: "not_ready" | "in_progress" | "ready";
  assetReadiness: "missing" | "partial" | "ready";
  wordpressSetupStatus: WordPressSetupStatus;
  previewUrl: string;
  launchUrl: string;
  assignedTeamMember: string;
  handoffStatus: HandoffStatus;
  readinessForFulfillment: boolean;
  contentMissing: boolean;
  contentApproved: boolean;
  paidConversion: boolean;
}

export interface InternalNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  type:
    | "created"
    | "status_changed"
    | "note_added"
    | "draft_updated"
    | "fulfillment_updated"
    | "action";
  message: string;
  createdAt: string;
  actor: string;
}

export interface FreeWebsiteSubmission {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: FreeWebsiteStatus;
  intake: FreeWebsiteIntake;
  internalNotes: InternalNote[];
  generatedContentDraft: ContentDraft;
  seoVisibilityNotes: string;
  premiumUpsellRecommendations: string;
  fulfillment: FulfillmentState;
  timeline: TimelineEvent[];
}

export interface SubmissionSummary {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: FreeWebsiteStatus;
  businessName: string;
  contactName: string;
  email: string;
  primaryGoal: string;
  readinessForFulfillment: boolean;
  paidConversion: boolean;
}

export interface CreateSubmissionPayload extends FreeWebsiteIntake {}

export interface SubmissionPatchPayload {
  status?: FreeWebsiteStatus;
  internalNote?: string;
  seoVisibilityNotes?: string;
  premiumUpsellRecommendations?: string;
  upgradeInterests?: Partial<UpgradeInterest>;
  generatedContentDraft?: Partial<ContentDraft>;
  fulfillment?: Partial<FulfillmentState>;
  action?:
    | "mark_reviewed"
    | "request_assets"
    | "generate_draft_content"
    | "mark_ready_for_setup"
    | "mark_setup_complete"
    | "archive";
}

import {
  CreateSubmissionPayload,
  FREE_WEBSITE_STATUSES,
  FreeWebsiteStatus,
  SubmissionPatchPayload,
} from "./freeWebsiteTypes";

type ValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; error: string };

const WEBSITE_STATUS_OPTIONS = [
  "no_site",
  "outdated_site",
  "redesign",
  "active_site",
  "other",
] as const;

const GBP_STATUS_OPTIONS = ["active", "not_set_up", "in_progress", "unsure"] as const;
const DOMAIN_STATUS_OPTIONS = ["has_domain", "needs_domain", "unsure"] as const;
const LOGO_STATUS_OPTIONS = ["has_logo", "needs_placeholder", "none"] as const;

const CONTENT_READINESS_OPTIONS = ["not_ready", "in_progress", "ready"] as const;
const ASSET_READINESS_OPTIONS = ["missing", "partial", "ready"] as const;
const WP_SETUP_OPTIONS = ["pending", "in_progress", "complete"] as const;
const HANDOFF_OPTIONS = ["not_started", "scheduled", "completed"] as const;

const ACTIONS = [
  "mark_reviewed",
  "request_assets",
  "generate_draft_content",
  "mark_ready_for_setup",
  "mark_setup_complete",
  "archive",
] as const;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function isOneOf<T extends readonly string[]>(
  value: string,
  options: T
): value is T[number] {
  return options.includes(value);
}

export function validateCreatePayload(payload: unknown): ValidationResult<CreateSubmissionPayload> {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "Invalid payload." };
  }

  const input = payload as Record<string, unknown>;

  const websiteStatusInput = asString(input.websiteStatus);
  const googleBusinessProfileStatusInput = asString(input.googleBusinessProfileStatus);
  const domainStatusInput = asString(input.domainStatus);
  const logoStatusInput = asString(input.logoStatus);

  const cleaned: CreateSubmissionPayload = {
    businessName: asString(input.businessName),
    contactName: asString(input.contactName),
    email: asString(input.email).toLowerCase(),
    phone: asString(input.phone),
    businessCategory: asString(input.businessCategory),
    businessDescription: asString(input.businessDescription),
    serviceArea: asString(input.serviceArea),
    websiteStatus: isOneOf(websiteStatusInput, WEBSITE_STATUS_OPTIONS)
      ? websiteStatusInput
      : "other",
    desiredPages: asString(input.desiredPages),
    primaryGoal: asString(input.primaryGoal),
    servicesOffered: asString(input.servicesOffered),
    preferredStyleTone: asString(input.preferredStyleTone),
    socialLinks: asString(input.socialLinks),
    googleBusinessProfileStatus: isOneOf(googleBusinessProfileStatusInput, GBP_STATUS_OPTIONS)
      ? googleBusinessProfileStatusInput
      : "unsure",
    domainStatus: isOneOf(domainStatusInput, DOMAIN_STATUS_OPTIONS)
      ? domainStatusInput
      : "unsure",
    logoStatus: isOneOf(logoStatusInput, LOGO_STATUS_OPTIONS)
      ? logoStatusInput
      : "none",
    imageUploadNotes: asString(input.imageUploadNotes),
    notesSpecialRequests: asString(input.notesSpecialRequests),
    templateAcknowledged: asBoolean(input.templateAcknowledged),
    upgradeInterests: {
      advancedSEO: asBoolean((input.upgradeInterests as Record<string, unknown>)?.advancedSEO),
      copywritingContentHelp: asBoolean(
        (input.upgradeInterests as Record<string, unknown>)?.copywritingContentHelp
      ),
      blogContentStrategy: asBoolean(
        (input.upgradeInterests as Record<string, unknown>)?.blogContentStrategy
      ),
      domainEmailSetup: asBoolean(
        (input.upgradeInterests as Record<string, unknown>)?.domainEmailSetup
      ),
      hostingMaintenance: asBoolean(
        (input.upgradeInterests as Record<string, unknown>)?.hostingMaintenance
      ),
      customDesignFeatures: asBoolean(
        (input.upgradeInterests as Record<string, unknown>)?.customDesignFeatures
      ),
    },
  };

  if (!cleaned.businessName || !cleaned.contactName || !cleaned.email) {
    return {
      valid: false,
      error: "Business name, contact name, and email are required.",
    };
  }

  if (!cleaned.templateAcknowledged) {
    return {
      valid: false,
      error: "You must acknowledge the standardized free website template system.",
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
    return { valid: false, error: "Please provide a valid email address." };
  }

  return { valid: true, value: cleaned };
}

export function validatePatchPayload(payload: unknown): ValidationResult<SubmissionPatchPayload> {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "Invalid payload." };
  }

  const input = payload as Record<string, unknown>;
  const cleaned: SubmissionPatchPayload = {};

  const status = asString(input.status);
  if (status) {
    if (!isOneOf(status, FREE_WEBSITE_STATUSES)) {
      return { valid: false, error: "Invalid status value." };
    }
    cleaned.status = status as FreeWebsiteStatus;
  }

  if (typeof input.internalNote === "string") {
    cleaned.internalNote = input.internalNote.trim();
  }

  if (typeof input.seoVisibilityNotes === "string") {
    cleaned.seoVisibilityNotes = input.seoVisibilityNotes.trim();
  }

  if (typeof input.premiumUpsellRecommendations === "string") {
    cleaned.premiumUpsellRecommendations = input.premiumUpsellRecommendations.trim();
  }

  if (input.upgradeInterests && typeof input.upgradeInterests === "object") {
    const upgrades = input.upgradeInterests as Record<string, unknown>;
    cleaned.upgradeInterests = {};
    [
      "advancedSEO",
      "copywritingContentHelp",
      "blogContentStrategy",
      "domainEmailSetup",
      "hostingMaintenance",
      "customDesignFeatures",
    ].forEach((key) => {
      if (typeof upgrades[key] === "boolean") {
        (cleaned.upgradeInterests as Record<string, boolean>)[key] = upgrades[key] as boolean;
      }
    });
  }

  if (input.generatedContentDraft && typeof input.generatedContentDraft === "object") {
    const draft = input.generatedContentDraft as Record<string, unknown>;
    const cleanedDraft: Record<string, string> = {};
    [
      "heroHeading",
      "heroSubheading",
      "aboutSection",
      "servicesSummary",
      "contactCTA",
      "seoTitleSuggestion",
      "metaDescriptionSuggestion",
      "locationServiceNotes",
    ].forEach((key) => {
      const draftValue = draft[key];
      if (typeof draftValue === "string") {
        cleanedDraft[key] = draftValue.trim();
      }
    });

    cleaned.generatedContentDraft = cleanedDraft as SubmissionPatchPayload["generatedContentDraft"];
  }

  if (input.fulfillment && typeof input.fulfillment === "object") {
    const fulfillment = input.fulfillment as Record<string, unknown>;
    const cleanedFulfillment: Record<string, unknown> = {};

    if (typeof fulfillment.templateAssignment === "string") {
      cleanedFulfillment.templateAssignment = fulfillment.templateAssignment.trim();
    }
    if (
      typeof fulfillment.contentReadiness === "string" &&
      isOneOf(fulfillment.contentReadiness, CONTENT_READINESS_OPTIONS)
    ) {
      cleanedFulfillment.contentReadiness = fulfillment.contentReadiness;
    }
    if (
      typeof fulfillment.assetReadiness === "string" &&
      isOneOf(fulfillment.assetReadiness, ASSET_READINESS_OPTIONS)
    ) {
      cleanedFulfillment.assetReadiness = fulfillment.assetReadiness;
    }
    if (
      typeof fulfillment.wordpressSetupStatus === "string" &&
      isOneOf(fulfillment.wordpressSetupStatus, WP_SETUP_OPTIONS)
    ) {
      cleanedFulfillment.wordpressSetupStatus = fulfillment.wordpressSetupStatus;
    }
    if (typeof fulfillment.previewUrl === "string") {
      cleanedFulfillment.previewUrl = fulfillment.previewUrl.trim();
    }
    if (typeof fulfillment.launchUrl === "string") {
      cleanedFulfillment.launchUrl = fulfillment.launchUrl.trim();
    }
    if (typeof fulfillment.assignedTeamMember === "string") {
      cleanedFulfillment.assignedTeamMember = fulfillment.assignedTeamMember.trim();
    }
    if (
      typeof fulfillment.handoffStatus === "string" &&
      isOneOf(fulfillment.handoffStatus, HANDOFF_OPTIONS)
    ) {
      cleanedFulfillment.handoffStatus = fulfillment.handoffStatus;
    }

    [
      "readinessForFulfillment",
      "contentMissing",
      "contentApproved",
      "paidConversion",
    ].forEach((key) => {
      if (typeof fulfillment[key] === "boolean") {
        cleanedFulfillment[key] = fulfillment[key];
      }
    });

    cleaned.fulfillment = cleanedFulfillment as SubmissionPatchPayload["fulfillment"];
  }

  const action = asString(input.action);
  if (action) {
    if (!isOneOf(action, ACTIONS)) {
      return { valid: false, error: "Invalid action." };
    }
    cleaned.action = action;
  }

  return { valid: true, value: cleaned };
}

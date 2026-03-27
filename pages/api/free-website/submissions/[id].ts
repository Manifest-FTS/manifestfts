import type { NextApiRequest, NextApiResponse } from "next";
import { assertAdminApiAccess } from "../../../../lib/freeWebsiteAdmin";
import {
  buildDefaultDraft,
  buildTimelineEvent,
  readAllSubmissions,
  writeAllSubmissions,
} from "../../../../lib/freeWebsiteStore";
import { validatePatchPayload } from "../../../../lib/freeWebsiteValidation";
import { FreeWebsiteSubmission, SubmissionPatchPayload } from "../../../../lib/freeWebsiteTypes";

function applyAction(
  submission: FreeWebsiteSubmission,
  action: NonNullable<SubmissionPatchPayload["action"]>
): void {
  switch (action) {
    case "mark_reviewed":
      submission.status = "reviewed";
      submission.timeline.unshift(
        buildTimelineEvent("action", "Submission marked as reviewed.", "admin")
      );
      break;
    case "request_assets":
      submission.status = "awaiting_assets";
      submission.fulfillment.assetReadiness = "missing";
      submission.timeline.unshift(
        buildTimelineEvent("action", "Client assets requested.", "admin")
      );
      break;
    case "generate_draft_content":
      submission.generatedContentDraft = buildDefaultDraft(submission.intake);
      submission.timeline.unshift(
        buildTimelineEvent("action", "Starter draft content generated.", "admin")
      );
      break;
    case "mark_ready_for_setup":
      submission.status = "ready_for_setup";
      submission.fulfillment.readinessForFulfillment = true;
      submission.fulfillment.wordpressSetupStatus = "pending";
      submission.timeline.unshift(
        buildTimelineEvent("action", "Marked ready for WordPress setup.", "admin")
      );
      break;
    case "mark_setup_complete":
      submission.status = "completed";
      submission.fulfillment.wordpressSetupStatus = "complete";
      submission.timeline.unshift(
        buildTimelineEvent("action", "WordPress setup marked complete.", "admin")
      );
      break;
    case "archive":
      submission.status = "archived";
      submission.timeline.unshift(
        buildTimelineEvent("action", "Submission archived.", "admin")
      );
      break;
    default:
      break;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!assertAdminApiAccess(req, res)) {
    return;
  }

  const id = (req.query.id || "").toString().trim();
  if (!id) {
    return res.status(400).json({ error: "Submission id is required." });
  }

  const submissions = await readAllSubmissions();
  const index = submissions.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Submission not found." });
  }

  if (req.method === "GET") {
    return res.status(200).json({ submission: submissions[index] });
  }

  if (req.method === "PATCH") {
    const parsed = validatePatchPayload(req.body);
    if (!parsed.valid) {
      return res.status(400).json({ error: parsed.error });
    }

    const submission = submissions[index];
    const patch = parsed.value;

    if (patch.action) {
      applyAction(submission, patch.action);
    }

    if (patch.status && patch.status !== submission.status) {
      const previousStatus = submission.status;
      submission.status = patch.status;
      submission.timeline.unshift(
        buildTimelineEvent(
          "status_changed",
          `Status changed from ${previousStatus} to ${patch.status}.`,
          "admin"
        )
      );
    }

    if (patch.internalNote) {
      const note = {
        id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        text: patch.internalNote,
        author: "admin",
        createdAt: new Date().toISOString(),
      };
      submission.internalNotes.unshift(note);
      submission.timeline.unshift(
        buildTimelineEvent("note_added", "Internal note added.", "admin")
      );
    }

    if (typeof patch.seoVisibilityNotes === "string") {
      submission.seoVisibilityNotes = patch.seoVisibilityNotes;
    }

    if (typeof patch.premiumUpsellRecommendations === "string") {
      submission.premiumUpsellRecommendations = patch.premiumUpsellRecommendations;
    }

    if (patch.upgradeInterests) {
      submission.intake.upgradeInterests = {
        ...submission.intake.upgradeInterests,
        ...patch.upgradeInterests,
      };
      submission.timeline.unshift(
        buildTimelineEvent("fulfillment_updated", "Upgrade interests updated.", "admin")
      );
    }

    if (patch.generatedContentDraft) {
      submission.generatedContentDraft = {
        ...submission.generatedContentDraft,
        ...patch.generatedContentDraft,
      };
      submission.timeline.unshift(
        buildTimelineEvent("draft_updated", "Content draft updated.", "admin")
      );
    }

    if (patch.fulfillment) {
      submission.fulfillment = {
        ...submission.fulfillment,
        ...patch.fulfillment,
      };
      submission.timeline.unshift(
        buildTimelineEvent("fulfillment_updated", "Fulfillment details updated.", "admin")
      );
    }

    submission.updatedAt = new Date().toISOString();
    submissions[index] = submission;
    await writeAllSubmissions(submissions);

    return res.status(200).json({ submission });
  }

  res.setHeader("Allow", "GET, PATCH");
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}

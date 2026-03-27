import type { NextApiRequest, NextApiResponse } from "next";
import { assertAdminApiAccess } from "../../../../lib/freeWebsiteAdmin";
import {
  buildSubmission,
  readAllSubmissions,
  toSubmissionSummary,
  writeAllSubmissions,
} from "../../../../lib/freeWebsiteStore";
import { validateCreatePayload } from "../../../../lib/freeWebsiteValidation";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const parsed = validateCreatePayload(req.body);
    if (!parsed.valid) {
      return res.status(400).json({ error: parsed.error });
    }

    const submissions = await readAllSubmissions();
    const newSubmission = buildSubmission(parsed.value);
    submissions.unshift(newSubmission);
    await writeAllSubmissions(submissions);

    return res.status(201).json({
      id: newSubmission.id,
      status: newSubmission.status,
      message: "Submission received successfully.",
    });
  }

  if (req.method === "GET") {
    if (!assertAdminApiAccess(req, res)) {
      return;
    }

    const submissions = await readAllSubmissions();
    const q = (req.query.q || "").toString().trim().toLowerCase();
    const status = (req.query.status || "").toString().trim();

    const filtered = submissions.filter((submission) => {
      const searchMatch =
        !q ||
        submission.intake.businessName.toLowerCase().includes(q) ||
        submission.intake.contactName.toLowerCase().includes(q) ||
        submission.intake.email.toLowerCase().includes(q) ||
        submission.intake.primaryGoal.toLowerCase().includes(q);

      const statusMatch = !status || submission.status === status;

      return searchMatch && statusMatch;
    });

    return res.status(200).json({
      count: filtered.length,
      submissions: filtered.map(toSubmissionSummary),
    });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}

import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import WPLanding from "../../../../components/layout/WPLanding";
import {
  FREE_WEBSITE_STATUS_OPTIONS,
  FULFILLMENT_OPTIONS,
  freeWebsiteStatusLabel,
} from "../../../../lib/freeWebsiteOptions";
import { FreeWebsiteSubmission, SubmissionPatchPayload } from "../../../../lib/freeWebsiteTypes";

const ADMIN_TOKEN_STORAGE_KEY = "manifest_free_website_admin_token";

export default function FreeWebsiteIntakeDetailPage() {
  const router = useRouter();
  const submissionId = (router.query.id || "").toString();

  const [adminToken, setAdminToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [submission, setSubmission] = useState<FreeWebsiteSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || "";
      setAdminToken(stored);
      setTokenInput(stored);
    }
  }, []);

  const loadSubmission = async (tokenOverride?: string) => {
    const token = tokenOverride ?? adminToken;
    if (!token || !submissionId) return;

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/free-website/submissions/${submissionId}`, {
        headers: {
          "x-admin-token": token,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to load submission.");
        return;
      }

      setSubmission(data.submission);
    } catch (err) {
      console.error(err);
      setError("Error loading submission.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveTokenAndLoad = async () => {
    if (!tokenInput.trim()) {
      setError("Please enter an admin token.");
      return;
    }

    const token = tokenInput.trim();
    setAdminToken(token);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
    }

    await loadSubmission(token);
  };

  const patchSubmission = async (patch: SubmissionPatchPayload, successMessage?: string) => {
    if (!adminToken) {
      setError("Admin token is required.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/free-website/submissions/${submissionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify(patch),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to save changes.");
        return;
      }

      setSubmission(data.submission);
      if (successMessage) toast.success(successMessage);
    } catch (err) {
      console.error(err);
      setError("Error saving submission changes.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (adminToken && submissionId) {
      loadSubmission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken, submissionId]);

  const intakeRows = useMemo(() => {
    if (!submission) return [];
    const i = submission.intake;
    return [
      ["Business name", i.businessName],
      ["Contact name", i.contactName],
      ["Email", i.email],
      ["Phone", i.phone || "—"],
      ["Business category", i.businessCategory || "—"],
      ["Business description", i.businessDescription || "—"],
      ["Service area", i.serviceArea || "—"],
      ["Website status", i.websiteStatus],
      ["Desired pages", i.desiredPages || "—"],
      ["Primary goal", i.primaryGoal || "—"],
      ["Services offered", i.servicesOffered || "—"],
      ["Preferred style/tone", i.preferredStyleTone || "—"],
      ["Social links", i.socialLinks || "—"],
      ["Google Business Profile", i.googleBusinessProfileStatus],
      ["Domain status", i.domainStatus],
      ["Logo status", i.logoStatus],
      ["Image notes", i.imageUploadNotes || "—"],
      ["Special requests", i.notesSpecialRequests || "—"],
    ] as Array<[string, string]>;
  }, [submission]);

  return (
    <WPLanding>
      <section className="py-12 px-4 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Free Website Submission Detail</h1>
              <p className="text-gray-600">Manage review, content, and fulfillment readiness.</p>
            </div>
            <Link href="/admin/intakes/free-websites">
              <a className="underline text-sm">Back to intake queue</a>
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin token</label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter FREE_WEBSITE_ADMIN_TOKEN"
                />
              </div>
              <button onClick={saveTokenAndLoad} className="px-4 py-2 bg-black text-white rounded-md">
                Load
              </button>
            </div>
            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          </div>

          {isLoading && <p className="text-gray-600">Loading submission...</p>}
          {!isLoading && !submission && <p className="text-gray-600">No submission loaded yet.</p>}

          {submission && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-5">
                <Card title="Submission Overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <Info label="Submission ID" value={submission.id} mono />
                    <Info label="Current status" value={freeWebsiteStatusLabel(submission.status)} />
                    <Info label="Created" value={new Date(submission.createdAt).toLocaleString()} />
                    <Info label="Updated" value={new Date(submission.updatedAt).toLocaleString()} />
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={submission.status}
                      onChange={(e) =>
                        patchSubmission(
                          { status: e.target.value as SubmissionPatchPayload["status"] },
                          "Status updated."
                        )
                      }
                    >
                      {FREE_WEBSITE_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2 flex-wrap">
                      <ActionButton
                        label="Mark reviewed"
                        onClick={() => patchSubmission({ action: "mark_reviewed" }, "Marked reviewed.")}
                        disabled={isSaving}
                      />
                      <ActionButton
                        label="Request assets"
                        onClick={() => patchSubmission({ action: "request_assets" }, "Assets requested.")}
                        disabled={isSaving}
                      />
                      <ActionButton
                        label="Generate draft content"
                        onClick={() => patchSubmission({ action: "generate_draft_content" }, "Starter draft content generated.")}
                        disabled={isSaving}
                      />
                      <ActionButton
                        label="Ready for setup"
                        onClick={() => patchSubmission({ action: "mark_ready_for_setup" }, "Marked ready for setup.")}
                        disabled={isSaving}
                      />
                      <ActionButton
                        label="Setup complete"
                        onClick={() => patchSubmission({ action: "mark_setup_complete" }, "Setup completed.")}
                        disabled={isSaving}
                      />
                      <ActionButton
                        label="Archive"
                        onClick={() => patchSubmission({ action: "archive" }, "Submission archived.")}
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                </Card>

                <Card title="Intake Data">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    {intakeRows.map(([label, value]) => (
                      <Info key={label} label={label} value={value} />
                    ))}
                  </div>
                </Card>

                <Card title="Generated Content Draft">
                  <PatchTextarea label="Homepage hero heading" value={submission.generatedContentDraft.heroHeading} onSave={(value) => patchSubmission({ generatedContentDraft: { heroHeading: value } }, "Hero heading saved.")} />
                  <PatchTextarea label="Homepage hero subheading" value={submission.generatedContentDraft.heroSubheading} onSave={(value) => patchSubmission({ generatedContentDraft: { heroSubheading: value } }, "Hero subheading saved.")} rows={3} />
                  <PatchTextarea label="About section" value={submission.generatedContentDraft.aboutSection} onSave={(value) => patchSubmission({ generatedContentDraft: { aboutSection: value } }, "About draft saved.")} rows={4} />
                  <PatchTextarea label="Services summary" value={submission.generatedContentDraft.servicesSummary} onSave={(value) => patchSubmission({ generatedContentDraft: { servicesSummary: value } }, "Services summary saved.")} rows={4} />
                  <PatchTextarea label="Contact CTA" value={submission.generatedContentDraft.contactCTA} onSave={(value) => patchSubmission({ generatedContentDraft: { contactCTA: value } }, "Contact CTA saved.")} />
                  <PatchTextarea label="SEO title suggestion" value={submission.generatedContentDraft.seoTitleSuggestion} onSave={(value) => patchSubmission({ generatedContentDraft: { seoTitleSuggestion: value } }, "SEO title saved.")} />
                  <PatchTextarea label="Meta description suggestion" value={submission.generatedContentDraft.metaDescriptionSuggestion} onSave={(value) => patchSubmission({ generatedContentDraft: { metaDescriptionSuggestion: value } }, "Meta description saved.")} rows={3} />
                  <PatchTextarea label="Location/service notes" value={submission.generatedContentDraft.locationServiceNotes} onSave={(value) => patchSubmission({ generatedContentDraft: { locationServiceNotes: value } }, "Location/service notes saved.")} rows={3} />
                </Card>

                <Card title="SEO + Upsell Notes">
                  <PatchTextarea label="SEO/basic visibility notes" value={submission.seoVisibilityNotes} onSave={(value) => patchSubmission({ seoVisibilityNotes: value }, "SEO notes saved.")} rows={4} />
                  <PatchTextarea label="Premium upsell recommendations" value={submission.premiumUpsellRecommendations} onSave={(value) => patchSubmission({ premiumUpsellRecommendations: value }, "Upsell recommendations saved.")} rows={4} />
                </Card>
              </div>

              <div className="space-y-5">
                <Card title="Fulfillment Checklist">
                  <div className="space-y-3">
                    <PatchInput label="Template assignment" value={submission.fulfillment.templateAssignment} onSave={(value) => patchSubmission({ fulfillment: { templateAssignment: value } }, "Template assignment saved.")} />
                    <PatchInput label="Assigned team member" value={submission.fulfillment.assignedTeamMember} onSave={(value) => patchSubmission({ fulfillment: { assignedTeamMember: value } }, "Assigned team member saved.")} />
                    <PatchInput label="Preview URL" value={submission.fulfillment.previewUrl} onSave={(value) => patchSubmission({ fulfillment: { previewUrl: value } }, "Preview URL saved.")} />
                    <PatchInput label="Launch URL" value={submission.fulfillment.launchUrl} onSave={(value) => patchSubmission({ fulfillment: { launchUrl: value } }, "Launch URL saved.")} />

                    <SelectPatch label="Content readiness" value={submission.fulfillment.contentReadiness} options={FULFILLMENT_OPTIONS.contentReadiness} onSave={(value) => patchSubmission({ fulfillment: { contentReadiness: value as "not_ready" | "in_progress" | "ready" } }, "Content readiness updated.")} />
                    <SelectPatch label="Asset readiness" value={submission.fulfillment.assetReadiness} options={FULFILLMENT_OPTIONS.assetReadiness} onSave={(value) => patchSubmission({ fulfillment: { assetReadiness: value as "missing" | "partial" | "ready" } }, "Asset readiness updated.")} />
                    <SelectPatch label="WordPress setup status" value={submission.fulfillment.wordpressSetupStatus} options={FULFILLMENT_OPTIONS.wordpressSetupStatus} onSave={(value) => patchSubmission({ fulfillment: { wordpressSetupStatus: value as "pending" | "in_progress" | "complete" } }, "WordPress setup status updated.")} />
                    <SelectPatch label="Client handoff / review" value={submission.fulfillment.handoffStatus} options={FULFILLMENT_OPTIONS.handoffStatus} onSave={(value) => patchSubmission({ fulfillment: { handoffStatus: value as "not_started" | "scheduled" | "completed" } }, "Handoff status updated.")} />

                    <div className="grid gap-1 text-sm text-gray-700 pt-2">
                      <ToggleRow label="Ready for fulfillment" checked={submission.fulfillment.readinessForFulfillment} onChange={(value) => patchSubmission({ fulfillment: { readinessForFulfillment: value } }, "Readiness updated.")} />
                      <ToggleRow label="Content missing" checked={submission.fulfillment.contentMissing} onChange={(value) => patchSubmission({ fulfillment: { contentMissing: value } }, "Content missing updated.")} />
                      <ToggleRow label="Content approved" checked={submission.fulfillment.contentApproved} onChange={(value) => patchSubmission({ fulfillment: { contentApproved: value } }, "Content approval updated.")} />
                      <ToggleRow label="Converted to paid" checked={submission.fulfillment.paidConversion} onChange={(value) => patchSubmission({ fulfillment: { paidConversion: value } }, "Paid conversion updated.")} />
                    </div>
                  </div>
                </Card>

                <Card title="Internal Notes">
                  <form
                    onSubmit={(e: FormEvent) => {
                      e.preventDefault();
                      if (!noteText.trim()) return;
                      patchSubmission({ internalNote: noteText.trim() }, "Note added.");
                      setNoteText("");
                    }}
                    className="mb-3"
                  >
                    <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3} value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add internal note" />
                    <button className="mt-2 px-4 py-2 border rounded-md text-sm" disabled={isSaving}>Add note</button>
                  </form>
                  <div className="space-y-2 max-h-72 overflow-auto">
                    {submission.internalNotes.length === 0 && <p className="text-sm text-gray-500">No internal notes yet.</p>}
                    {submission.internalNotes.map((note) => (
                      <div key={note.id} className="border border-gray-200 rounded-md p-2">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{note.author} • {new Date(note.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Status Timeline">
                  <div className="space-y-3 max-h-96 overflow-auto">
                    {submission.timeline.length === 0 && <p className="text-sm text-gray-500">No timeline events.</p>}
                    {submission.timeline.map((event) => (
                      <div key={event.id} className="border-l-2 border-gray-300 pl-3">
                        <p className="text-sm text-gray-900">{event.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.type} • {event.actor} • {new Date(event.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>
    </WPLanding>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`text-gray-900 ${mono ? "font-mono text-xs break-all" : ""}`}>{value || "—"}</p>
    </div>
  );
}

function ActionButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  return (
    <button type="button" className="text-xs px-2 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

function PatchTextarea({ label, value, onSave, rows = 2 }: { label: string; value: string; onSave: (value: string) => void; rows?: number }) {
  const [draft, setDraft] = useState(value || "");
  useEffect(() => setDraft(value || ""), [value]);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={rows} value={draft} onChange={(e) => setDraft(e.target.value)} />
      <button className="text-xs px-3 py-1 mt-2 border rounded-md" onClick={() => onSave(draft)} type="button">Save</button>
    </div>
  );
}

function PatchInput({ label, value, onSave }: { label: string; value: string; onSave: (value: string) => void }) {
  const [draft, setDraft] = useState(value || "");
  useEffect(() => setDraft(value || ""), [value]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input className="w-full px-3 py-2 border border-gray-300 rounded-md" value={draft} onChange={(e) => setDraft(e.target.value)} />
      <button className="text-xs px-3 py-1 mt-2 border rounded-md" onClick={() => onSave(draft)} type="button">Save</button>
    </div>
  );
}

function SelectPatch({ label, value, options, onSave }: { label: string; value: string; options: ReadonlyArray<{ value: string; label: string }>; onSave: (value: string) => void }) {
  const [draft, setDraft] = useState(value || "");
  useEffect(() => setDraft(value || ""), [value]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <select className="w-full px-3 py-2 border border-gray-300 rounded-md" value={draft} onChange={(e) => setDraft(e.target.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <button className="text-xs px-3 py-1 border rounded-md" onClick={() => onSave(draft)} type="button">Save</button>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between border border-gray-200 rounded-md px-2 py-2">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

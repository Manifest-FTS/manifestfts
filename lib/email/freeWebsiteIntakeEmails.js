const DEFAULT_SITE_ORIGIN = "https://www.manifestfts.com";

function escapeHtml(value) {
  const s = String(value ?? "");
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeOrigin() {
  const raw = process.env.NEXT_PUBLIC_CLIENT_URL || process.env.SITE_URL || DEFAULT_SITE_ORIGIN;
  return String(raw).replace(/\/$/, "") || DEFAULT_SITE_ORIGIN;
}

function asCleanString(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function normalizePayload(payload) {
  const name = asCleanString(payload.name || payload.contactName);
  const email = asCleanString(payload.email).toLowerCase();
  const phone = asCleanString(payload.phone);
  const businessName = asCleanString(payload.businessName);
  const selectedPlan = asCleanString(payload.selectedPlan);
  const organizationType = asCleanString(payload.organizationType || payload.businessCategory);
  const websiteUrl = asCleanString(payload.websiteUrl);
  const primaryGoal = asCleanString(payload.primaryGoal);
  const contactPreference = asCleanString(payload.contactPreference);
  const bestTimeToCall = asCleanString(payload.bestTimeToCall);
  const message = asCleanString(payload.message || payload.notesSpecialRequests);

  return {
    name,
    email,
    phone,
    businessName,
    selectedPlan,
    organizationType,
    websiteUrl,
    primaryGoal,
    contactPreference,
    bestTimeToCall,
    message,
  };
}

function toTitleCaseWords(value) {
  if (!value) {
    return "";
  }

  return value
    .replace(/_/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatPlan(value) {
  if (!value) {
    return "N/A";
  }

  if (value === "guided_onboarding") {
    return "Guided Onboarding";
  }

  if (value === "professional") {
    return "Professional";
  }

  if (value === "basic") {
    return "Basic";
  }

  return toTitleCaseWords(value);
}

function formatOrganizationType(value) {
  if (!value) {
    return "N/A";
  }

  if (value === "small_business") {
    return "Small Business";
  }

  if (value === "nonprofit") {
    return "Nonprofit";
  }

  if (value === "community_organization") {
    return "Community Organization";
  }

  return toTitleCaseWords(value);
}

function formatPrimaryGoal(value) {
  if (!value) {
    return "N/A";
  }

  if (value === "visibility") {
    return "Get found online";
  }

  if (value === "leads") {
    return "Get more inquiries";
  }

  if (value === "donations") {
    return "Increase donations";
  }

  if (value === "credibility") {
    return "Look more credible";
  }

  if (value === "refresh") {
    return "Refresh an outdated website";
  }

  return toTitleCaseWords(value);
}

function buildSubmittedFieldList(fields) {
  return [
    ["Contact Name", fields.name || "N/A"],
    ["Email", fields.email || "N/A"],
    ["Phone", fields.phone || "N/A"],
    ["Business / Organization", fields.businessName || "N/A"],
    ["Selected Plan", formatPlan(fields.selectedPlan)],
    ["Organization Type", formatOrganizationType(fields.organizationType)],
    ["Website URL", fields.websiteUrl || "N/A"],
    ["Primary Goal", formatPrimaryGoal(fields.primaryGoal)],
    ["Contact Preference", toTitleCaseWords(fields.contactPreference) || "N/A"],
    ["Best Time To Call", fields.bestTimeToCall || "N/A"],
  ];
}

function buildPlainTextHeader(title, fields) {
  const lines = [title, ""];

  buildSubmittedFieldList(fields).forEach(([label, value]) => {
    lines.push(`${label}: ${value}`);
  });

  lines.push("");
  lines.push("Message:");
  lines.push(fields.message || "N/A");
  lines.push("");

  return lines;
}

function buildFieldRowsHtml(fields) {
  return buildSubmittedFieldList(fields)
    .map(([label, value]) => {
      const isEmail = label === "Email" && value !== "N/A";
      const renderedValue = isEmail
        ? `<a href=\"mailto:${escapeHtml(value)}\" style=\"color:#0c7664;text-decoration:none;\">${escapeHtml(value)}</a>`
        : escapeHtml(value);

      return `<tr><td style=\"padding:8px 0;color:#6b7280;width:180px;vertical-align:top;font-size:14px;\">${escapeHtml(label)}</td><td style=\"padding:8px 0;color:#111827;font-size:14px;\">${renderedValue}</td></tr>`;
    })
    .join("");
}

export function buildInternalFreeWebsiteIntakeEmail(payload) {
  const fields = normalizePayload(payload);
  const logoUrl = `${DEFAULT_SITE_ORIGIN}/assets/imgs/logo.svg`;

  const text = [
    ...buildPlainTextHeader("New Free Website Intake - Manifest FTS", fields),
    "- Manifest FTS automated email",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
</head>
<body style=\"margin:0;padding:0;background:#f3f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;\">
  <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"padding:28px 12px;background:#f3f6f8;\">
    <tr>
      <td align=\"center\">
        <table role=\"presentation\" width=\"640\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:640px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;overflow:hidden;box-shadow:0 16px 45px rgba(15,23,42,0.08);\">
          <tr>
            <td style=\"padding:28px 30px 20px;background:linear-gradient(130deg,#eef7f5 0%,#ffffff 62%);border-bottom:1px solid #edf1f5;\">
              <img src=\"${logoUrl}\" width=\"172\" height=\"26\" alt=\"Manifest FTS\" style=\"display:block;border:0;height:auto;max-width:172px;\" />
              <p style=\"margin:16px 0 0;font-size:11px;letter-spacing:0.13em;color:#0f766e;text-transform:uppercase;font-weight:700;\">Free Website Intake</p>
              <h1 style=\"margin:9px 0 0;font-size:28px;line-height:1.2;color:#0f172a;font-weight:700;letter-spacing:-0.02em;\">New Free Website Intake</h1>
              <p style=\"margin:10px 0 0;font-size:15px;line-height:1.6;color:#475467;\">A new lead came in from the free website form. Contact details and intake answers are below.</p>
            </td>
          </tr>
          <tr>
            <td style=\"padding:24px 30px 8px;\">
              <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse:collapse;\">
                ${buildFieldRowsHtml(fields)}
              </table>
            </td>
          </tr>
          <tr>
            <td style=\"padding:12px 30px 24px;\">
              <p style=\"margin:0 0 10px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;font-weight:700;\">Message</p>
              <div style=\"border:1px solid #e5e7eb;background:#f8fafc;border-radius:14px;padding:16px;color:#111827;font-size:14px;line-height:1.65;\">${escapeHtml(fields.message || "N/A").replace(/\n/g, "<br>")}</div>
            </td>
          </tr>
          <tr>
            <td style=\"padding:14px 30px;background:#f8fafc;border-top:1px solid #edf1f5;\">
              <p style=\"margin:0;color:#98a2b3;font-size:12px;line-height:1.5;\">Automated delivery from Manifest FTS website forms.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: "New Free Website Lead - Manifest FTS",
    text,
    html,
  };
}

export function buildCustomerFreeWebsiteConfirmationEmail(payload) {
  const origin = normalizeOrigin();
  const fields = normalizePayload(payload);
  const logoUrl = `${DEFAULT_SITE_ORIGIN}/assets/imgs/logo.svg`;
  const ourWorkUrl = `${origin}/our-work`;
  const caseStudyUrl = `${origin}/case-study/nc-waterfalls`;
  const greeting = fields.name ? `Hi ${escapeHtml(fields.name)},` : "Hi there,";

  const text = [
    `${fields.name || "Hi there"},`,
    "",
    "Thanks for submitting your Free Website request to Manifest FTS.",
    "We received your intake details and our team will follow up shortly.",
    "",
    ...buildPlainTextHeader("Your submitted details", fields),
    "What to check out while we review your request:",
    `Our Work: ${ourWorkUrl}`,
    `NC Waterfalls case study: ${caseStudyUrl}`,
    "",
    "Need to reach us right away?",
    "Email: hello@manifestfts.com",
    `Website: ${origin}/contact`,
    "",
    "- Manifest FTS",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
</head>
<body style=\"margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;\">
  <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"padding:28px 12px;background:#f5f7fa;\">
    <tr>
      <td align=\"center\">
        <table role=\"presentation\" width=\"640\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:640px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;overflow:hidden;\">
          <tr>
            <td style=\"padding:30px 30px 22px;text-align:center;background:linear-gradient(150deg,#ffffff 0%,#eef7f5 100%);border-bottom:1px solid #edf1f5;\">
              <img src=\"${logoUrl}\" width=\"165\" height=\"25\" alt=\"Manifest FTS\" style=\"display:inline-block;border:0;height:auto;max-width:165px;\" />
              <h1 style=\"margin:16px 0 0;font-size:29px;line-height:1.2;color:#0f172a;font-weight:700;letter-spacing:-0.02em;\">We got your request</h1>
              <p style=\"margin:10px 0 0;font-size:15px;line-height:1.6;color:#475467;\">Thank you for reaching out about our Free Website program. We are excited to learn more and help you move forward.</p>
            </td>
          </tr>
          <tr>
            <td style=\"padding:24px 30px 12px;\">
              <p style=\"margin:0 0 14px;font-size:16px;line-height:1.5;color:#111827;\">${greeting}</p>
              <p style=\"margin:0 0 14px;font-size:15px;line-height:1.65;color:#374151;\">You should hear from us shortly. In the meantime, here is a copy of the info you sent:</p>
              <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse:collapse;\">
                ${buildFieldRowsHtml(fields)}
              </table>
            </td>
          </tr>
          <tr>
            <td style=\"padding:12px 30px 22px;\">
              <p style=\"margin:0 0 10px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;font-weight:700;\">Message</p>
              <div style=\"border:1px solid #e5e7eb;background:#f8fafc;border-radius:14px;padding:16px;color:#111827;font-size:14px;line-height:1.65;\">${escapeHtml(fields.message || "N/A").replace(/\n/g, "<br>")}</div>
            </td>
          </tr>
          <tr>
            <td style=\"padding:0 30px 22px;\">
              <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#0f172a;border-radius:14px;\">
                <tr>
                  <td style=\"padding:18px 20px;\">
                    <p style=\"margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#cbd5e1;font-weight:700;\">Get fired up</p>
                    <p style=\"margin:8px 0 0;font-size:14px;line-height:1.7;color:#e2e8f0;\">Want to see the level of work we bring to every launch?</p>
                    <p style=\"margin:10px 0 0;font-size:14px;line-height:1.75;\">
                      <a href=\"${ourWorkUrl}\" style=\"color:#5eead4;text-decoration:none;font-weight:600;\">Explore Our Work</a><br>
                      <a href=\"${caseStudyUrl}\" style=\"color:#5eead4;text-decoration:none;font-weight:600;\">Read the NC Waterfalls case study</a>
                    </p>
                    <p style=\"margin:10px 0 0;font-size:13px;line-height:1.6;color:#cbd5e1;\">Recent launch spotlight: NC Waterfalls now has a modern, scalable digital home for decades of fieldwork, helping thousands of explorers find routes, maps, and verified waterfall data.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style=\"padding:0 30px 26px;\">
              <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;\">
                <tr>
                  <td style=\"padding:16px 18px;\">
                    <p style=\"margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;font-weight:700;\">Contact info</p>
                    <p style=\"margin:8px 0 0;font-size:14px;line-height:1.65;color:#374151;\">Email us anytime at <a href=\"mailto:hello@manifestfts.com\" style=\"color:#0f766e;text-decoration:none;\">hello@manifestfts.com</a> or use our contact page at <a href=\"${origin}/contact\" style=\"color:#0f766e;text-decoration:none;\">manifestfts.com/contact</a>.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style=\"padding:14px 30px;background:#f8fafc;border-top:1px solid #edf1f5;\">
              <p style=\"margin:0;color:#98a2b3;font-size:12px;line-height:1.5;\">You received this because you submitted the Manifest FTS Free Website form.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: "Your Free Website request is in - Manifest FTS",
    text,
    html,
  };
}

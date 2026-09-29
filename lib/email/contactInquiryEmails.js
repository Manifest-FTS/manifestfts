const DEFAULT_SITE_ORIGIN = "https://www.manifestfts.com";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function buildContactInquiryEmail(payload = {}) {
  const fields = {
    name: clean(payload.fullname),
    email: clean(payload.email).toLowerCase(),
    phone: clean(payload.phone),
    company: clean(payload.company),
    inquiry: clean(payload.inquiry),
    message: clean(payload.message),
  };
  const rows = [
    ["Name", fields.name || "N/A"],
    ["Email", fields.email || "N/A"],
    ["Phone", fields.phone || "N/A"],
    ["Company", fields.company || "N/A"],
    ["Inquiry", fields.inquiry || "N/A"],
  ];
  const subject = `${fields.inquiry || "New Contact Inquiry"} - Manifest FTS`;
  const text = [
    "New Contact Inquiry - Manifest FTS",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    fields.message || "N/A",
    "",
    "- Manifest FTS automated email",
  ].join("\n");
  const fieldRows = rows
    .map(([label, value]) => {
      const renderedValue =
        label === "Email" && fields.email
          ? `<a href="mailto:${escapeHtml(fields.email)}" style="color:#0f766e;text-decoration:none;">${escapeHtml(fields.email)}</a>`
          : escapeHtml(value);

      return `<tr><td style="padding:8px 0;color:#667085;width:120px;vertical-align:top;font-size:14px;">${escapeHtml(label)}</td><td style="padding:8px 0;color:#101828;font-size:14px;">${renderedValue}</td></tr>`;
    })
    .join("");
  const logoUrl = `${DEFAULT_SITE_ORIGIN}/assets/imgs/logo.svg`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f3f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:28px 12px;background:#f3f6f8;">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;overflow:hidden;box-shadow:0 16px 45px rgba(15,23,42,0.08);">
          <tr>
            <td style="padding:28px 30px 20px;background:linear-gradient(130deg,#eef7f5 0%,#ffffff 62%);border-bottom:1px solid #edf1f5;">
              <img src="${logoUrl}" width="172" height="26" alt="Manifest FTS" style="display:block;border:0;height:auto;max-width:172px;" />
              <p style="margin:16px 0 0;font-size:11px;letter-spacing:0.13em;color:#0f766e;text-transform:uppercase;font-weight:700;">Contact Form</p>
              <h1 style="margin:9px 0 0;font-size:28px;line-height:1.2;color:#0f172a;font-weight:700;">New ${escapeHtml(fields.inquiry || "contact inquiry")}</h1>
              <p style="margin:10px 0 0;font-size:15px;line-height:1.6;color:#475467;">A new request came in through the Manifest FTS contact form.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 30px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                ${fieldRows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 30px 24px;">
              <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;font-weight:700;">Message</p>
              <div style="border:1px solid #e5e7eb;background:#f8fafc;border-radius:14px;padding:16px;color:#111827;font-size:14px;line-height:1.65;">${escapeHtml(fields.message || "N/A").replace(/\n/g, "<br>")}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 30px;background:#f8fafc;border-top:1px solid #edf1f5;">
              <p style="margin:0;color:#98a2b3;font-size:12px;line-height:1.5;">Automated delivery from Manifest FTS website forms.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}
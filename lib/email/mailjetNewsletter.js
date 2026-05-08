import crypto from "crypto";

const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY;
const MAILJET_CONTACT_LIST_ID = process.env.MAILJET_CONTACT_LIST_ID;
const MAILJET_FROM_EMAIL = process.env.MAILJET_FROM_EMAIL || "noreply@manifestfts.com";
const MAILJET_FROM_NAME = process.env.MAILJET_FROM_NAME || "Manifest FTS";
const DEFAULT_SITE_ORIGIN = "https://www.manifestfts.com";

function siteOrigin() {
  const raw = process.env.NEXT_PUBLIC_CLIENT_URL || process.env.SITE_URL || DEFAULT_SITE_ORIGIN;
  return String(raw).replace(/\/$/, "") || DEFAULT_SITE_ORIGIN;
}

function safeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(email) {
  return safeString(email).toLowerCase();
}

function toBase64Url(value) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function escapeHtml(value) {
  const s = String(value ?? "");
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function signingSecret() {
  return (
    process.env.MAILJET_VERIFICATION_SECRET ||
    process.env.NEWSLETTER_VERIFICATION_SECRET ||
    MAILJET_SECRET_KEY ||
    ""
  );
}

function hmac(input) {
  return crypto.createHmac("sha256", signingSecret()).update(input).digest("base64url");
}

function encodeVerificationToken({ email, name, source, expiresAt }) {
  const payload = {
    email,
    name,
    source,
    exp: expiresAt,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = hmac(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function decodeVerificationToken(token) {
  const [encodedPayload, signature] = String(token || "").split(".");
  if (!encodedPayload || !signature) {
    return { valid: false, reason: "missing_parts" };
  }

  if (!signingSecret()) {
    return { valid: false, reason: "missing_secret" };
  }

  const expected = hmac(encodedPayload);
  if (expected !== signature) {
    return { valid: false, reason: "invalid_signature" };
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload));
    const email = normalizeEmail(payload.email);
    const exp = Number(payload.exp || 0);

    if (!email || !exp) {
      return { valid: false, reason: "invalid_payload" };
    }

    if (Date.now() > exp) {
      return { valid: false, reason: "expired" };
    }

    return {
      valid: true,
      email,
      name: safeString(payload.name),
      source: safeString(payload.source),
      expiresAt: exp,
    };
  } catch (error) {
    return { valid: false, reason: "payload_parse_error" };
  }
}

function mailjetAuthHeader() {
  const token = Buffer.from(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`, "utf8").toString("base64");
  return `Basic ${token}`;
}

function hasMailjetSendConfig() {
  return Boolean(MAILJET_API_KEY && MAILJET_SECRET_KEY);
}

function hasMailjetListConfig() {
  return Boolean(MAILJET_API_KEY && MAILJET_SECRET_KEY && MAILJET_CONTACT_LIST_ID);
}

async function sendMailjetTransactionalEmail({ toEmail, toName, subject, textPart, htmlPart }) {
  const response = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      Authorization: mailjetAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Messages: [
        {
          From: {
            Email: MAILJET_FROM_EMAIL,
            Name: MAILJET_FROM_NAME,
          },
          To: [
            {
              Email: toEmail,
              Name: toName || toEmail,
            },
          ],
          Subject: subject,
          TextPart: textPart,
          HTMLPart: htmlPart,
        },
      ],
    }),
  });

  const bodyText = await response.text();
  let parsed = null;
  if (bodyText) {
    try {
      parsed = JSON.parse(bodyText);
    } catch (error) {
      parsed = { raw: bodyText };
    }
  }

  if (!response.ok) {
    const error = new Error("Mailjet transactional send failed");
    error.status = response.status;
    error.response = parsed;
    throw error;
  }

  return parsed;
}

function buildVerificationEmail({ name, verifyUrl }) {
  const greeting = name ? `Hi ${escapeHtml(name)},` : "Hi there,";
  const subject = "Confirm your Manifest FTS updates subscription";

  const text = [
    name ? `Hi ${name},` : "Hi there,",
    "",
    "Please confirm you want to receive updates from Manifest FTS.",
    "",
    `Confirm subscription: ${verifyUrl}`,
    "",
    "If you did not request this, you can ignore this email.",
    "",
    "- Manifest FTS",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e4e7ec;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid #edf1f5;background:linear-gradient(140deg,#eef7f5 0%,#ffffff 72%);">
              <p style="margin:0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#0f766e;font-weight:700;">Manifest FTS Updates</p>
              <h1 style="margin:10px 0 0;font-size:26px;line-height:1.2;color:#0f172a;">Please confirm your subscription</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 24px;">
              <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#344054;">${greeting}</p>
              <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#344054;">Please confirm you want to receive updates from Manifest FTS.</p>
              <a href="${verifyUrl}" style="display:inline-block;background:#101828;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:9px;font-weight:600;font-size:14px;">Confirm subscription</a>
              <p style="margin:14px 0 0;font-size:12px;line-height:1.6;color:#667085;">If you did not request this, ignore this email and no action will be taken.</p>
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

export async function sendNewsletterVerificationEmail({ email, name, source }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return { skipped: true, reason: "missing_email" };
  }

  if (!hasMailjetSendConfig()) {
    return { skipped: true, reason: "missing_mailjet_keys" };
  }

  if (!hasMailjetListConfig()) {
    return { skipped: true, reason: "missing_mailjet_contact_list_config" };
  }

  if (!signingSecret()) {
    return { skipped: true, reason: "missing_verification_secret" };
  }

  const expiresAt = Date.now() + 1000 * 60 * 60 * 72;
  const token = encodeVerificationToken({
    email: normalizedEmail,
    name: safeString(name),
    source: safeString(source),
    expiresAt,
  });

  const verifyUrl = `${siteOrigin()}/api/newsletter/verify?token=${encodeURIComponent(token)}`;
  const content = buildVerificationEmail({
    name: safeString(name),
    verifyUrl,
  });

  await sendMailjetTransactionalEmail({
    toEmail: normalizedEmail,
    toName: safeString(name),
    subject: content.subject,
    textPart: content.text,
    htmlPart: content.html,
  });

  return {
    sent: true,
    expiresAt,
  };
}

async function upsertMailjetContact({ email, name }) {
  const response = await fetch("https://api.mailjet.com/v3/REST/contact", {
    method: "POST",
    headers: {
      Authorization: mailjetAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Email: email,
      Name: name || undefined,
      IsExcludedFromCampaigns: false,
    }),
  });

  if (response.ok || response.status === 400) {
    // 400 is typically returned when contact already exists; safe to continue.
    return;
  }

  const error = new Error("Mailjet contact upsert failed");
  error.status = response.status;
  error.response = await response.text();
  throw error;
}

async function addContactToList({ email }) {
  const response = await fetch(
    `https://api.mailjet.com/v3/REST/contactslist/${MAILJET_CONTACT_LIST_ID}/managecontact`,
    {
      method: "POST",
      headers: {
        Authorization: mailjetAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: email,
        Action: "addnoforce",
      }),
    }
  );

  if (response.ok) {
    return;
  }

  const error = new Error("Mailjet contact list add failed");
  error.status = response.status;
  error.response = await response.text();
  throw error;
}

export async function addVerifiedSubscriberToMailjetList({ email, name, source }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return { added: false, reason: "missing_email" };
  }

  if (!hasMailjetListConfig()) {
    return { added: false, reason: "missing_mailjet_contact_list_config" };
  }

  await upsertMailjetContact({
    email: normalizedEmail,
    name: safeString(name),
  });

  await addContactToList({
    email: normalizedEmail,
  });

  return {
    added: true,
    email: normalizedEmail,
    source: safeString(source),
  };
}

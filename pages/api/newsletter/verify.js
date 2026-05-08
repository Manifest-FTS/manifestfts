import {
  addVerifiedSubscriberToMailjetList,
  decodeVerificationToken,
} from "../../../lib/email/mailjetNewsletter";

function renderHtml({ title, message, ok }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;background:#f4f6f8;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e4e7ec;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid #edf1f5;background:${ok ? "linear-gradient(140deg,#eef7f5 0%,#ffffff 72%)" : "linear-gradient(140deg,#fff3f2 0%,#ffffff 72%)"};">
              <h1 style="margin:0;font-size:26px;line-height:1.2;color:#0f172a;">${title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 24px;">
              <p style="margin:0;font-size:15px;line-height:1.7;color:#344054;">${message}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function verifyNewsletterSubscription(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = typeof req.query.token === "string" ? req.query.token : "";
  const decoded = decodeVerificationToken(token);

  if (!decoded.valid) {
    const html = renderHtml({
      title: "Verification link is invalid",
      message:
        "This confirmation link is invalid or expired. Submit another form if you still want to subscribe.",
      ok: false,
    });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(400).send(html);
  }

  try {
    const result = await addVerifiedSubscriberToMailjetList({
      email: decoded.email,
      name: decoded.name,
      source: decoded.source,
    });

    if (!result.added) {
      const html = renderHtml({
        title: "Subscription could not be completed",
        message:
          "Your email was verified, but we could not add you to the mailing list right now. Please contact support.",
        ok: false,
      });
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(500).send(html);
    }

    const html = renderHtml({
      title: "Subscription confirmed",
      message:
        "Thanks for confirming. You are now subscribed to Manifest FTS updates and partner digests.",
      ok: true,
    });
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  } catch (error) {
    console.error("Failed to verify newsletter subscription:", error);
    const html = renderHtml({
      title: "Subscription failed",
      message:
        "We could not complete your subscription at this moment. Please try again later or contact support.",
      ok: false,
    });
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(500).send(html);
  }
}

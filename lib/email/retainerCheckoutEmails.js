/**
 * HTML + plain-text emails for retainer Stripe Checkout completion.
 * Uses table layout and inline styles for broad client compatibility.
 */

const DEFAULT_SITE_ORIGIN = 'https://www.manifestfts.com';

function escapeHtml(value) {
  const s = String(value ?? '');
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeOrigin() {
  const raw = process.env.NEXT_PUBLIC_CLIENT_URL || process.env.SITE_URL || DEFAULT_SITE_ORIGIN;
  return String(raw).replace(/\/$/, '') || DEFAULT_SITE_ORIGIN;
}

function extractSessionFields(session) {
  const metadata = (session && session.metadata) || {};
  const sub = session.subscription;
  const subscriptionId =
    typeof sub === 'string' ? sub : sub && typeof sub === 'object' && sub.id ? sub.id : '';

  const billingMode =
    metadata.billingMode === 'one_time' || session.mode === 'payment' ? 'one_time' : 'recurring';

  return {
    customerEmail: session.customer_email || metadata.contactEmail || '',
    customerName: metadata.contactName || '',
    company: metadata.company || '',
    brief: metadata.brief || '',
    selectedCommitment: metadata.selectedCommitment || '',
    billingMode,
    billingLabel:
      metadata.billingLabel ||
      (billingMode === 'one_time' ? 'One-time support block' : 'Monthly recurring retainer'),
    totalLabel: metadata.totalLabel || (billingMode === 'one_time' ? 'One-time total' : 'Monthly total'),
    monthlyTotal: metadata.monthlyTotal || '',
    effectiveRate: metadata.effectiveRate || '',
    supportLabel: metadata.supportLabel || '',
    source: metadata.source || '',
    subscriptionId,
    sessionId: session.id || '',
  };
}

function buildInternalPlainText(fields) {
  const {
    customerEmail,
    customerName,
    company,
    brief,
    selectedCommitment,
    billingLabel,
    totalLabel,
    monthlyTotal,
    effectiveRate,
    supportLabel,
    source,
    subscriptionId,
    sessionId,
  } = fields;

  return [
    'New retainer checkout completed',
    '',
    `Contact name: ${customerName || 'N/A'}`,
    `Email: ${customerEmail || 'N/A'}`,
    `Company: ${company || 'N/A'}`,
    `Source: ${source || 'N/A'}`,
    '',
    `Billing: ${billingLabel || 'N/A'}`,
    `Commitment: ${selectedCommitment || 'N/A'}`,
    `Support tier: ${supportLabel || 'N/A'}`,
    `Effective rate: ${effectiveRate || 'N/A'}`,
    `${totalLabel || 'Total'}: ${monthlyTotal || 'N/A'}`,
    '',
    'Project brief:',
    brief || 'N/A',
    '',
    `Stripe Checkout session: ${sessionId || 'N/A'}`,
    `Stripe subscription: ${subscriptionId || 'N/A'}`,
    '',
    '— Manifest FTS (automated notification)',
  ].join('\n');
}

function buildInternalHtml(fields, origin) {
  const logoUrl = `${DEFAULT_SITE_ORIGIN}/assets/imgs/logo.svg`;
  const capabilitiesUrl = `${origin}/capabilities`;
  const {
    customerEmail,
    customerName,
    company,
    brief,
    selectedCommitment,
    billingLabel,
    totalLabel,
    monthlyTotal,
    effectiveRate,
    supportLabel,
    source,
    subscriptionId,
    sessionId,
  } = fields;

  const safeBrief = escapeHtml(brief).replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e7ec;box-shadow:0 4px 24px rgba(16,24,40,0.08);">
          <tr>
            <td style="padding:28px 32px 20px 32px;border-bottom:1px solid #eef2f6;background:linear-gradient(180deg,#fafbfc 0%,#ffffff 100%);">
              <img src="${logoUrl}" width="180" height="27" alt="Manifest FTS" style="display:block;border:0;max-width:180px;height:auto;" />
              <p style="margin:16px 0 0 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#667085;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${escapeHtml(billingLabel) || 'Support purchase'}</p>
              <h1 style="margin:8px 0 0 0;font-size:22px;line-height:1.25;color:#101828;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-weight:600;">New checkout confirmed</h1>
              <p style="margin:10px 0 0 0;font-size:15px;line-height:1.5;color:#475467;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Someone completed Stripe Checkout for a support engagement. Summary and Stripe references are below.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 8px 32px;">
              <p style="margin:0 0 12px 0;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#3f8077;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Contact</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;color:#101828;">
                <tr><td style="padding:6px 0;color:#667085;width:120px;">Name</td><td style="padding:6px 0;">${escapeHtml(customerName) || '—'}</td></tr>
                <tr><td style="padding:6px 0;color:#667085;">Email</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(customerEmail)}" style="color:#3f8077;text-decoration:none;">${escapeHtml(customerEmail) || '—'}</a></td></tr>
                <tr><td style="padding:6px 0;color:#667085;">Company</td><td style="padding:6px 0;">${escapeHtml(company) || '—'}</td></tr>
                <tr><td style="padding:6px 0;color:#667085;">Source</td><td style="padding:6px 0;">${escapeHtml(source) || '—'}</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 8px 32px;">
              <p style="margin:0 0 12px 0;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#3f8077;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Commitment &amp; pricing</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;border:1px solid #e4e7ec;">
                <tr>
                  <td style="padding:16px 18px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#101828;">
                      <tr><td style="padding:4px 0;color:#667085;">Hours</td><td style="padding:4px 0;text-align:right;font-weight:600;">${escapeHtml(selectedCommitment) || '—'}</td></tr>
                      <tr><td style="padding:4px 0;color:#667085;">Billing</td><td style="padding:4px 0;text-align:right;">${escapeHtml(billingLabel) || '—'}</td></tr>
                      <tr><td style="padding:4px 0;color:#667085;">Tier</td><td style="padding:4px 0;text-align:right;">${escapeHtml(supportLabel) || '—'}</td></tr>
                      <tr><td style="padding:4px 0;color:#667085;">Rate</td><td style="padding:4px 0;text-align:right;">$${escapeHtml(effectiveRate)}/hr</td></tr>
                      <tr><td style="padding:8px 0 4px 0;color:#667085;border-top:1px solid #e4e7ec;">${escapeHtml(totalLabel) || 'Total'}</td><td style="padding:8px 0 4px 0;text-align:right;font-size:18px;font-weight:700;color:#101828;border-top:1px solid #e4e7ec;">$${escapeHtml(monthlyTotal)}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 24px 32px;">
              <p style="margin:0 0 10px 0;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#3f8077;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Project brief</p>
              <div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.55;color:#344054;background:#fafbfc;border:1px solid #e4e7ec;border-radius:10px;padding:16px 18px;">${safeBrief || '<span style="color:#98a2b3;">No brief provided.</span>'}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px 32px;">
              <p style="margin:0 0 8px 0;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#667085;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Stripe</p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#475467;font-family:ui-monospace,Menlo,Monaco,'Courier New',monospace;">Session: ${escapeHtml(sessionId) || '—'}<br/>Subscription: ${escapeHtml(subscriptionId) || '—'}</p>
              <p style="margin:16px 0 0 0;font-size:13px;line-height:1.5;color:#667085;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                <a href="${capabilitiesUrl}" style="color:#3f8077;text-decoration:underline;">Capabilities page</a>
                ·
                <a href="https://dashboard.stripe.com" style="color:#3f8077;text-decoration:underline;">Stripe Dashboard</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;background:#f8fafc;border-top:1px solid #eef2f6;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#98a2b3;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">This message was sent automatically when <code style="font-size:11px;background:#eef2f6;padding:2px 6px;border-radius:4px;">checkout.session.completed</code> fired for a retainer checkout.</p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0 0;font-size:12px;color:#98a2b3;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Manifest FTS · Forward thinking digital solutions</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildCustomerPlainText(fields, origin) {
  const { customerName, selectedCommitment, billingLabel, totalLabel, monthlyTotal } = fields;
  const name = customerName ? `${customerName},` : 'Hi there,';
  return [
    `${name}`,
    '',
    'Thank you for choosing support with Manifest FTS.',
    '',
    `Billing: ${billingLabel || 'N/A'}`,
    `Your commitment: ${selectedCommitment || 'N/A'}`,
    `${totalLabel || 'Total'}: $${monthlyTotal || 'N/A'}`,
    '',
    'We received your project brief and will follow up with next steps shortly.',
    '',
    `Learn more: ${origin}/capabilities`,
    '',
    'Questions? Reply to this email or write to hello@manifestfts.com.',
    '',
    '— Manifest FTS',
  ].join('\n');
}

function buildCustomerHtml(fields, origin) {
  const logoUrl = `${DEFAULT_SITE_ORIGIN}/assets/imgs/logo.svg`;
  const capabilitiesUrl = `${origin}/capabilities`;
  const { customerName, selectedCommitment, billingLabel, totalLabel, monthlyTotal, brief } = fields;
  const greeting = customerName ? `Hi ${escapeHtml(customerName)},` : 'Hi there,';
  const priceSuffix = totalLabel === 'Monthly total' ? ' / month' : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e7ec;">
          <tr>
            <td style="padding:28px 32px 20px 32px;text-align:center;border-bottom:1px solid #eef2f6;">
              <img src="${logoUrl}" width="160" height="24" alt="Manifest FTS" style="display:inline-block;border:0;max-width:160px;height:auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px 32px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
              <p style="margin:0 0 8px 0;font-size:17px;line-height:1.5;color:#101828;">${greeting}</p>
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#475467;">Thank you for choosing support with Manifest FTS. Your checkout is confirmed and we&rsquo;re reviewing your next steps.</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;border:1px solid #e4e7ec;margin-bottom:16px;">
                <tr>
                  <td style="padding:18px 20px;font-size:15px;color:#101828;">
                    <strong style="display:block;margin-bottom:8px;">Your selection</strong>
                    <span style="display:block;margin-bottom:6px;color:#667085;">${escapeHtml(billingLabel) || 'Support purchase'}</span>
                    ${escapeHtml(selectedCommitment) || '—'}<br/>
                    <span style="font-size:20px;font-weight:700;color:#3f8077;margin-top:8px;display:inline-block;">$${escapeHtml(monthlyTotal)}<span style="font-size:14px;font-weight:500;color:#667085;">${escapeHtml(priceSuffix)}</span></span>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#475467;">We&apos;ll review your brief and follow up with onboarding and scheduling details.</p>
              <p style="margin:0 0 20px 0;font-size:14px;line-height:1.5;color:#667085;">Brief on file: ${brief ? '<span style="color:#344054;">' + escapeHtml(brief.length > 200 ? `${brief.slice(0, 200)}…` : brief) + '</span>' : '<span style="color:#98a2b3;">Not provided</span>'}</p>
              <a href="${capabilitiesUrl}" style="display:inline-block;padding:12px 22px;background:#101828;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">View capabilities</a>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px 32px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;border-top:1px solid #eef2f6;background:#fafbfc;">
              <p style="margin:0;font-size:13px;line-height:1.55;color:#667085;">Questions? Email <a href="mailto:hello@manifestfts.com" style="color:#3f8077;">hello@manifestfts.com</a>.</p>
            </td>
          </tr>
        </table>
        <p style="margin:14px 0 0 0;font-size:11px;color:#98a2b3;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">You may also receive a receipt from Stripe for this checkout.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * @param {import('stripe').Stripe.Checkout.Session} session
 */
export function buildInternalRetainerSubscriptionEmail(session) {
  const origin = normalizeOrigin();
  const fields = extractSessionFields(session);
  return {
    subject: 'New retainer checkout · Manifest FTS',
    text: buildInternalPlainText(fields),
    html: buildInternalHtml(fields, origin),
  };
}

/**
 * Customer-facing confirmation (optional; send only when env allows).
 * @param {import('stripe').Stripe.Checkout.Session} session
 */
export function buildCustomerRetainerConfirmationEmail(session) {
  const origin = normalizeOrigin();
  const fields = extractSessionFields(session);
  return {
    subject: 'Your Manifest FTS support is confirmed',
    text: buildCustomerPlainText(fields, origin),
    html: buildCustomerHtml(fields, origin),
  };
}

const DEFAULT_SITE_ORIGIN = 'https://www.manifestfts.com';

const TRACKED_LINKS = {
  partnerPortal:
    'https://portal.hellobonsai.com/u/manifestfts/client/new?utm_source=mailjet&utm_medium=email&utm_campaign=partner_portal',
  consult:
    'https://meetings.hubspot.com/devkev?utm_source=mailjet&utm_medium=email&utm_campaign=partner_update',
  caseStudy:
    'https://www.manifestfts.com/case-study/nc-waterfalls?utm_source=mailjet&utm_medium=email&utm_campaign=partner_workflow_update',
};

function escapeHtml(value) {
  const s = String(value ?? '');
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function joinLinesAsHtml(lines) {
  return lines
    .filter(Boolean)
    .map((line) => `<p style="margin:0 0 12px 0;font-size:15px;line-height:1.7;color:#344054;">${escapeHtml(line)}</p>`)
    .join('');
}

function listAsHtml(items) {
  return items
    .filter(Boolean)
    .map(
      (item) =>
        `<tr><td style="padding:0 0 8px 0;vertical-align:top;"><span style="display:inline-block;margin-right:8px;color:#0f766e;">•</span><span style="font-size:14px;line-height:1.65;color:#344054;">${escapeHtml(
          item
        )}</span></td></tr>`
    )
    .join('');
}

function sectionCard(title, contentHtml) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e4e7ec;border-radius:12px;margin:0 0 14px 0;">
    <tr>
      <td style="padding:14px 16px;">
        <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#0f766e;font-weight:700;">${escapeHtml(
          title
        )}</p>
        ${contentHtml}
      </td>
    </tr>
  </table>`;
}

function ctaButton(label, href, isPrimary) {
  const background = isPrimary ? '#101828' : '#ffffff';
  const border = isPrimary ? '#101828' : '#d0d5dd';
  const color = isPrimary ? '#ffffff' : '#344054';

  return `<a href="${href}" style="display:inline-block;padding:11px 16px;margin:0 8px 8px 0;border-radius:9px;border:1px solid ${border};background:${background};color:${color};font-size:13px;font-weight:600;text-decoration:none;">${escapeHtml(
    label
  )}</a>`;
}

function buildShell({
  preheader,
  eyebrow,
  title,
  greeting,
  introLines,
  sectionsHtml,
  signatureName,
  signatureTitle,
}) {
  const logoUrl = `${DEFAULT_SITE_ORIGIN}/assets/imgs/logo.svg`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
</head>
<body style="margin:0;padding:0;background:#f3f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;background:#f3f6f8;">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 10px 28px rgba(15,23,42,0.08);">
          <tr>
            <td style="padding:26px 30px 18px;background:linear-gradient(145deg,#eef7f5 0%,#ffffff 72%);border-bottom:1px solid #edf1f5;">
              <img src="${logoUrl}" width="172" height="26" alt="Manifest FTS" style="display:block;border:0;max-width:172px;height:auto;" />
              <p style="margin:14px 0 0;font-size:11px;letter-spacing:0.11em;text-transform:uppercase;color:#0f766e;font-weight:700;">${escapeHtml(
                eyebrow
              )}</p>
              <h1 style="margin:8px 0 0;font-size:28px;line-height:1.2;color:#0f172a;font-weight:700;letter-spacing:-0.02em;">${escapeHtml(
                title
              )}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 30px 24px;">
              <p style="margin:0 0 14px 0;font-size:16px;line-height:1.6;color:#111827;">${escapeHtml(greeting)}</p>
              ${joinLinesAsHtml(introLines)}
              ${sectionsHtml}
              <p style="margin:18px 0 0;font-size:15px;line-height:1.7;color:#344054;">Thank you,<br><strong>${escapeHtml(
                signatureName
              )}</strong><br>${escapeHtml(signatureTitle)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 30px;background:#f8fafc;border-top:1px solid #edf1f5;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#98a2b3;">You are receiving this update from Manifest FTS. Reply directly to this email for support requests or urgent project questions.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildMailjetCeoShortformTemplate(options = {}) {
  const recipientName = options.recipientName || 'Partner';
  const subject = options.subject || 'Quick update from Kevin';
  const headline = options.headline || 'Quick partner update';
  const summary =
    options.summary ||
    'Short note to keep everything moving with clean communication, less friction, and clear next steps.';
  const focusItems = Array.isArray(options.focusItems) ? options.focusItems : [];

  const sectionsHtml = [
    sectionCard('Current Focus', joinLinesAsHtml([summary])),
    focusItems.length
      ? sectionCard('What this means right now', `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${listAsHtml(focusItems)}</table>`)
      : '',
    sectionCard(
      'Quick Actions',
      `<p style="margin:0 0 10px 0;font-size:14px;line-height:1.65;color:#475467;">Pick the option that helps you move fastest:</p>
       ${ctaButton('Open Partner Portal', TRACKED_LINKS.partnerPortal, true)}
       ${ctaButton('Need a consult?', TRACKED_LINKS.consult, false)}
       ${ctaButton('Recent case study', TRACKED_LINKS.caseStudy, false)}`
    ),
  ].join('');

  const html = buildShell({
    preheader: summary,
    eyebrow: 'Direct from Kevin',
    title: headline,
    greeting: `Hi ${recipientName},`,
    introLines: [
      'I wanted to send a quick direct update so you have clarity on what is changing and what to do next.',
    ],
    sectionsHtml,
    signatureName: 'Kevin Williams',
    signatureTitle: 'CEO, Manifest FTS',
  });

  const text = [
    `Hi ${recipientName},`,
    '',
    summary,
    '',
    focusItems.length ? 'What this means right now:' : '',
    ...focusItems.map((item) => `- ${item}`),
    '',
    'Quick actions:',
    `Partner Portal: ${TRACKED_LINKS.partnerPortal}`,
    `Need a consult? ${TRACKED_LINKS.consult}`,
    `Recent case study: ${TRACKED_LINKS.caseStudy}`,
    '',
    'Thank you,',
    'Kevin Williams',
    'CEO, Manifest FTS',
  ]
    .filter(Boolean)
    .join('\n');

  return { subject, text, html };
}

export function buildMailjetBonsaiTransitionFromKevinTemplate(options = {}) {
  const recipientName = options.recipientName || 'Partner';
  const subject = options.subject || 'Transitioning task management from BugHerd to Bonsai';

  const toDoStatuses = ['Backlog / Blocked (unapproved tasks)', 'Ready to Start'];
  const inProgressStatuses = ['Actively Working', 'Ready for QA (internal quality assurance)'];
  const doneStatuses = [
    'Ready for UAT (ready for client/partner review)',
    'Deployed Live (reviewed and approved, then pushed to production)',
  ];

  const sectionsHtml = [
    sectionCard(
      'Why this change',
      joinLinesAsHtml([
        'Over the next month or two, I am gradually transitioning project and task management from BugHerd into Bonsai for a simpler, more reliable workflow.',
        'This helps centralize tasks, communication, proposals, invoicing, and project visibility in one place.',
        'A few partners have run into occasional BugHerd issues, and many clients were not actively using the BugHerd Chrome extension for visual feedback.',
      ])
    ),
    sectionCard(
      'What to expect',
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${listAsHtml([
        'Bonsai will become the preferred platform for task and project management.',
        'Older BugHerd items will be phased over gradually.',
        'Email is still completely fine if that is most comfortable.',
        'Whenever possible, please log tasks/issues in Bonsai so secondary engineers can support urgent requests when needed.',
      ])}</table>`
    ),
    sectionCard(
      'Bonsai board structure (3 columns)',
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${listAsHtml([
        'To Do',
        'In Progress',
        'Done',
      ])}</table>`
    ),
    sectionCard(
      'Status tags to mirror BugHerd workflow',
      `<p style="margin:0 0 8px 0;font-size:13px;font-weight:600;color:#344054;">To Do column:</p>
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 10px 0;">${listAsHtml(
         toDoStatuses
       )}</table>
       <p style="margin:0 0 8px 0;font-size:13px;font-weight:600;color:#344054;">In Progress column:</p>
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 10px 0;">${listAsHtml(
         inProgressStatuses
       )}</table>
       <p style="margin:0 0 8px 0;font-size:13px;font-weight:600;color:#344054;">Done column:</p>
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${listAsHtml(doneStatuses)}</table>
       <p style="margin:10px 0 0 0;font-size:13px;line-height:1.6;color:#475467;">Completed/deployed tasks can still be reviewed any time via <strong>Filter -> Archived</strong>.</p>`
    ),
    sectionCard(
      'Quick Actions',
      `${ctaButton('Join Partner Portal', TRACKED_LINKS.partnerPortal, true)}
       ${ctaButton('Schedule a consult', TRACKED_LINKS.consult, false)}
       ${ctaButton('See recent workflow case study', TRACKED_LINKS.caseStudy, false)}`
    ),
  ].join('');

  const html = buildShell({
    preheader:
      'Manifest FTS is moving task management from BugHerd to Bonsai for clearer collaboration and project visibility.',
    eyebrow: 'Partner Workflow Update',
    title: 'BugHerd to Bonsai transition',
    greeting: `Hi ${recipientName},`,
    introLines: [
      'Quick heads up on an upcoming workflow update so everyone stays aligned.',
    ],
    sectionsHtml,
    signatureName: 'Kevin Williams',
    signatureTitle: 'CEO, Manifest FTS',
  });

  const text = [
    `Hi ${recipientName},`,
    '',
    'Quick heads up: over the next month or two, I am transitioning project/task management from BugHerd into Bonsai.',
    '',
    'Why this change:',
    '- Simpler workflow across tasks, communication, proposals, invoicing, and visibility.',
    '- Fewer issues than what some partners experienced in BugHerd.',
    '- Better handoff coverage when I am unavailable.',
    '',
    'Bonsai board structure:',
    '- To Do',
    '- In Progress',
    '- Done',
    '',
    'Status tags:',
    '- To Do: Backlog / Blocked, Ready to Start',
    '- In Progress: Actively Working, Ready for QA',
    '- Done: Ready for UAT, Deployed Live',
    '',
    'Completed/deployed tasks remain accessible via Filter -> Archived.',
    '',
    'Quick actions:',
    `Partner Portal: ${TRACKED_LINKS.partnerPortal}`,
    `Need a consult? ${TRACKED_LINKS.consult}`,
    `Recent case study: ${TRACKED_LINKS.caseStudy}`,
    '',
    'Thank you,',
    'Kevin Williams',
    'CEO, Manifest FTS',
  ].join('\n');

  return { subject, text, html };
}

export function buildMailjetPartnerDigestTemplate(options = {}) {
  const recipientName = options.recipientName || 'Partner';
  const subject = options.subject || 'Manifest FTS Partner Digest';
  const periodLabel = options.periodLabel || 'Monthly Digest';
  const summary =
    options.summary ||
    'Here is a concise update on project momentum, important launches, and where we can align next.';

  const highlights = Array.isArray(options.highlights) ? options.highlights : [];
  const priorities = Array.isArray(options.priorities) ? options.priorities : [];
  const blockers = Array.isArray(options.blockers) ? options.blockers : [];

  const sectionsHtml = [
    sectionCard('Digest Summary', joinLinesAsHtml([summary])),
    highlights.length
      ? sectionCard('Highlights', `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${listAsHtml(highlights)}</table>`)
      : '',
    priorities.length
      ? sectionCard('Next Priorities', `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${listAsHtml(priorities)}</table>`)
      : '',
    blockers.length
      ? sectionCard('Needs Input', `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${listAsHtml(blockers)}</table>`)
      : '',
    sectionCard(
      'Recommended Actions',
      `<p style="margin:0 0 10px 0;font-size:14px;line-height:1.65;color:#475467;">Use these links to keep momentum high between updates:</p>
      ${ctaButton('Open Partner Portal', TRACKED_LINKS.partnerPortal, true)}
      ${ctaButton('Book a strategy consult', TRACKED_LINKS.consult, false)}
      ${ctaButton('Read latest case study', TRACKED_LINKS.caseStudy, false)}`
    ),
  ]
    .filter(Boolean)
    .join('');

  const html = buildShell({
    preheader: `${periodLabel}: ${summary}`,
    eyebrow: 'Partner Digest',
    title: periodLabel,
    greeting: `Hi ${recipientName},`,
    introLines: ['Thanks for your continued partnership. Here is your latest digest update.'],
    sectionsHtml,
    signatureName: 'Kevin Williams',
    signatureTitle: 'CEO, Manifest FTS',
  });

  const text = [
    `Hi ${recipientName},`,
    '',
    `${periodLabel}`,
    summary,
    '',
    highlights.length ? 'Highlights:' : '',
    ...highlights.map((item) => `- ${item}`),
    '',
    priorities.length ? 'Next Priorities:' : '',
    ...priorities.map((item) => `- ${item}`),
    '',
    blockers.length ? 'Needs Input:' : '',
    ...blockers.map((item) => `- ${item}`),
    '',
    'Recommended actions:',
    `Partner Portal: ${TRACKED_LINKS.partnerPortal}`,
    `Need a consult? ${TRACKED_LINKS.consult}`,
    `Recent case study: ${TRACKED_LINKS.caseStudy}`,
    '',
    'Thank you,',
    'Kevin Williams',
    'CEO, Manifest FTS',
  ]
    .filter(Boolean)
    .join('\n');

  return { subject, text, html };
}

export { TRACKED_LINKS };
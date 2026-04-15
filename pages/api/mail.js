import {
  buildCustomerFreeWebsiteConfirmationEmail,
  buildInternalFreeWebsiteIntakeEmail,
} from "../../lib/email/freeWebsiteIntakeEmails";

const SMTP2GO_API_URL = "https://api.smtp2go.com/v3";
const SMTP2GO_API_KEY = process.env.SMTP2GO_API_KEY;

async function sendSmtp2GoEmail({ to, cc, subject, textBody, htmlBody }) {
  const payload = {
    api_key: SMTP2GO_API_KEY,
    to,
    sender: "noreply@manifestfts.com",
    subject,
    text_body: textBody,
    html_body: htmlBody,
  };

  if (Array.isArray(cc) && cc.length > 0) {
    payload.cc = cc;
  }

  const response = await fetch(`${SMTP2GO_API_URL}/email/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok || result.data?.error) {
    const error = new Error("SMTP2GO API request failed");
    error.response = result;
    throw error;
  }

  return result;
}

async function sendEmail(req, res) {
  // Validate that SMTP2GO API key is configured
  if (!SMTP2GO_API_KEY) {
    console.error("SMTP2GO_API_KEY environment variable is not set");
    return res.status(500).json({
      error: "Email service is not properly configured. Please contact support.",
    });
  }

  const { body } = req;

  let message = "";
  let subject = "New Lead from Manifest FTS";

  // Check the form type to determine which form was submitted
  if (body.formType === "getQuote") {
    // Handle "Get a Quote" form
    message = `
      Name: ${body.fullname}\r\n
      Email: ${body.email}\r\n
      Phone: ${body.phone}\r\n
      Company: ${body.company || "N/A"}\r\n
      Message: ${body.message}
    `;
    subject = "New Project Inquiry - Manifest FTS";
  } else if (body.formType === "wordpressHosting") {
    // Handle "WordPress Hosting" form
    message = `
      Name: ${body.name}\r\n
      Email: ${body.email}\r\n
      Phone: ${body.phone || "N/A"}\r\n
      Website URL: ${body.websiteUrl || "N/A"}\r\n
      Selected Plan: ${body.selectedPlan || "N/A"}\r\n
      Services: ${body.services || "N/A"}\r\n
      Multiple Sites: ${body.multipleSites || "N/A"}\r\n
      Message: ${body.message}
    `;
    subject = "New WordPress Hosting Inquiry - Manifest FTS";
  } else if (body.formType === "freeWebsiteIntake") {
    try {
      const internalEmail = buildInternalFreeWebsiteIntakeEmail(body);
      await sendSmtp2GoEmail({
        to: ["hello@manifestfts.com"],
        cc: ["mdm@manifestfts.com"],
        subject: internalEmail.subject,
        textBody: internalEmail.text,
        htmlBody: internalEmail.html,
      });

      const customerEmailAddress =
        typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      let sentConfirmation = false;

      if (customerEmailAddress) {
        try {
          const customerEmail = buildCustomerFreeWebsiteConfirmationEmail(body);
          await sendSmtp2GoEmail({
            to: [customerEmailAddress],
            subject: customerEmail.subject,
            textBody: customerEmail.text,
            htmlBody: customerEmail.html,
          });
          sentConfirmation = true;
        } catch (confirmationError) {
          console.error(
            "Customer confirmation email failed for free website intake:",
            confirmationError
          );
        }
      }

      return res.status(200).json({
        status: "Ok",
        sentConfirmation,
      });
    } catch (error) {
      console.error("Error sending free website intake emails via SMTP2GO:", error);
      return res.status(500).json({
        error: "Failed to send email. Please try again later.",
      });
    }
  } else {
    return res.status(400).json({ error: "Invalid form data" });
  }

  try {
    await sendSmtp2GoEmail({
      to: ["hello@manifestfts.com"],
      subject,
      textBody: message,
      htmlBody: message.replace(/\r\n/g, "<br>"),
    });

    return res.status(200).json({ status: "Ok" });
  } catch (error) {
    console.error("Error sending email via SMTP2GO:", error);
    return res.status(500).json({
      error: "Failed to send email. Please try again later.",
    });
  }
}

export default sendEmail;

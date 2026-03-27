const SMTP2GO_API_URL = "https://api.smtp2go.com/v3";
const SMTP2GO_API_KEY = process.env.SMTP2GO_API_KEY;

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
    // Handle "Free Website Intake" form
    message = `
      Contact Name: ${body.name || body.contactName || "N/A"}\r\n
      Business Name: ${body.businessName || "N/A"}\r\n
      Email: ${body.email || "N/A"}\r\n
      Phone: ${body.phone || "N/A"}\r\n
      Selected Plan: ${body.selectedPlan || "N/A"}\r\n
      Business Category: ${body.businessCategory || "N/A"}\r\n
      Service Area: ${body.serviceArea || "N/A"}\r\n
      Website Status: ${body.websiteStatus || "N/A"}\r\n
      Desired Pages: ${body.desiredPages || "N/A"}\r\n
      Primary Goal: ${body.primaryGoal || "N/A"}\r\n
      Services Offered: ${body.servicesOffered || "N/A"}\r\n
      Preferred Style/Tone: ${body.preferredStyleTone || "N/A"}\r\n
      Social Links: ${body.socialLinks || "N/A"}\r\n
      Google Business Profile Status: ${body.googleBusinessProfileStatus || "N/A"}\r\n
      Domain Status: ${body.domainStatus || "N/A"}\r\n
      Logo Status: ${body.logoStatus || "N/A"}\r\n
      Image Upload Notes: ${body.imageUploadNotes || "N/A"}\r\n
      Preferred Onboarding Date: ${body.preferredDate || "N/A"}\r\n
      Preferred Onboarding Time: ${body.preferredTime || "N/A"}\r\n
      Timezone: ${body.timezone || "N/A"}\r\n
      Contact Preference: ${body.contactPreference || "N/A"}\r\n

      Upgrade Interests:
      - Advanced SEO: ${body.upgradeAdvancedSEO ? "Yes" : "No"}\r\n
      - Copywriting/Content Help: ${body.upgradeCopywriting ? "Yes" : "No"}\r\n
      - Blog/Content Strategy: ${body.upgradeBlogStrategy ? "Yes" : "No"}\r\n
      - Domain/Email Setup: ${body.upgradeDomainEmail ? "Yes" : "No"}\r\n
      - Hosting/Maintenance: ${body.upgradeHostingMaintenance ? "Yes" : "No"}\r\n
      - Custom Design/Features: ${body.upgradeCustomFeatures ? "Yes" : "No"}\r\n
      Notes/Special Requests: ${body.notesSpecialRequests || "N/A"}
    `;
    subject = "New Free Website Intake - Manifest FTS";
  } else {
    return res.status(400).json({ error: "Invalid form data" });
  }

  try {
    const emailPayload = {
      api_key: SMTP2GO_API_KEY,
      to: ["hello@manifestfts.com"],
      sender: "noreply@manifestfts.com",
      subject: subject,
      text_body: message,
      html_body: message.replace(/\r\n/g, "<br>"),
    };

    const response = await fetch(`${SMTP2GO_API_URL}/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const result = await response.json();

    if (!response.ok || result.data?.error) {
      console.error("SMTP2GO API error:", result);
      return res.status(500).json({
        error: "Failed to send email. Please try again later.",
      });
    }

    return res.status(200).json({ status: "Ok" });
  } catch (error) {
    console.error("Error sending email via SMTP2GO:", error);
    return res.status(500).json({
      error: "Failed to send email. Please try again later.",
    });
  }
}

export default sendEmail;

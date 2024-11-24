import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY);

async function sendEmail(req, res) {
  const { body } = req;

  let message = '';

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
  } else if (body.formType === "wordpressHosting") {
    // Handle "WordPress Hosting" form
    message = `
      Name: ${body.name}\r\n
      Email: ${body.email}\r\n
      Phone: ${body.phone || "N/A"}\r\n
      Website URL: ${body.websiteUrl || "N/A"}\r\n
      Selected Plan: ${body.selectedPlan || "N/A"}\r\n
      Message: ${body.message}
    `;
  } else {
    return res.status(400).json({ error: "Invalid form data" });
  }

  try {
    await sendgrid.send({
      to: "hello@manifestfts.com",
      from: "noreply@manifestfts.com",
      subject: "New Lead from Manifest FTS",
      text: message,
      html: message.replace(/\r\n/g, "<br>"),
    });
    return res.status(200).json({ status: "Ok" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}

export default sendEmail;

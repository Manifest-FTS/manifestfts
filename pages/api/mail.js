import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY);

async function sendEmail(req, res) {
  // NOTE: Uncomment the below lines to make the code work

  const message = `
  Name: ${req.body.fullname}\r\n
  Email: ${req.body.email}\r\n
  Phone: ${req.body.phone}\r\n
  Company: ${req.body.company}\r\n
  Message: ${req.body.message}
  `;

  try {
    await sendgrid.send({
      to: "partner@manifestfts.com",
      from: "noreply@manifestfts.com",
      subject: "New Manifest Lead",
      text: message,
      html: message.replace(/\r\n/g, "<br>"),
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  res.status(200).json({ status: "Ok" });
}

export default sendEmail;

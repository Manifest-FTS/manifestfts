// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const mail= require('@sendgrid/mail');

mail.setApiKey(process.env.SENDGRID_API_KEY);


export default function handler(req, res) {
  const body = JSON.parse(req.body);

  const message = `
  Name: ${body.fullname}\r\n
  Email: ${body.email}\r\n
  Phone: ${body.phone}\r\n
  Company: ${body.company}\r\n
  Message: ${body.message}
  `
  ;

  const data = {
    to: "partner@manifestfts.com",
    from: "partner@manifestfts.com",
    subject: "New Manifest Lead",
    text: message,
    html: message.replace(/\r\n/g, "<br>")
  };

  mail.send(data);

  res.status(200).json({ status: 'Ok' })
}

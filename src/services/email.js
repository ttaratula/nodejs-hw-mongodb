import nodemailer from "nodemailer";
import "dotenv/config";

async function sendEmail({ to, subject, html, text }) {
  try {
    const transporter = nodemailer.createTransport({
        host: getEnvVariable("SMTP_HOST"),
        port: Number(getEnvVariable("SMTP_PORT")),
        secure: false, 
        auth: {
          user: getEnvVariable("SMTP_LOGIN"),
          pass: getEnvVariable("SMTP_PASSWORD")
      },
    });

    const info = await transporter.sendMail({
        from: "vmudrij0508@gmail.com", 
        to: to,                 
        subject: subject,
        text: text,
        html: html,
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error sending mail:", error);
  }
}

export default sendEmail;




import nodemailer from "nodemailer";
import "dotenv/config";

import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import  User from '../models/user.js'; 
import { getEnvVar } from '../utils/getEnvVar.js';
// import { sendEmail } from '../utils/sendMail.js';
import { SMTP, TEMPLATES_DIR } from '../index.js';

export async function sendEmail({ to, subject, html, text }) {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP.SMTP_HOST,
      port: SMTP.SMTP_PORT,
      secure: SMTP.SMTP_SECURE,
      auth: {
        user: SMTP.SMTP_USER,
        pass: SMTP.SMTP_PASS,
      },
    });

    const info = await transporter.sendEmail({
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

// export default sendEmail;


// Надсилання листа
export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    { sub: user._id, email },
    getEnvVar('JWT_SECRET'),
    { expiresIn: '5m' }
  );

  const templatePath = path.join(TEMPLATES_DIR, 'reset-password-email.html');
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  const template = handlebars.compile(templateSource);

  const html = template({
    name: User.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

// Зміна пароля
export const resetPassword = async ({ token, password }) => {
  let payload;
  try {
    payload = jwt.verify(token, getEnvVar('JWT_SECRET'));
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({
    _id: payload.sub,
    email: payload.email,
  });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.updateOne({ _id: user._id }, { password: hashedPassword });

};



import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import  User  from "../models/user.js";
import {sendEmail} from "../services/email.js";

export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw createHttpError(400, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, "User not found!");
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password (valid for 5 minutes):</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
      text: `You requested a password reset.\nClick the link below to reset your password (valid for 5 minutes):\n${resetLink}`
    });

    res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
    });
  } catch (error) {
    next(error);
  }
};

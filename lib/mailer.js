// lib/mailer.js
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // e.g. smtp.gmail.com
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,                      // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,     // Your email address
    pass: process.env.SMTP_PASS,     // App password or email password
  },
});

export const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Horizon ebooks" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
    html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
  });
};

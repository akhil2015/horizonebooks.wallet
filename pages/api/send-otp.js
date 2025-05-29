// pages/api/send-otp.js
import redis from "@/lib/redis";
import { sendOtpEmail } from "@/lib/mailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Valid email required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Store OTP in Redis with a 5-minute expiry
    await redis.set(`otp:${email}`, otp, { EX: 300 });
    console.log(`OTP for ${email}: ${otp}`); // For debugging, remove in production
    // Send email
    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
}

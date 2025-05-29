// pages/api/verify-otp.js
import redis from "@/lib/redis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (storedOtp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    await redis.del(`otp:${email}`); // One-time use

    return res.status(200).json({ message: "OTP verified" });
  } catch (err) {
    console.error("OTP verification failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// pages/api/wallet/transactions.js
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("walletDB");

    const transactions = await db
      .collection("transactions")
      .find({ email })
      .sort({ date: -1 })
      .toArray();

    return res.status(200).json({ transactions });
  } catch (error) {
    console.error("MongoDB error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

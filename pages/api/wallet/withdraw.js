// pages/api/wallet/deposit.js
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { email, amount, transakOrderId } = req.body;

  if (!email || !amount || !transakOrderId) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const transaction = {
    email,
    type: "Withdraw",
    amount: parseFloat(amount),
    transakOrderId,
    date: new Date(),
  };

  try {
    const client = await clientPromise;
    const db = client.db("walletDB");
    await db.collection("transactions").insertOne(transaction);
    return res.status(200).json({ success: true, transaction });
  } catch (error) {
    console.error("Mongo Error:", error);
    return res.status(500).json({ message: "Database error" });
  }
}

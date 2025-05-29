// pages/api/wallet/balance.js
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const client = await clientPromise;
    const db = client.db("walletDB");

    // Sum deposits
    const depositsAgg = await db
      .collection("transactions")
      .aggregate([
        { $match: { email, type: "Deposit" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])
      .toArray();

    // Sum withdrawals
    const withdrawalsAgg = await db
      .collection("transactions")
      .aggregate([
        { $match: { email, type: "Withdraw" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])
      .toArray();

    const totalDeposits = depositsAgg[0]?.total || 0;
    const totalWithdrawals = withdrawalsAgg[0]?.total || 0;

    const balance = totalDeposits - totalWithdrawals;

    return res.status(200).json({ balance });
  } catch (error) {
    console.error("MongoDB error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

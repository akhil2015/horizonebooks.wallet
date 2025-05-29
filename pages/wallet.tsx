/* eslint-disable  @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { Transak, TransakConfig } from "@transak/transak-sdk";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import axios from "axios";

const PAYMENT_ADDRESS = "0x3Bba40011a275b9aacADD1E3D7865e7687B80923"; // Replace with actual address

const Wallet: React.FC = () => {
  const { email, isLoggedIn } = useAuth();
  const router = useRouter();
  const [transakDialogOpen, setTransakDialogOpen] = useState(false);
  const [mode, setMode] = useState<"BUY" | "SELL">("BUY");
  const [isPaymentAuthorized, setIsPaymentAuthorized] = useState(false);
  const [receipt, setReceipt] = useState<any>();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);

  // Fetch transactions on load
  const fetchTransactions = async () => {
    if (!email) return;
    try {
      const res = await axios.get("/api/wallet/transactions", {
        params: { email },
      });
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };
  const fetchBalance = async () => {
    if (!email) return;
    try {
      const res = await axios.get("/api/wallet/balance", { params: { email } });
      setBalance(res.data.balance);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchTransactions();
      fetchBalance();
    }
  }, [email, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) fetchTransactions();
  }, [email, isLoggedIn]);

  const handleDeposit = () => {
    setMode("BUY");
    setTransakDialogOpen(true);
  };

  const handleWithdraw = () => {
    setMode("SELL");
    setTransakDialogOpen(true);
  };

  const transakConfig: TransakConfig = {
    apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY ?? "",
    environment: Transak.ENVIRONMENTS.STAGING,
    fiatCurrency: "USD",
    walletAddress: PAYMENT_ADDRESS,
    disableWalletAddressForm: true,
    productsAvailed: mode,
    cryptoCurrencyCode: "USDC",
    cryptoAmount: mode === "SELL" ? 50 : undefined,
    network: "base",
    email: email,
    isFeeCalculationHidden: true,
  };

  const transak = new Transak(transakConfig);
  const handleSuccess = async (orderData: any) => {
    const endpoint =mode === "BUY" ? "/api/wallet/deposit" : "/api/wallet/withdraw";
    console.log("Transaction successful:", orderData);

    try {
      await axios.post(endpoint, {
        email,
        amount: orderData.status.fiatAmount,
        transakOrderId: orderData.status.id,
      });
      await fetchBalance();
      await fetchTransactions();
    } catch (err) {
      console.error("Transaction saving failed:", err);
    }

    setIsPaymentAuthorized(false);
  };

  const handleCancel = () => {
    setTransakDialogOpen(false);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isPaymentAuthorized && receipt) {
      handleSuccess(receipt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaymentAuthorized]);

  useEffect(() => {
    if (transakDialogOpen) {
      transak.init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transakDialogOpen]);

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData: any) => {
    if (!receipt) {
      if (
        orderData.status.status === "PENDING_DELIVERY_FROM_TRANSAK" ||
        orderData.status.status === "PROCESSING"
      ) {
        setReceipt(orderData);
        setIsPaymentAuthorized(true);
      }
    }
  });

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_FAILED, () => {
    handleCancel();
  });

  Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
    transak.logoutUser();
    setTimeout(() => {
      transak.close();
      setReceipt(undefined);
      handleCancel();
    }, 1000);
  });

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 p-6 h-[600px] bg-base-300 rounded-box shadow">
        <h1 className="text-2xl font-bold mb-4">Wallet</h1>
        <div className="flex items-center justify-between mb-6">
          <span className="text-5xl font-bold">${balance.toFixed(2)}</span>
        </div>
        <div className="flex gap-4 mb-6">
          <button className="btn btn-success" onClick={handleDeposit}>
            Deposit
          </button>
          <button className="btn btn-error" onClick={handleWithdraw}>
            Withdraw
          </button>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Transactions</h2>
          <ul className="divide-y divide-base-300 overflow-y-auto max-h-[300px]">
            {transactions.length === 0 ? (
              <li className="py-4 text-center text-base-content/50">
                No transactions yet.
              </li>
            ) : (
              transactions.map((tx) => (
                <li
                  key={tx._id}
                  className="py-3 flex justify-between items-center"
                >
                  <span className="capitalize">{tx.type}</span>
                  <span
                    className={
                      tx.type === "Deposit" ? "text-success" : "text-error"
                    }
                  >
                    {tx.type === "Deposit" ? "+" : "-"}${tx.amount}
                  </span>
                  <span className="text-xs text-base-content/60">
                    {new Date(tx.date).toLocaleDateString()}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Wallet;

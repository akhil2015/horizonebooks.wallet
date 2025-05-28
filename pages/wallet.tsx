import React, { useState,useEffect } from "react";
import Navbar from "./components/Navbar";
import { Transak, TransakConfig } from "@transak/transak-sdk";

const transactions = [
  { id: 1, type: "Deposit", amount: 100, date: "2025-05-25" },
  { id: 2, type: "Withdraw", amount: 50, date: "2025-05-26" },
  // Add more transactions as needed
];
const userData = {
    fullName: "John Doe",
    email: "akhil.bh96+309@gmail.com",
    phoneNumber: {
      countryCode: "+1",
      number: "5551234567"
    },
    DOB: "1985-08-22T00:00:00Z",
    address: {
      address: "456 Elm Street",
      city: "San Francisco",
      state: "California",
      postCode: "94107"
    }
  };
  

  const PAYMENT_ADDRESS = "0x3Bba40011a275b9aacADD1E3D7865e7687B80923"; // Replace with actual address
  
const Wallet: React.FC = () => {
  const [transakDialogOpen, setTransakDialogOpen] = useState(false);
  const [mode, setMode] = useState("BUY");
  const [isPaymentAuthorized, setIsPaymentAuthorized] = useState(false);
  const [receipt, setReceipt] = useState();
  // Empty handlers
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
    // containerId: 'transakMount',
    fiatCurrency: "USD",
    walletAddress: PAYMENT_ADDRESS,
    disableWalletAddressForm: true,
    productsAvailed: mode,
    cryptoCurrencyCode: "USDC",
    cryptoAmount: mode == "SELL" ? 50 : undefined,
    network: "base",
    email: userData?.email,
    isFeeCalculationHidden: true,
    userData: {
      firstName: userData?.fullName?.split(" ")[0],
      lastName: userData?.fullName?.split(" ")[1],
      email: userData?.email,
      mobileNumber:
        userData?.phoneNumber?.countryCode + userData?.phoneNumber?.number,
      dob: userData?.DOB ? userData?.DOB?.split("T")[0] : "",
      address: userData?.address
        ? {
            addressLine1: userData?.address?.address,
            addressLine2: "",
            city: userData?.address?.city,
            state: userData?.address?.state,
            postCode: userData?.address?.postCode,
            countryCode: "US",
          }
        : {
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            postCode: "",
            countryCode: "",
          },
    },
  };

  const transak = new Transak(transakConfig);
  const handleSuccess = (receipt: any) => {
    if (mode == "BUY") {
      console.log("Deposit successful:", receipt);
    }
    if (mode == "SELL") {
      console.log("Withdraw successful:", receipt);
    }
    setIsPaymentAuthorized(false);
  };
  const handleCancel = () => {
    setTransakDialogOpen(false);
  };
  useEffect(() => {
    if (isPaymentAuthorized) {
      handleSuccess(receipt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaymentAuthorized]);

  useEffect(() => {
    if (transakDialogOpen) {
      // transak.cleanup();
      alert(mode)
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
          <span className="text-5xl font-bold text-success">$23.42</span>
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
          <ul className="divide-y divide-base-300">
            {transactions.length === 0 ? (
              <li className="py-4 text-center text-base-content/50">
                No transactions yet.
              </li>
            ) : (
              transactions.map((tx) => (
                <li
                  key={tx.id}
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
                    {tx.date}
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

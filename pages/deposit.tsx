/* eslint-disable  @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Transak, TransakConfig } from "@transak/transak-sdk";

const PAYMENT_ADDRESS = "0x3Bba40011a275b9aacADD1E3D7865e7687B80923"; // Replace with actual address

const Deposit: React.FC = () => {
  const [transakDialogOpen, setTransakDialogOpen] = useState(false);
  const [mode, setMode] = useState<"BUY" | "SELL">("BUY");
  const [isPaymentAuthorized, setIsPaymentAuthorized] = useState(false);
  const [receipt, setReceipt] = useState<any>();

  const handleDeposit = () => {
    setMode("BUY");
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
    isFeeCalculationHidden: true,
  };

  const transak = new Transak(transakConfig);
  const handleSuccess = async () => {
    setIsPaymentAuthorized(false);
  };

  const handleCancel = () => {
    setTransakDialogOpen(false);
  };

  useEffect(() => {
    if (isPaymentAuthorized && receipt) {
      handleSuccess();
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
  useEffect(() => {
    handleDeposit();
  }, []);

  return (
    <div className="min-h-screen bg-base-100">
      <button className="btn btn-success hidden" onClick={handleDeposit}>
        Deposit
      </button>
    </div>
  );
};

export default Deposit;

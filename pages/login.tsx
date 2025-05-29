/* eslint-disable  @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/router";

const Login = () => {
  const [step, setStep] = useState("email"); // "email" or "otp"
  const router = useRouter();
  const { email, setEmail, setIsLoggedIn } = useAuth();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      //   Replace this with your actual API call
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to send OTP");

      setStep("otp");
      setMessage("OTP sent to your email");
    } catch (err) {
      console.error(err);
      setMessage("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Replace this with your actual API call
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) throw new Error("Invalid OTP");

      setIsLoggedIn(true);
      router.push("/wallet");
    } catch (err) {
      console.error(err);
      setMessage("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100">
      <div className="card w-96 bg-base-300 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl font-bold">
            {step === "email" ? "Login with Email" : "Enter OTP"}
          </h2>

          {message && <p className="text-sm text-info mb-2">{message}</p>}

          <form onSubmit={step === "email" ? sendOtp : verifyOtp}>
            {step === "email" ? (
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            ) : (
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">OTP</span>
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter your OTP"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            )}

            <button className="btn btn-primary w-full" disabled={loading}>
              {loading
                ? "Please wait..."
                : step === "email"
                ? "Send OTP"
                : "Login with OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

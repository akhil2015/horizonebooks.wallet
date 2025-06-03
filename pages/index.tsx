import Navbar from "./components/Navbar";
import SwitchereWidget from "./components/Wallet/SwitchHere";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero + Switchere Widget Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-6 py-16 gap-10">
        {/* Hero Section */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl font-bold mb-4">
            Buy Crypto Instantly with SwapSender
          </h1>
          <p className="text-lg mb-6">
            Exchange fiat into top-performing digital currencies with turbo mode using SwapSender — your trusted, reliable and reputed crypto payment gateway.
          </p>
          <button className="btn btn-primary">Get Started</button>
        </div>

        {/* Switchere Widget */}
        <div className="lg:w-1/2 w-full">
          <SwitchereWidget />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-16 bg-base-200 text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-xl font-semibold mb-2">1. Choose Cryptocurrency</h3>
            <p>Select your preferred crypto and enter the amount.</p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-xl font-semibold mb-2">2. Enter Wallet Address</h3>
            <p>Provide your wallet address and proceed with the payment.</p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-xl font-semibold mb-2">3. Confirm and Receive</h3>
            <p>Make a payment and get the converted crypto to your wallet address.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
        <div className="join join-vertical w-full max-w-3xl mx-auto">
          <div className="collapse collapse-arrow join-item border border-base-300">
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium">
              Can I Buy Crypto with a Credit Card?
            </div>
            <div className="collapse-content">
              <p>
                Absolutely. You can buy crypto with credit and debit cards (simplified KYC). Use popular payment methods to your liking. No cash advance (e.g., to redeem a voucher or gift card) is required.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow join-item border border-base-300">
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium">
              How Do I Buy Crypto with a Credit Card?
            </div>
            <div className="collapse-content">
              <p>
                To buy crypto with a credit card at Switchere, create a user account (or a merchant account for businesses), complete basic info verification, use the Switchere widget to place an order, and convert fiat to crypto online.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow join-item border border-base-300">
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium">
              What Cryptocurrencies Do You Support?
            </div>
            <div className="collapse-content">
              <p>
                With Switchere, you can buy, sell, swap, send, receive, deposit, store, and HODL all trending and popular coins and tokens. The list of supported coins includes BTC, ETH, USDT, XRP, USDC, MATIC, STND, TRX, ELK, DOGE, BCH, ADA, LTC, etc.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

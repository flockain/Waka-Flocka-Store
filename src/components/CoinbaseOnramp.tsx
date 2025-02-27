import { useEffect } from 'react';

interface CoinbaseOnrampProps {
  onSuccess: () => void;
  currency: string;
}

const CoinbaseOnramp = ({ onSuccess, currency }: CoinbaseOnrampProps) => {
  const handleCoinbaseOnramp = () => {
    const baseUrl = "https://commerce.coinbase.com/onramp/";
    const redirectUrl = window.location.origin; // Redirects back to your store
    const queryParams = new URLSearchParams({
      amount: "500",
      currency: currency === "FLOCKA" ? "ETH" : "USDC", // Coinbase only supports ETH & USDC
      redirect_url: redirectUrl,
    });

    const onrampUrl = `${baseUrl}?${queryParams.toString()}`;

    // Open Coinbase Onramp in a pop-up window
    const width = 500;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const popup = window.open(
      onrampUrl,
      "Coinbase Onramp",
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`
    );

    if (!popup) {
      alert("Pop-up blocked! Please allow pop-ups for this site.");
      return;
    }

    // Monitor when the pop-up closes
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        onSuccess(); // Call the onSuccess function when the user finishes
      }
    }, 1000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Buy {currency} with Coinbase</h2>
      <p className="text-gray-600 mb-4">
        You can purchase {currency} using Coinbase Onramp with **no KYC up to $500**.
      </p>
      <button 
        className="w-full py-3 px-4 rounded font-medium bg-blue-600 text-white hover:bg-blue-700"
        onClick={handleCoinbaseOnramp}
      >
        Continue with Coinbase
      </button>
    </div>
  );
};

export default CoinbaseOnramp;

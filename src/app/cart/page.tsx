'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WalletConnectButton from '../../components/WalletConnectButton';
import PaymentProcessor from '../../components/PaymentProcessor';
import CoinbaseOnramp from '../../components/CoinbaseOnramp';
import { useCart } from '../../hooks/useCart';
import { WALLET_ADDRESS } from '../../types/storeTypes';

const FLOCKA_TOKEN_ADDRESS = "0xdc471C5C72dE413e4877CeD49B8Bd0ce72796722";

export default function CartPage(): JSX.Element {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    subtotal, 
    discount, 
    total,
    useFlockaCoin,
    setUseFlockaCoin
  } = useCart();
  
  const [checkoutStep, setCheckoutStep] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  const [showCoinbaseOnramp, setShowCoinbaseOnramp] = useState<boolean>(false);

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleWalletConnect = (address: string): void => {
    setIsWalletConnected(true);
    setWalletAddress(address);
  };

  const handlePaymentComplete = (txHash: string): void => {
    setOrderNumber(`WF-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`);
    setPaymentStatus('completed');
    setOrderPlaced(true);
    clearCart();
  };

  const handlePaymentProcessing = (): void => {
    setPaymentStatus('processing');
  };

  const handlePaymentFailed = (): void => {
    setPaymentStatus('failed');
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-black">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-md">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-gray-600">Thank you for your purchase, {customerName}.</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded mb-6">
              <h2 className="text-lg font-semibold mb-2">Order Details</h2>
              <p className="mb-1"><span className="font-medium">Order Number:</span> {orderNumber}</p>
              <p className="mb-1"><span className="font-medium">Total Amount:</span> ${formatPrice(total)}</p>
            </div>

            <div className="text-center">
              <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
                Return to Home
              </Link>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-8 border border-gray-200 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {checkoutStep === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
                <label className="flex items-center mb-3">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="usdc" 
                    checked={!useFlockaCoin} 
                    onChange={() => setUseFlockaCoin(false)} 
                    className="mr-2"
                  />
                  Pay with USDC
                </label>

                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="flocka" 
                    checked={useFlockaCoin} 
                    onChange={() => setUseFlockaCoin(true)} 
                    className="mr-2"
                  />
                  Pay with $FLOCKA (10% Discount)
                </label>

                <button 
                  onClick={() => setCheckoutStep(2)} 
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}

            {checkoutStep === 2 && (
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>

                {!isWalletConnected ? (
                  <WalletConnectButton onConnect={handleWalletConnect} />
                ) : (
                  <p className="text-green-600 font-medium">Wallet Connected: {walletAddress}</p>
                )}

                <button 
                  onClick={() => setCheckoutStep(3)} 
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  disabled={!isWalletConnected}
                >
                  Proceed to Payment
                </button>
              </div>
            )}

            {checkoutStep === 3 && (
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Complete Your Payment</h2>

                {!showCoinbaseOnramp ? (
                  <>
                    <button 
                      onClick={() => setShowCoinbaseOnramp(true)} 
                      className="w-full py-3 px-4 rounded font-medium bg-green-600 text-white hover:bg-green-700 mb-4"
                    >
                      Need {useFlockaCoin ? '$FLOCKA' : 'USDC'}? Buy with Coinbase Onramp
                    </button>

                    <PaymentProcessor 
                      amount={total} 
                      currency={useFlockaCoin ? 'FLOCKA' : 'USDC'} 
                      recipientAddress={WALLET_ADDRESS} 
                      tokenAddress={useFlockaCoin ? FLOCKA_TOKEN_ADDRESS : ''} 
                      walletAddress={walletAddress} 
                      orderNumber={orderNumber} 
                      onPaymentComplete={handlePaymentComplete} 
                      onPaymentProcessing={handlePaymentProcessing} 
                      onPaymentFailed={handlePaymentFailed} 
                    />
                  </>
                ) : (
                  <CoinbaseOnramp 
                    onSuccess={() => setShowCoinbaseOnramp(false)} 
                    currency={useFlockaCoin ? 'FLOCKA' : 'USDC'}
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

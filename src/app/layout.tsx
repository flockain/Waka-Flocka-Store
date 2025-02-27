'use client'

import { CartProvider } from '../hooks/useCart'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}

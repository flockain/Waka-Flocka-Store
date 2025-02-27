import Link from 'next/link'
import { WALLET_ADDRESS, FLOCKA_TOKEN_ADDRESS } from '../types/storeTypes'

const Footer = (): JSX.Element => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white text-black border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Waka Flocka Store</h3>
            <p className="mb-4">
              The official store for all Waka Flocka merchandise and bookings.
            </p>
            <p className="text-sm">
              &copy; {currentYear} Waka Flocka. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/category/merchandise" className="hover:underline">
                  Merchandise
                </Link>
              </li>
              <li>
                <Link href="/category/features" className="hover:underline">
                  Song Features
                </Link>
              </li>
              <li>
                <Link href="/category/studio" className="hover:underline">
                  Studio Sessions
                </Link>
              </li>
              <li>
                <Link href="/category/concerts" className="hover:underline">
                  Concert Bookings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Payment Information</h3>
            <p className="mb-2">
              We accept payments in USDC and $FLOCKA tokens.
            </p>
            <p className="mb-2">
              Get 10% off when you pay with $FLOCKA!
            </p>
            <div className="mt-4">
              <p className="text-sm mb-1">Payment Wallet:</p>
              <p className="text-xs break-all bg-gray-100 p-2 rounded">
                {WALLET_ADDRESS}
              </p>
            </div>
            <div className="mt-2">
              <p className="text-sm mb-1">$FLOCKA Token:</p>
              <p className="text-xs break-all bg-gray-100 p-2 rounded">
                {FLOCKA_TOKEN_ADDRESS}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

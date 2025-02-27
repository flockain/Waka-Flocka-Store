'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CartIcon from './icons/CartIcon'
import { useCart } from '../hooks/useCart'

const Header = (): JSX.Element => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const pathname = usePathname()
  const { cartItems } = useCart()
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Merchandise', href: '/merchandise' }, // Changed from /category/merchandise
  { name: 'Song Features', href: '/features' },  // Changed from /category/features
  { name: 'Studio Sessions', href: '/studio' },  // Changed from /category/studio
  { name: 'Concert Bookings', href: '/concerts' }, // Changed from /category/concerts
  { name: 'Admin', href: '/admin' },
]

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="bg-white text-black shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Waka Flocka Store
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-gray-600 ${
                  pathname === link.href ? 'font-bold' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Cart Icon */}
          <Link href="/cart" className="relative">
            <CartIcon />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 hover:text-gray-600 ${
                  pathname === link.href ? 'font-bold' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header

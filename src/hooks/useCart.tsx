'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { type CartItem, type Product, FLOCKA_DISCOUNT } from '../types/storeTypes'

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  discount: number
  total: number
  useFlockaCoin: boolean
  setUseFlockaCoin: (use: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [useFlockaCoin, setUseFlockaCoin] = useState<boolean>(false)
  
  // Load cart from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart))
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error)
          setCartItems([])
        }
      }
      
      const savedUseFlockaCoin = localStorage.getItem('useFlockaCoin')
      if (savedUseFlockaCoin) {
        setUseFlockaCoin(savedUseFlockaCoin === 'true')
      }
    }
  }, [])
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }
  }, [cartItems])
  
  // Save useFlockaCoin preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('useFlockaCoin', String(useFlockaCoin))
    }
  }, [useFlockaCoin])
  
  const addToCart = (product: Product, quantity: number): void => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id)
      
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        }
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, { product, quantity }]
      }
    })
  }
  
  const removeFromCart = (productId: string): void => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId))
  }
  
  const updateQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    )
  }
  
  const clearCart = (): void => {
    setCartItems([])
  }
  
  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 
    0
  )
  
  // Calculate discount if using FLOCKA
  const discount = useFlockaCoin ? (subtotal * FLOCKA_DISCOUNT / 100) : 0
  
  // Calculate total
  const total = subtotal - discount
  
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    total,
    useFlockaCoin,
    setUseFlockaCoin
  }
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

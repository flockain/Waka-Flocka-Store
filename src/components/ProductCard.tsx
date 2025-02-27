'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../hooks/useCart'
import { type Product, FLOCKA_DISCOUNT } from '../types/storeTypes'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps): JSX.Element => {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState<number>(1)
  
  const handleAddToCart = (): void => {
    addToCart(product, quantity)
    setQuantity(1)
  }
  
  const discountedPrice = product.price * (1 - FLOCKA_DISCOUNT / 100)
  
  // Format price with commas for thousands
  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Product Image</span>
      </div>
      
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-blue-600">{product.name}</h3>
        </Link>
        
        <p className="text-gray-700 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-lg font-bold">${formatPrice(product.price)}</p>
            <p className="text-sm text-green-600">
              ${formatPrice(discountedPrice)} with $FLOCKA
            </p>
          </div>
          
          {!product.inStock && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Out of Stock
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex border border-gray-300 rounded">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="px-3 py-1 border-r border-gray-300"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-3 py-1">{quantity}</span>
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="px-3 py-1 border-l border-gray-300"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex-1 py-2 px-4 rounded ${
              product.inStock
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

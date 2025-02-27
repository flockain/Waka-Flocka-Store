'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { type Product } from '../../../types/storeTypes'
import { fetchProductById } from '../../../services/productService'
import { useCart } from '../../../hooks/useCart'
import { FLOCKA_DISCOUNT } from '../../../types/storeTypes'

export default function ProductPage(): JSX.Element {
  const params = useParams()
  const productId = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  
  const { addToCart } = useCart()
  
  useEffect(() => {
    const loadProduct = async (): Promise<void> => {
      try {
        setLoading(true)
        const data = await fetchProductById(productId)
        setProduct(data)
        if (!data) {
          setError('Product not found')
        } else {
          setError(null)
        }
      } catch (err) {
        setError('Failed to load product. Please try again later.')
        console.error('Error loading product:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadProduct()
  }, [productId])
  
  const handleAddToCart = (): void => {
    if (product) {
      addToCart(product, quantity)
      setQuantity(1)
    }
  }
  
  const discountedPrice = product ? product.price * (1 - FLOCKA_DISCOUNT / 100) : 0
  
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {!loading && product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg flex items-center justify-center h-96">
              <span className="text-gray-500">Product Image</span>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              <div className="mb-6">
                <p className="text-2xl font-bold mb-1">${product.price.toLocaleString()}</p>
                <p className="text-lg text-green-600">
                  ${discountedPrice.toLocaleString()} with $FLOCKA (10% off)
                </p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              {!product.inStock && (
                <div className="mb-6">
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded">
                    Out of Stock
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <label htmlFor="quantity" className="font-medium">Quantity:</label>
                  <div className="flex border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-3 py-1 border-r border-gray-300"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{quantity}</span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="px-3 py-1 border-l border-gray-300"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`w-full py-3 px-4 rounded font-medium ${
                    product.inStock
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Add to Cart
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold mb-2">Payment Options</h2>
                <p className="mb-2">We accept payments in USDC and $FLOCKA tokens.</p>
                <p className="text-green-600 font-medium">
                  Save 10% when you pay with $FLOCKA tokens!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}

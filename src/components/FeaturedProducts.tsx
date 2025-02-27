'use client'

import { useState, useEffect } from 'react'
import { type Product } from '../types/storeTypes'
import { fetchFeaturedProducts } from '../services/productService'
import ProductCard from './ProductCard'

const FeaturedProducts = (): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const loadFeaturedProducts = async (): Promise<void> => {
      try {
        setLoading(true)
        const featuredProducts = await fetchFeaturedProducts()
        setProducts(featuredProducts)
        setError(null)
      } catch (err) {
        setError('Failed to load featured products')
        console.error('Error loading featured products:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadFeaturedProducts()
  }, [])
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No featured products available at this time.</p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default FeaturedProducts

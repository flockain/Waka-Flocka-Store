'use client'

import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import AdminLogin from '../../components/AdminLogin'
import ProductEditor from '../../components/ProductEditor'
import { type Product } from '../../types/storeTypes'
import { fetchProducts } from '../../services/productService'

export default function AdminPage(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('products')

  useEffect(() => {
    // Check if user is already authenticated
    if (typeof window !== 'undefined') {
      const adminAuth = localStorage.getItem('adminAuth')
      if (adminAuth === 'true') {
        setIsAuthenticated(true)
      }
    }

    // Load products
    const loadProducts = async (): Promise<void> => {
      try {
        setLoading(true)
        const data = await fetchProducts()
        setProducts(data)
        setError(null)
      } catch (err) {
        setError('Failed to load products. Please try again later.')
        console.error('Error loading products:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const handleLogin = (success: boolean): void => {
    setIsAuthenticated(success)
    if (success && typeof window !== 'undefined') {
      localStorage.setItem('adminAuth', 'true')
    }
  }

  const handleLogout = (): void => {
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminAuth')
    }
  }

  const handleProductUpdate = (updatedProduct: Product): void => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    )
  }

  const handleProductAdd = (newProduct: Product): void => {
    setProducts(prevProducts => [...prevProducts, newProduct])
  }

  const handleProductDelete = (productId: string): void => {
    setProducts(prevProducts => 
      prevProducts.filter(product => product.id !== productId)
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {!isAuthenticated ? (
          <AdminLogin onLogin={handleLogin} />
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'products' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-black hover:bg-gray-300'
                  }`}
                >
                  Products
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'orders' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-black hover:bg-gray-300'
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'settings' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-black hover:bg-gray-300'
                  }`}
                >
                  Settings
                </button>
              </div>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
            
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Manage Products</h2>
                  <button
                    onClick={() => {
                      const newId = `new-${Date.now()}`
                      const newProduct: Product = {
                        id: newId,
                        name: 'New Product',
                        description: 'Product description',
                        price: 0,
                        images: [],
                        categoryId: 'merchandise',
                        inStock: true
                      }
                      handleProductAdd(newProduct)
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add New Product
                  </button>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {products.map(product => (
                      <ProductEditor
                        key={product.id}
                        product={product}
                        onUpdate={handleProductUpdate}
                        onDelete={handleProductDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Orders</h2>
                <p>Order management functionality will be implemented here.</p>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Store Settings</h3>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Payment Wallet Address
                    </label>
                    <input
                      type="text"
                      value="0x82EdA563621E15EF35c780Fe1ea8861DF7558ca9"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      readOnly
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This is the wallet where all payments will be received.
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      $FLOCKA Token Address
                    </label>
                    <input
                      type="text"
                      value="0xdc471C5C72dE413e4877CeD49B8Bd0ce72796722"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      readOnly
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      $FLOCKA Discount (%)
                    </label>
                    <input
                      type="number"
                      value="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      readOnly
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Discount applied when customers pay with $FLOCKA tokens.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}

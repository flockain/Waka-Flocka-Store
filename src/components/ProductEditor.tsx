'use client'

import { useState } from 'react'
import { type Product } from '../types/storeTypes'

interface ProductEditorProps {
  product: Product
  onUpdate: (product: Product) => void
  onDelete: (productId: string) => void
}

const ProductEditor = ({ product, onUpdate, onDelete }: ProductEditorProps): JSX.Element => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedProduct, setEditedProduct] = useState<Product>(product)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [newImageUrl, setNewImageUrl] = useState<string>('')
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    
    if (name === 'price') {
      setEditedProduct({
        ...editedProduct,
        [name]: parseFloat(value) || 0
      })
    } else if (name === 'inStock') {
      setEditedProduct({
        ...editedProduct,
        inStock: (e.target as HTMLInputElement).checked
      })
    } else if (name === 'featured') {
      setEditedProduct({
        ...editedProduct,
        featured: (e.target as HTMLInputElement).checked
      })
    } else {
      setEditedProduct({
        ...editedProduct,
        [name]: value
      })
    }
  }
  
  const handleSave = (): void => {
    onUpdate(editedProduct)
    setIsEditing(false)
  }
  
  const handleCancel = (): void => {
    setEditedProduct(product)
    setIsEditing(false)
  }
  
  const handleAddImage = (): void => {
    if (newImageUrl.trim()) {
      setEditedProduct({
        ...editedProduct,
        images: [...editedProduct.images, newImageUrl.trim()]
      })
      setNewImageUrl('')
    }
  }
  
  const handleRemoveImage = (index: number): void => {
    setEditedProduct({
      ...editedProduct,
      images: editedProduct.images.filter((_, i) => i !== index)
    })
  }
  
  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <span className={`mr-2 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
            ▶
          </span>
          <h3 className="font-semibold">{product.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">${formatPrice(product.price)}</span>
          <span className={`px-2 py-1 text-xs rounded ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editedProduct.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editedProduct.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Price (USD)
                </label>
                <input
                  type="number"
                  name="price"
                  value={editedProduct.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={editedProduct.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="merchandise">Merchandise</option>
                  <option value="features">Song Features</option>
                  <option value="studio">Studio Sessions</option>
                  <option value="concerts">Concert Bookings</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`inStock-${product.id}`}
                  name="inStock"
                  checked={editedProduct.inStock}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor={`inStock-${product.id}`} className="text-gray-700">
                  In Stock
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`featured-${product.id}`}
                  name="featured"
                  checked={editedProduct.featured || false}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor={`featured-${product.id}`} className="text-gray-700">
                  Featured Product
                </label>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Images
                </label>
                <div className="space-y-2 mb-4">
                  {editedProduct.images.map((image, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={image}
                        readOnly
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-l"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-r"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3 py-2 bg-blue-600 text-white rounded-r"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-700">Description:</h4>
                  <p className="text-gray-600">{product.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Details:</h4>
                  <ul className="text-gray-600">
                    <li>Price: ${formatPrice(product.price)}</li>
                    <li>Category: {product.categoryId}</li>
                    <li>Status: {product.inStock ? 'In Stock' : 'Out of Stock'}</li>
                    <li>Featured: {product.featured ? 'Yes' : 'No'}</li>
                  </ul>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Images:</h4>
                {product.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {product.images.map((image, index) => (
                      <div key={index} className="bg-gray-100 p-2 rounded">
                        <div className="h-20 flex items-center justify-center overflow-hidden">
                          <span className="text-gray-500 text-sm break-all">{image}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No images available</p>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => onDelete(product.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductEditor

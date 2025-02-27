'use client'

import Link from 'next/link'
import { type Category } from '../types/storeTypes'

interface CategorySectionProps {
  category: Category
}

const CategorySection = ({ category }: CategorySectionProps): JSX.Element => {
  return (
    <Link 
      href={`/category/${category.id}`}
      className="block bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Image</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{category.name}</h3>
        <p className="text-gray-700">{category.description}</p>
        <div className="mt-4 text-blue-600 font-medium">
          Shop Now &rarr;
        </div>
      </div>
    </Link>
  )
}

export default CategorySection

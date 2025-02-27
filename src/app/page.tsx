'use client'

import { useState } from 'react'
import Header from '../components/Header'
import CategorySection from '../components/CategorySection'
import Footer from '../components/Footer'
import FeaturedProducts from '../components/FeaturedProducts'
import { type Category } from '../types/storeTypes'

export default function Home(): JSX.Element {
  const [categories] = useState<Category[]>([
    {
      id: 'merchandise',
      name: 'Merchandise',
      description: 'Official Waka Flocka merchandise and apparel',
      image: '/images/merchandise.jpg',
    },
    {
      id: 'features',
      name: 'Song Features',
      description: 'Book Waka Flocka for a feature on your track',
      image: '/images/features.jpg',
    },
    {
      id: 'studio',
      name: 'Studio Sessions',
      description: 'Book studio time with Waka Flocka',
      image: '/images/studio.jpg',
    },
    {
      id: 'concerts',
      name: 'Concert Bookings',
      description: 'Book Waka Flocka for your event or venue',
      image: '/images/concerts.jpg',
    },
  ])

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Official Waka Flocka Store</h1>
          <p className="text-xl">
            Shop exclusive merchandise and book Waka Flocka for features, studio sessions, and concerts.
            Pay in USDC or get 10% off when you pay with $FLOCKA tokens!
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Featured Items</h2>
          <FeaturedProducts />
        </section>
      </div>

      <Footer />
    </main>
  )
}

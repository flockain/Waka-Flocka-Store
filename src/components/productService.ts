import { type Product } from '../types/storeTypes'

// Mock data for initial development
const mockProducts: Product[] = [
  // Merchandise
  {
    id: 'merch-1',
    name: 'Limited Edition Waka Flocka Gold Chain',
    description: 'Exclusive 24K gold chain worn by Waka Flocka himself. One of a kind collector\'s item with certificate of authenticity.',
    price: 100000,
    images: ['/images/gold-chain.jpg'],
    categoryId: 'merchandise',
    inStock: true,
    featured: true
  },
  {
    id: 'merch-2',
    name: 'Waka Flocka Hoodie',
    description: 'Premium hoodie with Waka Flocka logo',
    price: 59.99,
    images: ['/images/hoodie.jpg'],
    categoryId: 'merchandise',
    inStock: true
  },
  {
    id: 'merch-3',
    name: 'Signed Poster',
    description: 'Limited edition poster signed by Waka Flocka',
    price: 49.99,
    images: ['/images/poster.jpg'],
    categoryId: 'merchandise',
    inStock: true
  },
  
  // Song Features
  {
    id: 'feature-1',
    name: 'Exclusive Album Feature',
    description: 'Get Waka Flocka on your upcoming album with a premium verse and marketing support. Includes studio time and video appearance.',
    price: 100000,
    images: ['/images/album-feature.jpg'],
    categoryId: 'features',
    inStock: true,
    featured: true
  },
  {
    id: 'feature-2',
    name: 'Standard Feature',
    description: 'Get Waka Flocka on your track with a standard verse',
    price: 5000,
    images: ['/images/feature.jpg'],
    categoryId: 'features',
    inStock: true
  },
  
  // Studio Sessions
  {
    id: 'studio-1',
    name: 'Executive Producer Package',
    description: 'Waka Flocka as your executive producer for an entire album. Includes 2 weeks of studio time, creative direction, and industry connections.',
    price: 100000,
    images: ['/images/exec-producer.jpg'],
    categoryId: 'studio',
    inStock: true,
    featured: true
  },
  {
    id: 'studio-2',
    name: 'Full Day Studio Session',
    description: 'Full day (8 hours) in the studio with Waka Flocka',
    price: 10000,
    images: ['/images/studio-full.jpg'],
    categoryId: 'studio',
    inStock: true
  },
  
  // Concert Bookings
  {
    id: 'concert-1',
    name: 'Private Concert Experience',
    description: 'Book Waka Flocka for a private concert at your location of choice. Includes full production setup and a 90-minute performance.',
    price: 100000,
    images: ['/images/private-concert.jpg'],
    categoryId: 'concerts',
    inStock: true,
    featured: true
  },
  {
    id: 'concert-2',
    name: 'Club Performance',
    description: 'Book Waka Flocka for a club performance',
    price: 25000,
    images: ['/images/club.jpg'],
    categoryId: 'concerts',
    inStock: true
  }
]

// Function to fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts)
    }, 500)
  })
}

// Function to fetch products by category
export const fetchProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  // In a real app, this would be an API call with filtering
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredProducts = mockProducts.filter(product => product.categoryId === categoryId)
      resolve(filteredProducts)
    }, 500)
  })
}

// Function to fetch a single product by ID
export const fetchProductById = async (productId: string): Promise<Product | null> => {
  // In a real app, this would be an API call to get a specific product
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.id === productId) || null
      resolve(product)
    }, 500)
  })
}

// Function to fetch featured products
export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  // In a real app, this would be an API call with filtering
  return new Promise((resolve) => {
    setTimeout(() => {
      const featuredProducts = mockProducts.filter(product => product.featured)
      resolve(featuredProducts)
    }, 500)
  })
}

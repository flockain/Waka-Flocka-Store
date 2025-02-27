export default function Services() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Waka Flocka Services</h1>
      
      <a href="/" className="text-blue-500 hover:underline mb-4 block">← Back to Home</a>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Exclusive Album Feature</h2>
          <p className="mb-2">Get Waka Flocka on your upcoming album with a premium verse and marketing support.</p>
          <p className="font-bold mb-1">$100,000.00</p>
          <p className="text-green-600 mb-2">$90,000.00 with $FLOCKA</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Book Now</button>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Executive Producer Package</h2>
          <p className="mb-2">Waka Flocka as your executive producer for an entire album.</p>
          <p className="font-bold mb-1">$100,000.00</p>
          <p className="text-green-600 mb-2">$90,000.00 with $FLOCKA</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Book Now</button>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Private Concert Experience</h2>
          <p className="mb-2">Book Waka Flocka for a private concert at your location of choice.</p>
          <p className="font-bold mb-1">$100,000.00</p>
          <p className="text-green-600 mb-2">$90,000.00 with $FLOCKA</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Book Now</button>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Studio Session</h2>
          <p className="mb-2">Full day in the studio with Waka Flocka.</p>
          <p className="font-bold mb-1">$10,000.00</p>
          <p className="text-green-600 mb-2">$9,000.00 with $FLOCKA</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Book Now</button>
        </div>
      </div>
    </main>
  )
}

export default function Merchandise() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Waka Flocka Merchandise</h1>
      
      <a href="/" className="text-blue-500 hover:underline mb-4 block">← Back to Home</a>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Limited Edition Gold Chain</h2>
          <p className="mb-2">Exclusive 24K gold chain worn by Waka Flocka himself.</p>
          <p className="font-bold mb-1">$100,000.00</p>
          <p className="text-green-600 mb-2">$90,000.00 with $FLOCKA</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Add to Cart</button>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Waka Flocka Hoodie</h2>
          <p className="mb-2">Premium hoodie with Waka Flocka logo.</p>
          <p className="font-bold mb-1">$59.99</p>
          <p className="text-green-600 mb-2">$53.99 with $FLOCKA</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Add to Cart</button>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Signed Poster</h2>
          <p className="mb-2">Limited edition poster signed by Waka Flocka.</p>
          <p className="font-bold mb-1">$49.99</p>
          <p className="text-green-600 mb-2">$44.99 with $FLOCKA</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Add to Cart</button>
        </div>
      </div>
    </main>
  )
}

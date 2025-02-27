'use client'

import { useState } from 'react'

interface AdminLoginProps {
  onLogin: (success: boolean) => void
}

const AdminLogin = ({ onLogin }: AdminLoginProps): JSX.Element => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // Simple authentication for demo purposes
    // In a real app, this would be an API call to verify credentials
    setTimeout(() => {
      if (username === 'admin' && password === 'wakaflocka') {
        onLogin(true)
      } else {
        setError('Invalid username or password')
      }
      setLoading(false)
    }, 1000)
  }
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded font-medium ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Default credentials for demo:</p>
          <p>Username: admin</p>
          <p>Password: wakaflocka</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

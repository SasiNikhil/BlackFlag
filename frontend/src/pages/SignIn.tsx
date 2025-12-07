import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useApp()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const success = login(email, password)
      if (success) {
        navigate('/dashboard')
      } else {
        setError('Invalid credentials. Please check your email and password.')
      }
    } catch (err) {
      setError('Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BlackFlag HR</h1>
          <p className="text-gray-600">Sign in to access the HR management system</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 border-t pt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Test Credentials:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="bg-blue-50 p-2 rounded border border-blue-100">
                <p className="font-semibold text-blue-900">HR Admin:</p>
                <p>📧 sarah.chen@blackflag.hr | 🔑 Admin123!</p>
                <p>📧 hr.manager@blackflag.hr | 🔑 HRPass123!</p>
              </div>
              <div className="bg-green-50 p-2 rounded border border-green-100">
                <p className="font-semibold text-green-900">Staff/Employee:</p>
                <p>📧 marcus.johnson@blackflag.hr | 🔑 Staff123!</p>
                <p>📧 emily.rodriguez@blackflag.hr | 🔑 Staff123!</p>
                <p>📧 david.kim@blackflag.hr | 🔑 Staff123!</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ℹ️ HR Admin can view Directory & Employees list. Staff can only see their own profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

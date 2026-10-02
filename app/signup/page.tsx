'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold mb-4">Check your email</h1>
        <p className="text-gray-400">
          We sent you a confirmation link. Click it to activate your account, then log in.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-6">Sign Up</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-gray-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-400">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-400 hover:underline">Log in</Link>
      </p>
    </div>
  )
}

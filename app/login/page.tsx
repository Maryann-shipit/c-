'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-6">Log In</h1>
      <form onSubmit={handleLogin} className="space-y-4">
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
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-400">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-blue-400 hover:underline">Sign up</Link>
      </p>
    </div>
  )
}

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (userData.user) {
    redirect('/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-3">Welcome to Mawin</h1>
      <p className="text-lg text-gray-300 mb-2">
        A place where nothing important slips through the cracks.
      </p>
      <p className="text-gray-400 mb-10">
        Bills, appointments, documents, deadlines — Mawin holds it all,
        reminds you right on time, and clears the clutter from your head.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 text-left mb-10">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-1">📋 One place for everything</h3>
          <p className="text-sm text-gray-400">
            Bills, appointments, documents, work, and personal tasks — sorted into Today and Upcoming.
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-1">🔔 Reminders that show up</h3>
          <p className="text-sm text-gray-400">
            Every task reminds you on the day it&apos;s due — with an optional early heads-up, 2 or 3 days ahead.
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-1">🔁 Handles the repeats</h3>
          <p className="text-sm text-gray-400">
            Monthly bills and weekly routines recreate themselves automatically once you&apos;re done.
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Link
          href="/signup"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
        >
          Log In
        </Link>
      </div>

      <p className="text-xs text-gray-600 mt-12">Mawin — your life-admin assistant.</p>
    </div>
  )
}

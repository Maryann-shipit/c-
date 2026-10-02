'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES = ['Bills', 'Appointments', 'Documents', 'Work/School', 'Personal']

export default function NewTaskPage() {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [notes, setNotes] = useState('')
  const [earlyReminder, setEarlyReminder] = useState('')
  const [recurrence, setRecurrence] = useState('none')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      setError('You must be logged in to create a task.')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('tasks').insert({
      user_id: userData.user.id,
      title,
      date,
      time: time || null,
      category,
      notes: notes || null,
      early_reminder: earlyReminder || null,
      recurrence,
    })

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const inputClass = "w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
  const labelClass = "block text-sm mb-1 text-gray-400"

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <Link href="/dashboard" className="text-sm text-blue-400 hover:underline">← Back</Link>
      <h1 className="text-2xl font-semibold mt-2 mb-6">New Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Date *</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Time (optional)</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass} rows={3} />
        </div>
        <div>
          <label className={labelClass}>Early reminder (optional)</label>
          <select value={earlyReminder} onChange={(e) => setEarlyReminder(e.target.value)} className={inputClass}>
            <option value="">None (D-day only)</option>
            <option value="2_days">2 days before</option>
            <option value="3_days">3 days before</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Recurrence (optional)</label>
          <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)} className={inputClass}>
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg font-medium transition-colors">
          {loading ? 'Saving...' : 'Create Task'}
        </button>
      </form>
    </div>
  )
}

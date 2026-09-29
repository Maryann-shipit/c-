'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES = ['Bills', 'Appointments', 'Documents', 'Work/School', 'Personal']

export default function EditTaskPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [notes, setNotes] = useState('')
  const [earlyReminder, setEarlyReminder] = useState('')
  const [recurrence, setRecurrence] = useState('none')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const loadTask = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single()

      if (error || !data) {
        setError('Could not load task.')
      } else {
        setTitle(data.title)
        setDate(data.date)
        setTime(data.time || '')
        setCategory(data.category)
        setNotes(data.notes || '')
        setEarlyReminder(data.early_reminder || '')
        setRecurrence(data.recurrence || 'none')
      }
      setFetching(false)
    }
    loadTask()
  }, [taskId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        title,
        date,
        time: time || null,
        category,
        notes: notes || null,
        early_reminder: earlyReminder || null,
        recurrence,
      })
      .eq('id', taskId)

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  if (fetching) {
    return <div style={{ padding: '2rem' }}>Loading...</div>
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '400px' }}>
      <h1>Edit Task</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Title *</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Date *</label>
          <br />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Time (optional)</label>
          <br />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Category *</label>
          <br />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Notes (optional)</label>
          <br />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
            rows={3}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Early reminder (optional)</label>
          <br />
          <select
            value={earlyReminder}
            onChange={(e) => setEarlyReminder(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="">None (D-day only)</option>
            <option value="2_days">2 days before</option>
            <option value="3_days">3 days before</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Recurrence (optional)</label>
          <br />
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

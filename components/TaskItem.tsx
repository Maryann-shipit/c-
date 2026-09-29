'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Task = {
  id: string
  title: string
  date: string
  time: string | null
  category: string
  notes: string | null
  early_reminder: string | null
  recurrence: string | null
  status: string
  user_id: string
}

function getNextDate(dateStr: string, recurrence: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  if (recurrence === 'daily') {
    date.setDate(date.getDate() + 1)
  } else if (recurrence === 'weekly') {
    date.setDate(date.getDate() + 7)
  } else if (recurrence === 'monthly') {
    date.setMonth(date.getMonth() + 1)
  }
  return date.toISOString().split('T')[0]
}

export default function TaskItem({ task }: { task: Task }) {
  const router = useRouter()

  const handleComplete = async () => {
    const supabase = createClient()

    await supabase.from('tasks').update({ status: 'completed' }).eq('id', task.id)

    if (task.recurrence && task.recurrence !== 'none') {
      const nextDate = getNextDate(task.date, task.recurrence)
      await supabase.from('tasks').insert({
        user_id: task.user_id,
        title: task.title,
        date: nextDate,
        time: task.time,
        category: task.category,
        notes: task.notes,
        early_reminder: task.early_reminder,
        recurrence: task.recurrence,
        status: 'pending',
      })
    }

    router.refresh()
  }

  const handleDelete = async () => {
    const supabase = createClient()
    await supabase.from('tasks').delete().eq('id', task.id)
    router.refresh()
  }

  return (
    <li style={{ marginBottom: '0.75rem', listStyle: 'none' }}>
      <strong>{task.title}</strong> — {task.category}
      {task.time ? ` at ${task.time}` : ''}
      {task.recurrence && task.recurrence !== 'none' ? ` (${task.recurrence})` : ''}
      {' '}
      <Link href={`/tasks/${task.id}/edit`} style={{ marginLeft: '0.5rem' }}>
        Edit
      </Link>
      <button onClick={handleComplete} style={{ marginLeft: '0.5rem', padding: '0.2rem 0.5rem' }}>
        Complete
      </button>
      <button onClick={handleDelete} style={{ marginLeft: '0.5rem', padding: '0.2rem 0.5rem' }}>
        Delete
      </button>
    </li>
  )
}

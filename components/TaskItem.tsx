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
    <li className="flex flex-wrap items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
      <span className="flex-1 min-w-[140px]">
        <strong>{task.title}</strong>{' '}
        <span className="text-gray-400 text-sm">
          — {task.category}
          {task.time ? ` at ${task.time}` : ''}
          {task.recurrence && task.recurrence !== 'none' ? ` (${task.recurrence})` : ''}
        </span>
      </span>
      <Link href={`/tasks/${task.id}/edit`} className="text-sm text-blue-400 hover:underline">
        Edit
      </Link>
      <button onClick={handleComplete} className="text-sm px-2 py-1 bg-green-700 hover:bg-green-600 rounded">
        Complete
      </button>
      <button onClick={handleDelete} className="text-sm px-2 py-1 bg-red-800 hover:bg-red-700 rounded">
        Delete
      </button>
    </li>
  )
}

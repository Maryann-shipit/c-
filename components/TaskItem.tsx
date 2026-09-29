'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Task = {
  id: string
  title: string
  date: string
  time: string | null
  category: string
  status: string
}

export default function TaskItem({ task }: { task: Task }) {
  const router = useRouter()

  const handleComplete = async () => {
    const supabase = createClient()
    await supabase.from('tasks').update({ status: 'completed' }).eq('id', task.id)
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
      {' '}
      <button onClick={handleComplete} style={{ marginLeft: '0.5rem', padding: '0.2rem 0.5rem' }}>
        Complete
      </button>
      <button onClick={handleDelete} style={{ marginLeft: '0.5rem', padding: '0.2rem 0.5rem' }}>
        Delete
      </button>
    </li>
  )
}

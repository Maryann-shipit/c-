import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import TaskItem from '@/components/TaskItem'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    redirect('/login')
  }

  const today = new Date().toISOString().split('T')[0]

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('date', { ascending: true })

  const pendingTasks = tasks?.filter((t) => t.status === 'pending') || []
  const completedTasks = tasks?.filter((t) => t.status === 'completed') || []

  const todayTasks = pendingTasks.filter((t) => t.date === today)
  const upcomingTasks = pendingTasks.filter((t) => t.date > today)

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <LogoutButton />
      <h1>Your Life-Admin Assistant</h1>
      <Link
        href="/tasks/new"
        style={{
          display: 'inline-block',
          marginTop: '1rem',
          marginBottom: '2rem',
          padding: '0.5rem 1rem',
          background: '#0070f3',
          color: 'white',
          borderRadius: '4px',
          textDecoration: 'none',
        }}
      >
        + New Task
      </Link>

      {error && <p style={{ color: 'red' }}>Error loading tasks: {error.message}</p>}

      <h2>Today</h2>
      {todayTasks.length === 0 ? (
        <p style={{ color: '#888' }}>Nothing due today.</p>
      ) : (
        <ul style={{ padding: 0 }}>
          {todayTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}

      <h2>Upcoming</h2>
      {upcomingTasks.length === 0 ? (
        <p style={{ color: '#888' }}>Nothing upcoming.</p>
      ) : (
        <ul style={{ padding: 0 }}>
          {upcomingTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}

      <h2>Completed</h2>
      {completedTasks.length === 0 ? (
        <p style={{ color: '#888' }}>No completed tasks yet.</p>
      ) : (
        <ul style={{ padding: 0 }}>
          {completedTasks.map((task) => (
            <li key={task.id} style={{ marginBottom: '0.5rem', listStyle: 'none', color: '#888', textDecoration: 'line-through' }}>
              {task.title} — {task.category} — {task.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

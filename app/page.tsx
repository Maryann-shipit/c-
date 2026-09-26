import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
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

  const todayTasks = tasks?.filter((t) => t.date === today) || []
  const upcomingTasks = tasks?.filter((t) => t.date > today) || []

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
        <ul>
          {todayTasks.map((task) => (
            <li key={task.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{task.title}</strong> — {task.category}
              {task.time ? ` at ${task.time}` : ''}
            </li>
          ))}
        </ul>
      )}

      <h2>Upcoming</h2>
      {upcomingTasks.length === 0 ? (
        <p style={{ color: '#888' }}>Nothing upcoming.</p>
      ) : (
        <ul>
          {upcomingTasks.map((task) => (
            <li key={task.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{task.title}</strong> — {task.category} — {task.date}
              {task.time ? ` at ${task.time}` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import TaskItem from '@/components/TaskItem'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function daysBetween(dateStr: string, todayStr: string): number {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date(todayStr + 'T00:00:00')
  return Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export default async function Dashboard() {
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

  const earlyReminderTasks = pendingTasks.filter((t) => {
    if (t.date <= today || !t.early_reminder) return false
    const daysUntil = daysBetween(t.date, today)
    if (t.early_reminder === '2_days') return daysUntil <= 2
    if (t.early_reminder === '3_days') return daysUntil <= 3
    return false
  })

  const hasReminders = todayTasks.length > 0 || earlyReminderTasks.length > 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Mawin — Your Life-Admin Assistant</h1>
        <LogoutButton />
      </div>

      <Link
        href="/tasks/new"
        className="inline-block mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
      >
        + New Task
      </Link>

      {error && (
        <p className="text-red-400 mb-4">Error loading tasks: {error.message}</p>
      )}

      {hasReminders && (
        <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4 mb-6">
          <strong className="text-yellow-400">🔔 Reminders</strong>
          <ul className="mt-2 space-y-1 text-sm">
            {todayTasks.map((t) => (
              <li key={`reminder-today-${t.id}`}>
                <strong>{t.title}</strong> is due today ({t.category})
              </li>
            ))}
            {earlyReminderTasks.map((t) => (
              <li key={`reminder-early-${t.id}`}>
                <strong>{t.title}</strong> is due {t.date} ({t.category})
              </li>
            ))}
          </ul>
        </div>
      )}

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2 border-b border-gray-800 pb-1">Today</h2>
        {todayTasks.length === 0 ? (
          <p className="text-gray-500 text-sm">Nothing due today.</p>
        ) : (
          <ul className="space-y-2">
            {todayTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        )}
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2 border-b border-gray-800 pb-1">Upcoming</h2>
        {upcomingTasks.length === 0 ? (
          <p className="text-gray-500 text-sm">Nothing upcoming.</p>
        ) : (
          <ul className="space-y-2">
            {upcomingTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2 border-b border-gray-800 pb-1">Completed</h2>
        {completedTasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No completed tasks yet.</p>
        ) : (
          <ul className="space-y-1">
            {completedTasks.map((task) => (
              <li key={task.id} className="text-gray-500 line-through text-sm">
                {task.title} — {task.category} — {task.date}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

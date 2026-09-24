'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '0.5rem 1rem',
        position: 'relative',
        display: 'block',
        marginBottom: '1rem',
        cursor: 'pointer',
        zIndex: 10,
      }}
    >
      Log Out
    </button>
  )
}

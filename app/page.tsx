import LogoutButton from '@/components/LogoutButton'

export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <LogoutButton />
      <h1>Welcome to your Life-Admin Assistant</h1>
      <p>You are logged in. This is a temporary homepage — the real dashboard comes next.</p>
    </div>
  )
}

import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { WaterDropIcon } from '@/assets/icons'
import { Button, Card, Input } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { useAuthStore } from '@/store/authStore'

export function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const { login, token } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: string })?.from ?? '/admin'

  if (token) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(username, password)
      if (!remember) {
        // Session-only: still persisted in zustand; user can logout
      }
      showToast('Welcome back', 'success')
      navigate(from, { replace: true })
    } catch {
      showToast('Invalid username or password', 'danger', 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bgLight px-4 py-12">
      <Link to="/" className="mb-6 flex items-center gap-2 text-primary">
        <WaterDropIcon className="h-10 w-10" />
<<<<<<< HEAD
        <span className="text-xl font-bold">CleanFlow SL</span>
=======
        <span className="text-xl font-bold">Salone Water Watch</span>
>>>>>>> origin/rename-salone-water-watch-6798015821729430602
      </Link>
      <Card title="Admin sign in" className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-neutral"
            />
            Remember me on this device
          </label>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-2 text-center text-sm">
          <Link to="/" className="text-primary hover:underline">
            ← Back to public site
          </Link>
        </p>
      </Card>
    </div>
  )
}

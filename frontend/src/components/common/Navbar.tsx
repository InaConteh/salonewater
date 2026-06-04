import { Link, NavLink } from 'react-router-dom'
import { WaterDropIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'
import { useAuthStore } from '@/store/authStore'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors sm:px-3',
    isActive
      ? 'bg-primary text-white'
      : 'text-body hover:bg-primary-light hover:text-primary',
  )

const publicLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/map', label: 'Map' },
  { to: '/find-water', label: 'Find water' },
  { to: '/health', label: 'Health' },
  { to: '/sms-guide', label: 'SMS' },
]

export function Navbar() {
  const appName = import.meta.env.VITE_APP_NAME || 'CleanFlow SL'
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-light bg-surface/95 backdrop-blur">
      <div className="page-container flex flex-wrap items-center justify-between gap-3 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-primary hover:opacity-90"
          aria-label={`${appName} home`}
        >
          <WaterDropIcon className="h-8 w-8" aria-hidden="true" />
          <span className="text-xl font-bold">{appName}</span>
        </Link>

        <nav
          className="flex max-w-full flex-wrap items-center gap-0.5 sm:gap-1"
          aria-label="Main navigation"
        >
          {publicLinks.map(({ to, label, end }) => (
            <NavLink key={to} to={to} className={navLinkClass} end={end}>
              {label}
            </NavLink>
          ))}
          {token ? (
            <>
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg px-2.5 py-2 text-sm font-semibold text-neutral hover:text-danger"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/admin/login" className={navLinkClass}>
              Admin login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}

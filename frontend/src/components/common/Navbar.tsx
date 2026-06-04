import { Link, NavLink } from 'react-router-dom'
import { WaterDropIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
    isActive
      ? 'bg-primary text-white'
      : 'text-body hover:bg-primary-light hover:text-primary',
  )

export function Navbar() {
  const appName = import.meta.env.VITE_APP_NAME || 'CleanFlow SL'

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

        <nav className="flex flex-wrap items-center gap-1" aria-label="Main navigation">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/design-system" className={navLinkClass}>
            Design System
          </NavLink>
          <NavLink to="/admin" className={navLinkClass}>
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

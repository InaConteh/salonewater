import { NavLink } from 'react-router-dom'
import {
  BookIcon,
  SunCloudIcon,
  WaterDropIcon,
  WrenchIcon,
} from '@/assets/icons'
import { cn } from '@/lib/cn'

const links = [
  { to: '/admin', label: 'Dashboard', icon: WaterDropIcon, end: true },
  { to: '/admin/sources', label: 'Water sources', icon: WaterDropIcon },
  { to: '/admin/dispatch', label: 'Dispatch', icon: WrenchIcon },
  { to: '/admin/analytics', label: 'Analytics', icon: SunCloudIcon },
  { to: '/admin/alerts', label: 'Alerts', icon: SunCloudIcon },
  { to: '/admin/users', label: 'Users', icon: BookIcon },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
    isActive
      ? 'bg-primary text-white'
      : 'text-body hover:bg-primary-light hover:text-primary',
  )

export function Sidebar() {
  return (
    <aside
      className="w-full shrink-0 border-b border-neutral-light bg-surface lg:w-56 lg:border-b-0 lg:border-r"
      aria-label="Admin navigation"
    >
      <div className="p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral">
          Admin portal
        </p>
        <nav className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} className={linkClass} end={end}>
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}

import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Droplet,
  Wrench,
  BarChart3,
  Bell,
  Users,
  ChevronRight,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/reports', label: 'Issue Reports', icon: FileText },
  { to: '/admin/sources', label: 'Water Sources', icon: Droplet },
  { to: '/admin/maintenance', label: 'Preventative Maint.', icon: Clock },
  { to: '/admin/dispatch', label: 'Repair Dispatch', icon: Wrench },
  { to: '/admin/analytics', label: 'Data Analytics', icon: BarChart3 },
  { to: '/admin/alerts', label: 'System Alerts', icon: Bell },
  { to: '/admin/users', label: 'User Access', icon: Users },
]

export function Sidebar() {
  return (
    <aside
      className="w-full shrink-0 border-b border-slate-200 bg-white lg:w-64 lg:min-h-[calc(100vh-64px)] lg:border-b-0 lg:border-r lg:sticky lg:top-16"
      aria-label="Admin navigation"
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8 px-2">
           <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
             Management Console
           </p>
        </div>

        <nav className="flex flex-col gap-1.5">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => cn(
                "flex items-center justify-between group rounded-xl px-4 py-3 text-sm font-bold transition-all",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-500 hover:bg-slate-50 hover:text-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110")} />
                <span>{label}</span>
              </div>
              <ChevronRight className={cn(
                "h-4 w-4 opacity-0 transition-all",
                "group-hover:opacity-40 group-hover:translate-x-1"
              )} />
            </NavLink>
          ))}
        </nav>

        <div className="mt-12 p-4 rounded-2xl bg-slate-50 border border-slate-100">
           <h4 className="text-xs font-bold text-slate-800 mb-1">Need Support?</h4>
           <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
             Access the documentation or contact system administrators.
           </p>
           <button className="text-[10px] font-black text-primary uppercase tracking-wider hover:underline">
             View Docs →
           </button>
        </div>
      </div>
    </aside>
  )
}

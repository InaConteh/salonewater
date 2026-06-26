import { Link, NavLink } from 'react-router-dom'
import { Droplet, Menu, X, User, LogOut, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui'

const publicLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/map', label: 'Interactive Map' },
  { to: '/find-water', label: 'Find Water' },
  { to: '/health', label: 'Health' },
  { to: '/sms-guide', label: 'SMS Guide' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const appName = import.meta.env.VITE_APP_NAME || 'CleanFlow SL'
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-lg border-b shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="page-container flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 group transition-transform active:scale-95"
          aria-label={`${appName} home`}
        >
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
            <Droplet className="h-6 w-6 text-white" fill="white" />
          </div>
          <span className={cn(
            "text-xl font-black tracking-tight transition-colors",
            !scrolled && "text-white"
          )}>
            SALONE WATER<span className="text-primary">WATCH</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {publicLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive: active }) => cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-primary/10",
                !scrolled && !active && "text-white/80 hover:text-white hover:bg-white/10",
                !scrolled && active && "bg-white text-primary",
                scrolled && !active && "text-slate-600 hover:text-primary",
                scrolled && active && "bg-primary/10 text-primary"
              )}
            >
              {label}
            </NavLink>
          ))}

          <div className="ml-4 flex items-center gap-3">
            {token ? (
              <>
                <Link to="/admin">
                   <Button size="sm" variant="outline" className={cn(
                     "rounded-xl font-bold border-2",
                     !scrolled && "border-white/20 text-white hover:bg-white/10"
                   )}>
                     Dashboard
                   </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={logout}
                  className={cn(
                    "rounded-xl font-bold",
                    !scrolled && "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/admin/login">
                <Button size="sm" className="rounded-xl font-bold shadow-lg shadow-primary/20">
                  <User className="h-4 w-4 mr-2" />
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className={cn(
            "lg:hidden p-2 rounded-xl transition-colors",
            !scrolled ? "text-white hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white animate-in slide-in-from-right duration-300">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2">
                 <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center">
                    <Droplet className="h-6 w-6 text-white" fill="white" />
                 </div>
                 <span className="text-xl font-black tracking-tight">CLEAN<span className="text-primary">FLOW</span></span>
              </div>
              <button
                className="p-2 rounded-xl bg-slate-100 text-slate-600"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {publicLinks.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive: active }) => cn(
                    "flex items-center justify-between p-4 rounded-2xl text-lg font-bold transition-all",
                    active ? "bg-primary text-white" : "bg-slate-50 text-slate-600"
                  )}
                >
                  {label}
                  <ChevronRight className={cn("h-5 w-5 opacity-40")} />
                </NavLink>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t space-y-4">
              {token ? (
                <>
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="block">
                    <Button className="w-full h-14 rounded-2xl text-lg font-bold">
                      Admin Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full h-14 rounded-2xl text-lg font-bold border-2"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/admin/login" onClick={() => setIsOpen(false)} className="block">
                  <Button className="w-full h-14 rounded-2xl text-lg font-bold">
                    Admin Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

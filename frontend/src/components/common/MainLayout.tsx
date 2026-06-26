import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
<<<<<<< HEAD
=======
import { FloatingAssistant } from '@/components/ai'
>>>>>>> origin/rename-salone-water-watch-6798015821729430602

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
<<<<<<< HEAD
        className="sr-only-focusable fixed left-4 top-4 z-[200] rounded-lg bg-primary px-4 py-2 text-white"
=======
        className="sr-only focus:not-sr-only fixed left-4 top-4 z-[200] rounded-lg bg-primary px-4 py-2 text-white"
>>>>>>> origin/rename-salone-water-watch-6798015821729430602
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
<<<<<<< HEAD
=======
      <FloatingAssistant />
>>>>>>> origin/rename-salone-water-watch-6798015821729430602
      <Footer />
    </div>
  )
}

import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { FloatingAssistant } from '../ai/FloatingAssistant'

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only-focusable fixed left-4 top-4 z-[200] rounded-lg bg-primary px-4 py-2 text-white"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <FloatingAssistant />
      <Footer />
    </div>
  )
}

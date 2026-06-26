import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
<<<<<<< HEAD
      <div className="flex flex-1 flex-col lg:flex-row pt-20 lg:pt-24">
=======
      <div className="flex flex-1 flex-col lg:flex-row">
>>>>>>> origin/rename-salone-water-watch-6798015821729430602
        <Sidebar />
        <main id="main-content" className="flex-1 bg-bgLight">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

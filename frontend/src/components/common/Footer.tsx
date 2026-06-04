import { Link } from 'react-router-dom'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-neutral-light bg-surface">
      <div className="page-container flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-neutral sm:text-left">
          <strong className="text-primary">CleanFlow SL</strong> — Water security for rural
          Sierra Leone · © {year}
        </p>
        <nav className="flex flex-wrap justify-center gap-4 text-sm font-medium text-primary">
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
          <Link to="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link to="/terms" className="hover:underline">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  )
}

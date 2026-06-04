export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-neutral-light bg-surface">
      <div className="page-container py-6 text-center text-sm text-neutral">
        <p>
          <strong className="text-primary">CleanFlow SL</strong> — Water security for rural
          Sierra Leone
        </p>
        <p className="mt-1">© {year} CleanFlow SL. Open source under MIT License.</p>
      </div>
    </footer>
  )
}

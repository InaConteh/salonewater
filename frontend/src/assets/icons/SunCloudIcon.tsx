import type { SVGProps } from 'react'

export function SunCloudIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v2H1v-2zm10-9h2v3h-2V4zm7.24 2.16l1.41-1.41 1.79 1.8-1.41 1.41-1.79-1.8zM17 13h3v2h-3v-2zM8 18h8a4 4 0 0 0 0-8 5 5 0 0 0-9.9 1H8a3 3 0 1 0 0 6z" />
    </svg>
  )
}

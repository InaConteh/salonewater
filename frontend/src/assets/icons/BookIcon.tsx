import type { SVGProps } from 'react'

export function BookIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M18 2H6a2 2 0 0 0-2 2v16l8-4 8 4V4a2 2 0 0 0-2-2z" />
    </svg>
  )
}

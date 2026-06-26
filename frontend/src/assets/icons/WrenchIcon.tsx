import type { SVGProps } from 'react'

export function WrenchIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M22.7 19.3l-3.4-3.4a6.5 6.5 0 0 0-9.1-9.1l-3.4-3.4a1 1 0 0 0-1.4 1.4l2.5 2.5-2.8 2.8-2.5-2.5a1 1 0 0 0-1.4 1.4l3.4 3.4a6.5 6.5 0 0 0 9.1 9.1l3.4 3.4a1 1 0 0 0 1.4-1.4l-2.5-2.5 2.8-2.8 2.5 2.5a1 1 0 0 0 1.4-1.4z" />
    </svg>
  )
}

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { ButtonSize, ButtonVariant } from '@/types'

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary',
  secondary: 'bg-neutral text-white hover:bg-neutral-dark focus-visible:ring-neutral',
  success: 'bg-success text-white hover:bg-success-dark focus-visible:ring-success',
  warning: 'bg-warning text-body hover:bg-warning-dark focus-visible:ring-warning',
  danger: 'bg-danger text-white hover:bg-danger-dark focus-visible:ring-danger',
  outline:
    'border-2 border-primary bg-transparent text-primary hover:bg-primary-light focus-visible:ring-primary',
  ghost: 'bg-transparent text-primary hover:bg-primary-light focus-visible:ring-primary',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-semibold transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClass[variant],
        sizeClass[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

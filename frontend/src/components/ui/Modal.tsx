import { useEffect, useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Button } from './Button'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClass = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-body/50 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'relative z-10 w-full rounded-xl bg-surface shadow-cardHover',
          sizeClass[size],
        )}
      >
        <div className="flex items-start justify-between border-b border-neutral-light px-5 py-4">
          <h2 id={titleId} className="text-xl font-bold text-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-neutral hover:bg-neutral-light hover:text-body"
            aria-label="Close"
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              &times;
            </span>
          </button>
        </div>
        <div className="px-5 py-4 text-body">{children}</div>
        <div className="flex justify-end gap-2 border-t border-neutral-light px-5 py-4">
          {footer ?? (
            <>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onClose}>OK</Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

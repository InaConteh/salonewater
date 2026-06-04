import { Alert } from '@/components/ui'

interface AdminPlaceholderProps {
  title: string
  description: string
}

export function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
  return (
    <div className="page-container py-8">
      <h1 className="text-2xl font-bold text-primary">{title}</h1>
      <Alert variant="info" className="mt-4 max-w-xl">
        {description}
      </Alert>
    </div>
  )
}

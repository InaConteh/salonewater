import { useState } from 'react'
import { Button, Card, Input } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'

export function Contact() {
  const { showToast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showToast('Thank you — we will review your message.', 'success', 'Feedback sent')
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="page-container max-w-xl space-y-6 py-8">
      <h1 className="text-3xl font-bold">Contact us</h1>
      <p className="text-neutral">
        Share feedback, partnership ideas, or report platform issues.
      </p>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div>
            <label htmlFor="message" className="mb-1.5 block text-base font-semibold">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border-2 border-neutral-light px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </div>
          <Button type="submit" fullWidth>
            Send feedback
          </Button>
        </form>
      </Card>
    </div>
  )
}

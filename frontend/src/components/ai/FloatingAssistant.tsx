/**
 * Floating AI Assistant Component
 * A minimalist chat-like interface that can be toggled
 */

import { useState, useRef, useEffect } from 'react'
import { useAI } from '@/services/aiService'
import type { AIQuery } from '@/services/aiService'

interface FloatingAssistantProps {
  initialContext?: AIQuery['context']
  category?: 'health' | 'maintenance' | 'general'
}

export function FloatingAssistant({
  initialContext,
  category = 'general',
}: FloatingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([])
  const [input, setInput] = useState('')
  const [language, setLanguage] = useState<'en' | 'krio'>('en')
  const { loading, error, stream } = useAI()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }])

    try {
      const response = await stream({
        query: userMessage,
        category,
        language,
        context: initialContext,
      })

      setMessages((prev) => [...prev, { role: 'ai', text: response }])
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to get response. Please try again.'
      setMessages((prev) => [...prev, { role: 'ai', text: `⚠️ ${errorMsg}` }])
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Assistant"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-2xl hover:scale-110 transform duration-200"
<<<<<<< HEAD
        title="Open CleanFlow Assistant"
=======
        title="Open Salone Water Watch Assistant"
>>>>>>> origin/rename-salone-water-watch-6798015821729430602
      >
        💧
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 rounded-lg shadow-2xl bg-white overflow-hidden flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <div>
<<<<<<< HEAD
          <h3 className="font-semibold">CleanFlow Assistant</h3>
=======
          <h3 className="font-semibold">Salone Water Watch Assistant</h3>
>>>>>>> origin/rename-salone-water-watch-6798015821729430602
          <p className="text-xs opacity-90">Ask about water safety, maintenance, or health</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close Assistant"
          className="text-xl hover:opacity-80"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-8">
            <p>👋 Hello! Ask me anything about water safety, well maintenance, or health.</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Language Toggle */}
      <div className="px-4 py-2 border-t bg-gray-50 flex gap-2">
        <button
          onClick={() => setLanguage('en')}
          className={`text-xs px-3 py-1 rounded ${
            language === 'en'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('krio')}
          className={`text-xs px-3 py-1 rounded ${
            language === 'krio'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Krio
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t p-4 space-y-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e as any)
            }
          }}
          placeholder="Ask a question..."
          disabled={loading}
          rows={2}
          className="w-full p-2 border border-gray-300 rounded resize-none text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full bg-blue-500 text-white py-2 rounded font-medium text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

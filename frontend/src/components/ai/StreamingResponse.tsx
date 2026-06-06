/**
 * Streaming Response Component
 * Displays AI responses as they stream in real-time
 */

import { useEffect, useRef, useState } from 'react'
import { aiService } from '@/services/aiService'
import type { AIQuery } from '@/services/aiService'

interface StreamingResponseProps {
  query: AIQuery
  onComplete?: (fullResponse: string) => void
}

export function StreamingResponse({ query, onComplete }: StreamingResponseProps) {
  const { streamResponse } = useAI()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true
    const fetchStream = async () => {
      try {
        setError(null)
        setText('')

        for await (const chunk of aiService.stream(query)) {
          if (!isMounted) break
          setText((prev) => prev + chunk)

          // Auto-scroll
          if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
          }
        }

        if (isMounted) {
          setLoading(false)
          onComplete?.(text)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to stream response')
          setLoading(false)
        }
      }
    }

    fetchStream()

    return () => {
      isMounted = false
    }
  }, [query, onComplete])

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      {/* Response Container */}
      <div
        ref={containerRef}
        className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto text-sm leading-relaxed"
      >
        {text ? (
          <div className="prose prose-sm max-w-none">
            {text.split('\n').map((line, idx) => (
              <p key={idx} className="mb-2">
                {line || <br />}
              </p>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic">Waiting for response...</div>
        )}

        {loading && <span className="inline-block animate-pulse">▌</span>}
      </div>

      {/* Actions */}
      {!loading && text && (
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded font-medium text-sm hover:bg-blue-600 transition-colors"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            onClick={() => setText('')}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded font-medium text-sm hover:bg-gray-400 transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          AI is thinking...
        </div>
      )}
    </div>
  )
}

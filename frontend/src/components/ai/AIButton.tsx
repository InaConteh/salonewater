/**
 * AI Button Component
 * Reusable button that opens a modal or embedded AI assistant
 */

import { useState } from 'react'
import { StreamingResponse } from './StreamingResponse'
import type { AIQuery } from '@/services/aiService'

interface AIButtonProps {
  wellId?: string
  wellName?: string
  district?: string
  status?: string
  waterQuality?: string
  category?: 'health' | 'maintenance' | 'general'
  label?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'outline'
  className?: string
}

export function AIButton({
  wellId,
  wellName,
  district,
  status,
  waterQuality,
  category = 'general',
  label = 'Ask AI',
  size = 'md',
  variant = 'primary',
  className = '',
}: AIButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [selectedQuery, setSelectedQuery] = useState<AIQuery | null>(null)
  const [language, setLanguage] = useState<'en' | 'krio'>('en')

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
  }

  const context: AIQuery['context'] = {
    wellId,
    wellName,
    district,
    status,
    waterQuality,
  }

  const handleAsk = () => {
    if (!question.trim()) return

    const query: AIQuery = {
      query: question,
      category,
      language,
      context,
    }

    setSelectedQuery(query)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`rounded font-medium transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      >
        💧 {label}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
<<<<<<< HEAD
              <h3 className="font-semibold">Ask CleanFlow AI</h3>
=======
              <h3 className="font-semibold">Ask Salone Water Watch AI</h3>
>>>>>>> origin/rename-salone-water-watch-6798015821729430602
              <button
                onClick={() => {
                  setIsOpen(false)
                  setSelectedQuery(null)
                  setQuestion('')
                }}
                className="text-xl hover:opacity-80"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!selectedQuery ? (
                <>
                  {/* Language & Context */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Language:</label>
                      <div className="mt-2 flex gap-2">
                        {(['en', 'krio'] as const).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            className={`px-3 py-1 text-sm rounded ${
                              language === lang
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {lang === 'en' ? 'English' : 'Krio'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {wellName && (
                      <div className="bg-blue-50 p-3 rounded text-sm">
                        <p className="text-gray-700">
                          <strong>Well:</strong> {wellName}
                        </p>
                        {status && <p className="text-gray-700">
                          <strong>Status:</strong> {status}
                        </p>}
                        {district && <p className="text-gray-700">
                          <strong>District:</strong> {district}
                        </p>}
                      </div>
                    )}
                  </div>

                  {/* Question Input */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Your Question:
                    </label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask your question..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleAsk}
                    disabled={!question.trim()}
                    className="w-full bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
                  >
                    Get Answer
                  </button>
                </>
              ) : (
                <>
                  {/* Show Question */}
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600 mb-1">Question:</p>
                    <p className="font-medium">{selectedQuery.query}</p>
                  </div>

                  {/* Show Response */}
                  <StreamingResponse
                    query={selectedQuery}
                    onComplete={() => {
                      // Could do something after response is complete
                    }}
                  />

                  {/* Ask Another Button */}
                  <button
                    onClick={() => {
                      setSelectedQuery(null)
                      setQuestion('')
                    }}
                    className="w-full bg-gray-300 text-gray-700 py-2 rounded font-medium hover:bg-gray-400 transition-colors"
                  >
                    Ask Another Question
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

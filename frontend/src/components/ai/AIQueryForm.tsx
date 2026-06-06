import React, { useState, useRef } from 'react'
import { Send, } from 'lucide-react'
import { AIQuery } from '../../services/aiService'

interface AIQueryFormProps {
  onSubmit: (query: AIQuery) => void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
  showCategorySelect?: boolean
  showLanguageSelect?: boolean
}

export const AIQueryForm: React.FC<AIQueryFormProps> = ({
  onSubmit,
  isLoading = false,
  disabled = false,
  placeholder = 'Ask the AI health assistant...',
  showCategorySelect = true,
  showLanguageSelect = true,
}) => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'health' | 'maintenance' | 'general'>('health')
  const [language, setLanguage] = useState<'en' | 'krio'>('en')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) {
      return
    }

    onSubmit({
      query: query.trim(),
      category,
      language,
    })

    setQuery('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e as any)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-3 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        {/* Category and Language Selects */}
        {(showCategorySelect || showLanguageSelect) && (
          <div className="flex gap-3">
            {showCategorySelect && (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                disabled={isLoading || disabled}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="health">Health & Safety</option>
                <option value="maintenance">Well Maintenance</option>
                <option value="general">General Questions</option>
              </select>
            )}
            {showLanguageSelect && (
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                disabled={isLoading || disabled}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="krio">Krio</option>
              </select>
            )}
          </div>
        )}

        {/* Query Input */}
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading || disabled}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={isLoading || disabled || !query.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-gray-500">
          Ctrl+Enter to send • Questions about water safety, health, and maintenance
        </p>
      </div>
    </form>
  )
}

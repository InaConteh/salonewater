/**
 * Health Assistant Page
 * Dedicated page for health-related AI questions
 */

import { useEffect, useState } from 'react'
import { 
  AIQueryForm, 
  AIResponseDisplay, 
  AIHealthStatus
} from '@/components/ai'
import { useAI } from '@/hooks/useAI'
import type { AIQuery } from '@/services/aiService'

const QUICK_QUESTIONS = {
  en: [
    'How do I know if water is safe to drink?',
    'What are signs of waterborne disease?',
    'How do I boil water properly?',
    'Is this water contaminated?',
    'What is cholera and how do I prevent it?',
  ],
  krio: [
    'How fo know if wata safe?',
    'What sign of wata sik?',
    'How fo boil wata?',
    'Dis wata bad?',
    'What na cholera?',
  ],
}

export function HealthAssistant() {
  const [language, setLanguage] = useState<'en' | 'krio'>('en')
  const { response, streaming, loading, error, stream, clearState } = useAI()

  // Check if AI is available on mount
  useEffect(() => {
    // AI health check happens automatically in the component
  }, [])

  const handleQuickQuestion = (q: string) => {
    stream({
      query: q,
      category: 'health',
      language,
    } as AIQuery)
  }

  const handleCustomQuestion = (query: AIQuery) => {
    stream(query)
  }

  return (
    <div className="page-container space-y-8 py-8">
      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold">💧 Health Assistant</h1>
        <p className="text-lg text-gray-600">
          Ask about water safety, sanitation, disease prevention, and healthy water practices.
        </p>

        {/* AI Status */}
        <div>
          <AIHealthStatus />
        </div>
      </header>

      {/* Language Toggle */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Language:</span>
        <div className="flex gap-2">
          {(['en', 'krio'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                language === lang
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {lang === 'en' ? 'English' : 'Krio'}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Questions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Quick Questions</h2>
        <div className="grid gap-2">
          {QUICK_QUESTIONS[language].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickQuestion(q)}
              disabled={loading}
              className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 transition-colors"
            >
              <p className="text-gray-900">{q}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Ask Custom Question */}
      <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold">Ask a Custom Question</h2>
        <AIQueryForm
          onSubmit={handleCustomQuestion}
          isLoading={loading}
          disabled={loading}
          placeholder={
            language === 'en'
              ? 'Ask about water safety, health risks, or how to stay healthy...'
              : 'Ask bout wata safe, heltn risk, or how fo stay helty...'
          }
          showLanguageSelect={false}
        />
      </div>

      {/* Response Area */}
      {(loading || streaming || response || error) && (
        <div className="space-y-4">
          {loading && streaming === '' && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">🤖 Thinking...</p>
            </div>
          )}

          {streaming && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">AI Response:</div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{streaming}</p>
              </div>
            </div>
          )}

          {response && !loading && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">Answer:</div>
              <AIResponseDisplay response={response} />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-sm text-red-600">
                <strong>Error:</strong> {error}
              </p>
              <button
                onClick={clearState}
                className="mt-2 text-xs text-red-600 hover:text-red-700 underline"
              >
                Clear and try again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Important Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Important:</strong> This AI provides general health information, not medical
          diagnosis. If you have serious symptoms or health concerns, please consult a qualified
          health worker or doctor immediately.
        </p>
      </div>

      {/* Helpful Resources */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg space-y-3">
        <h3 className="font-semibold">Additional Resources</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>
            📚{' '}
            <a href="/health" className="text-blue-500 hover:underline">
              Health Library - Browse pre-written health tips
            </a>
          </li>
          <li>
            🗺️{' '}
            <a href="/map" className="text-blue-500 hover:underline">
              Water Source Map - Find safe water near you
            </a>
          </li>
          <li>
            📋{' '}
            <a href="/maintenance" className="text-blue-500 hover:underline">
              Maintenance Guide - Learn how to maintain wells
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
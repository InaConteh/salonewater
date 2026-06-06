import React from 'react'
import { Copy, Check } from 'lucide-react'
import { AIResponse } from '../../services/aiService'

interface AIResponseDisplayProps {
  response: AIResponse
  onCopy?: (text: string) => void
}

export const AIResponseDisplay: React.FC<AIResponseDisplayProps> = ({
  response,
  onCopy,
}) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(response.answer)
    setCopied(true)
    onCopy?.(response.answer)
    
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      {/* Metadata */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
            {response.category}
          </span>
          <span className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded">
            {response.language === 'en' ? 'English' : 'Krio'}
          </span>
          {response.context_used && (
            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
              With Context
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Question */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Question</p>
        <p className="text-sm text-gray-700 mt-1">{response.query}</p>
      </div>

      {/* Answer */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Answer</p>
        <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed">
          {response.answer}
        </p>
      </div>
    </div>
  )
}

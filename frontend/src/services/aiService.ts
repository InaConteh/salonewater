
// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface AIQuery {
  query: string
  category?: 'health' | 'maintenance' | 'general'
  language?: 'en' | 'krio'
  context?: {
    wellId?: string
    wellName?: string
    district?: string
    status?: string
    waterQuality?: string
    lastReport?: string
  }
}

export interface AIResponse {
  answer: string
  query: string
  category: string
  language: string
  context_used: boolean
  cached: boolean
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy'
  ollama: {
    status: 'healthy' | 'unhealthy'
    model: string
    latency_ms: number
    error: string | null
  }
  api: string
  timestamp: string
}

export interface WellContext {
  context: {
    well_id: string
    well_name: string
    district: string
    status: string
    water_quality: string
    last_report: string
    source_type: string
  }
  recent_reports: Array<{
    id: string
    cause: string
    date: string
    notes: string
  }>
  suggested_queries: string[]
}

export interface SuggestedQuestions {
  context: string
  questions: string[]
}

export interface TranslationResult {
  original: string
  translated: string
  target_language: 'en' | 'krio'
}

// ============================================================================
// AI SERVICE CLIENT
// ============================================================================

class AIServiceClient {
  private baseURL: string
  private abortControllers: Map<string, AbortController> = new Map()

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL
  }

  /**
   * Check if AI service is healthy and Ollama is available
   */
  async getHealth(): Promise<HealthStatus> {
    try {
      const response = await fetch(`${this.baseURL}/ai/health`)
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('AI health check failed:', error)
      throw error
    }
  }

  /**
   * Ask AI a question and get a complete response
   */
  async ask(query: AIQuery): Promise<AIResponse> {
    if (!query.query || !query.query.trim()) {
      throw new Error('Query cannot be empty')
    }

    try {
      const response = await fetch(`${this.baseURL}/ai/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthHeader(),
        },
        body: JSON.stringify({
          query: query.query,
          category: query.category || 'general',
          language: query.language || 'en',
          context: query.context,
        }),
      })

      if (response.status === 429) {
        throw new Error('Too many requests. Please wait before trying again.')
      }

      if (response.status === 503) {
        const error = await response.json()
        throw new Error(
          error.error || 'AI service is temporarily unavailable. Please try again later.'
        )
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get AI response')
      }

      return await response.json()
    } catch (error) {
      console.error('AI ask failed:', error)
      throw error
    }
  }

  /**
   * Stream AI response in real-time using Server-Sent Events
   * Returns a Promise that resolves with the full answer, but streams chunks through callback
   */
  async *stream(query: AIQuery): AsyncGenerator<string, void, unknown> {
    if (!query.query || !query.query.trim()) {
      throw new Error('Query cannot be empty')
    }

    const controller = new AbortController()
    const key = `stream_${Date.now()}`
    this.abortControllers.set(key, controller)

    try {
      const response = await fetch(`${this.baseURL}/ai/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthHeader(),
        },
        body: JSON.stringify({
          query: query.query,
          category: query.category || 'general',
          language: query.language || 'en',
          context: query.context,
        }),
        signal: controller.signal,
      })

      if (response.status === 429) {
        throw new Error('Too many requests. Please wait before trying again.')
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Stream failed')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Failed to get response stream')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.status === 'started') {
                // Stream started
              } else if (data.status === 'completed') {
                // Stream completed
              } else if (data.error) {
                throw new Error(data.error)
              } else if (data.text) {
                yield data.text
              }
            } catch (error) {
              console.error('Failed to parse stream data:', error)
            }
          }
        }
      }
    } finally {
      this.abortControllers.delete(key)
    }
  }

  /**
   * Get contextual information about a specific well
   */
  async getWellContext(wellId: string): Promise<WellContext> {
    try {
      const response = await fetch(`${this.baseURL}/ai/context/well/${wellId}`, {
        headers: {
          Authorization: this.getAuthHeader(),
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch well context: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to get well context:', error)
      throw error
    }
  }

  /**
   * Get suggested questions for a given context
   */
  async getSuggestedQuestions(
    context: 'health' | 'maintenance' | 'water_quality' | 'general'
  ): Promise<SuggestedQuestions> {
    try {
      const response = await fetch(`${this.baseURL}/ai/suggest-questions/${context}`)

      if (!response.ok) {
        throw new Error('Failed to fetch suggested questions')
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to get suggested questions:', error)
      throw error
    }
  }

  /**
   * Translate text between English and Krio
   */
  async translate(text: string, targetLanguage: 'en' | 'krio'): Promise<TranslationResult> {
    if (!text || !text.trim()) {
      throw new Error('Text cannot be empty')
    }

    try {
      const response = await fetch(`${this.baseURL}/ai/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthHeader(),
        },
        body: JSON.stringify({
          text: text.trim(),
          target_language: targetLanguage,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Translation failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Translation failed:', error)
      throw error
    }
  }

  /**
   * Cancel ongoing streaming request
   */
  cancelStream(key: string): void {
    const controller = this.abortControllers.get(key)
    if (controller) {
      controller.abort()
      this.abortControllers.delete(key)
    }
  }

  /**
   * Get authorization header with JWT token if available
   */
  private getAuthHeader(): string {
    const token = localStorage.getItem('cf_token')
    return token ? `Bearer ${token}` : ''
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

const apiURL = import.meta.env.VITE_API_URL || '/api'
export const aiService = new AIServiceClient(apiURL)

// ============================================================================
// CUSTOM HOOK FOR REACT
// ============================================================================

import { useState, useCallback } from 'react'

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<AIResponse | null>(null)
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [streaming, setStreaming] = useState<string>('')

  /**
   * Check AI health
   */
  const checkHealth = useCallback(async () => {
    try {
      setError(null)
      const status = await aiService.getHealth()
      setHealth(status)
      return status
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Health check failed'
      setError(message)
      throw err
    }
  }, [])

  /**
   * Ask AI a question
   */
  const ask = useCallback(async (query: AIQuery) => {
    setLoading(true)
    setError(null)
    setResponse(null)
    setStreaming('')

    try {
      const result = await aiService.ask(query)
      setResponse(result)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get AI response'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Stream AI response
   */
  const stream = useCallback(async (query: AIQuery) => {
    setLoading(true)
    setError(null)
    setResponse(null)
    setStreaming('')

    try {
      let fullText = ''
      for await (const chunk of aiService.stream(query)) {
        fullText += chunk
        setStreaming(fullText)
      }

      const finalResponse: AIResponse = {
        answer: fullText,
        query: query.query,
        category: query.category || 'general',
        language: query.language || 'en',
        context_used: !!query.context,
        cached: false,
      }
      setResponse(finalResponse)
      return fullText
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Stream failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Get well context
   */
  const getWellContext = useCallback(async (wellId: string) => {
    try {
      setError(null)
      return await aiService.getWellContext(wellId)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get well context'
      setError(message)
      throw err
    }
  }, [])

  /**
   * Get suggested questions
   */
  const getSuggestedQuestions = useCallback(
    async (context: 'health' | 'maintenance' | 'water_quality' | 'general') => {
      try {
        setError(null)
        return await aiService.getSuggestedQuestions(context)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to get suggestions'
        setError(message)
        throw err
      }
    },
    []
  )

  /**
   * Translate text
   */
  const translate = useCallback(async (text: string, targetLanguage: 'en' | 'krio') => {
    try {
      setError(null)
      return await aiService.translate(text, targetLanguage)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Translation failed'
      setError(message)
      throw err
    }
  }, [])

  const clearState = useCallback(() => {
    setResponse(null)
    setStreaming('')
    setError(null)
    setLoading(false)
  }, [])

  return {
    loading,
    error,
    response,
    health,
    streaming,
    checkHealth,
    ask,
    stream,
    clearState,
    getWellContext,
    getSuggestedQuestions,
    translate,
  }
}

export default aiService

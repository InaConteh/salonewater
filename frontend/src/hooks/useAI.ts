import { useState, useCallback } from 'react'
import { aiService, AIQuery, AIResponse } from '../services/aiService'

interface UseAIState {
  response: AIResponse | null
  streaming: string
  loading: boolean
  error: string | null
}

export function useAI() {
  const [state, setState] = useState<UseAIState>({
    response: null,
    streaming: '',
    loading: false,
    error: null,
  })

  const ask = useCallback(async (query: AIQuery) => {
    setState({
      response: null,
      streaming: '',
      loading: true,
      error: null,
    })

    try {
      const response = await aiService.ask(query)
      setState({
        response,
        streaming: '',
        loading: false,
        error: null,
      })
    } catch (err) {
      setState({
        response: null,
        streaming: '',
        loading: false,
        error: err instanceof Error ? err.message : 'An error occurred',
      })
    }
  }, [])

  const stream = useCallback(async (query: AIQuery) => {
    setState({
      response: null,
      streaming: '',
      loading: true,
      error: null,
    })

    try {
      let fullText = ''
      for await (const chunk of aiService.stream(query)) {
        fullText += chunk
        setState((prev) => ({
          ...prev,
          streaming: fullText,
        }))
      }

      // Convert streamed response to AIResponse format
      const response: AIResponse = {
        answer: fullText,
        query: query.query,
        category: query.category || 'general',
        language: query.language || 'en',
        context_used: !!query.context,
        cached: false,
      }

      setState({
        response,
        streaming: '',
        loading: false,
        error: null,
      })
    } catch (err) {
      setState({
        response: null,
        streaming: '',
        loading: false,
        error: err instanceof Error ? err.message : 'Stream error occurred',
      })
    }
  }, [])

  const clearState = useCallback(() => {
    setState({
      response: null,
      streaming: '',
      loading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    ask,
    stream,
    clearState,
  }
}

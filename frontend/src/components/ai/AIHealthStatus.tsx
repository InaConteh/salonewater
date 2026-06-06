import React, { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Loader } from 'lucide-react'
import { aiService, HealthStatus } from '../../services/aiService'

export const AIHealthStatus: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setLoading(true)
        setError(null)
        const status = await aiService.getHealth()
        setHealth(status)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check AI health')
        setHealth(null)
      } finally {
        setLoading(false)
      }
    }

    checkHealth()
    // Refresh every 30 seconds
    const interval = setInterval(checkHealth, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <Loader className="w-4 h-4 animate-spin" />
        Checking AI status...
      </div>
    )
  }

  if (error || !health) {
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm">
        <AlertCircle className="w-4 h-4" />
        AI service unavailable
      </div>
    )
  }

  const isHealthy = health.ollama.status === 'healthy'

  return (
    <div
      className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${
        isHealthy
          ? 'bg-green-50 text-green-700'
          : 'bg-yellow-50 text-yellow-700'
      }`}
    >
      {isHealthy ? (
        <>
          <CheckCircle2 className="w-4 h-4" />
          <span>AI Ready • {health.ollama.model} • {health.ollama.latency_ms}ms</span>
        </>
      ) : (
        <>
          <AlertCircle className="w-4 h-4" />
          <span>AI Warming up... {health.ollama.error || 'Starting Ollama'}</span>
        </>
      )}
    </div>
  )
}

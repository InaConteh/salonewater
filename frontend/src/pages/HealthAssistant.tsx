/**
 * Health Assistant Page
 * Dedicated page for health-related AI questions
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Sparkles, MessageCircle, Info, Languages, BookOpen, Map, Settings, Trash2 } from 'lucide-react'

import {
  AIQueryForm,
  AIResponseDisplay,
  AIHealthStatus,
} from '@/components/ai'

import { Button, Card } from '@/components/ui'
import { useAI } from '@/services/aiService'
import type { AIQuery } from '@/services/aiService'
import { cn } from '@/lib/cn'

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
  useEffect(() => {}, [])
  const { response, streaming, loading, error, stream } = useAI()

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

  const clearState = () => {
    // This would typically reload or reset component state
    // For now, just reload the page to clear all state
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Header */}
      <section className="bg-primary pt-24 pb-32 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
            alt="Medical background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="page-container relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="h-3 w-3" />
                AI Powered Assistant
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Water Health Assistant</h1>
              <p className="text-xl text-white/80 font-medium leading-relaxed">
                Your AI companion for water safety, sanitation, and disease prevention in Sierra Leone.
              </p>
            </div>
            <div className="shrink-0">
               <AIHealthStatus />
            </div>
          </div>
        </div>
      </section>

      <div className="page-container -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Sidebar / Controls */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 border-none shadow-soft-xl bg-white overflow-hidden">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Languages className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Language Settings</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                {(['en', 'krio'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "py-2 px-4 rounded-lg font-bold text-sm transition-all",
                      language === lang
                        ? "bg-white text-primary shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {lang === 'en' ? 'English' : 'Krio'}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground italic">
                {language === 'en'
                  ? 'Switch to Krio for responses in your local dialect.'
                  : 'Una switch go English if una wan for read am na English.'}
              </p>
            </Card>

            <Card className="p-6 border-none shadow-soft-xl bg-white">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-bold text-lg">Quick Questions</h3>
              </div>

              <div className="space-y-2">
                {QUICK_QUESTIONS[language].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(q)}
                    disabled={loading}
                    className="w-full text-left p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/30 hover:shadow-md transition-all text-sm font-medium group"
                  >
                    <span className="text-slate-700 group-hover:text-primary">{q}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-none shadow-soft-xl bg-amber-50 border-l-4 border-l-amber-500">
               <div className="flex gap-4">
                  <Info className="h-6 w-6 text-amber-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-amber-900 mb-1">Medical Disclaimer</h4>
                    <p className="text-xs text-amber-800/80 leading-relaxed">
                      This AI provides general health information, not medical diagnosis.
                      If you have serious symptoms, please consult a health worker immediately.
                    </p>
                  </div>
               </div>
            </Card>
          </div>

          {/* Main Content / Chat */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-6 md:p-8 border-none shadow-soft-xl bg-white min-h-[500px] flex flex-col">
              <div className="flex-1">
                 {!(loading || streaming || response || error) && (
                   <div className="h-full flex flex-col items-center justify-center text-center py-20">
                      <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                        <MessageCircle className="h-10 w-10 text-primary opacity-40" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">How can I help you today?</h3>
                      <p className="text-slate-500 max-w-md">
                        Select a quick question from the sidebar or type your own question below to get started.
                      </p>
                   </div>
                 )}

                 {/* Response Area */}
                {(loading || streaming || response || error) && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    {loading && streaming === '' && (
                      <div className="flex gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div className="space-y-2 py-1 flex-1">
                          <p className="text-sm font-bold text-primary">AI is thinking...</p>
                          <div className="h-2 w-24 bg-primary/20 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    )}

                    {/* Streaming Markdown Response */}
                    {streaming && (
                      <div className="flex gap-4">
                         <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                            <Sparkles className="h-5 w-5 text-white" />
                         </div>
                         <div className="flex-1 bg-slate-50 rounded-2xl rounded-tl-none p-6 border border-slate-100 shadow-sm overflow-x-auto">
                            <div className="prose prose-blue prose-slate max-w-none prose-headings:font-bold prose-p:leading-relaxed">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {streaming}
                              </ReactMarkdown>
                            </div>
                         </div>
                      </div>
                    )}

                    {/* Final Response */}
                    {response && !loading && (
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <AIResponseDisplay response={response} />
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {error && (
                      <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20 text-center">
                        <div className="h-12 w-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Trash2 className="h-6 w-6 text-destructive" />
                        </div>
                        <h4 className="font-bold text-destructive mb-1">Something went wrong</h4>
                        <p className="text-sm text-destructive/80 mb-4">{error}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearState}
                          className="border-destructive text-destructive hover:bg-destructive/10"
                        >
                          Clear and try again
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="mt-12 pt-8 border-t">
                <AIQueryForm
                  onSubmit={handleCustomQuestion}
                  isLoading={loading}
                  disabled={loading}
                  placeholder={
                    language === 'en'
                      ? 'Ask about water safety or health risks...'
                      : 'Ask bout wata safe or heltn risk...'
                  }
                  showLanguageSelect={false}
                />
              </div>
            </Card>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/health" className="group">
                <Card className="p-4 bg-white border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group-hover:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Health Library</h4>
                      <p className="text-xs text-muted-foreground">Expert tips & guides</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link to="/map" className="group">
                <Card className="p-4 bg-white border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group-hover:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                      <Map className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Water Map</h4>
                      <p className="text-xs text-muted-foreground">Find safe water</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link to="/maintenance" className="group">
                <Card className="p-4 bg-white border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group-hover:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                      <Settings className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Maintenance</h4>
                      <p className="text-xs text-muted-foreground">Learn how to fix wells</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

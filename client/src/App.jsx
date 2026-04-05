import { useState } from 'react'
import Hero from './components/Hero'
import Scanner from './components/Scanner'
import ResultCard from './components/ResultCard'

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyzeUrl = async (url) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <Hero />
        <Scanner onAnalyze={analyzeUrl} loading={loading} />

        {error && (
          <div className="card p-4 border-red-500/20 bg-red-500/5 text-red-400 text-sm font-mono text-center mb-4 fade-in">
            ⚠ {error}
          </div>
        )}

        {loading && (
          <div className="card p-10 text-center fade-in">
            <div className="flex items-center justify-center gap-2 mb-3">
              {[0, 0.15, 0.3].map((delay, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" style={{ animationDelay: `${delay}s` }} />
              ))}
            </div>
            <p className="text-slate-500 text-sm font-mono">Querying 90+ threat intelligence engines...</p>
          </div>
        )}

        {result && !loading && <ResultCard result={result} />}
      </div>
    </div>
  )
}
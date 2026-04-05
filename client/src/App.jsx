import { useState } from 'react'
import Hero from './components/Hero'
import Scanner from './components/Scanner'
import ResultCard from './components/ResultCard'
import ScanHistory from './components/ScanHistory'

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  const analyzeUrl = async (url) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data)
      setHistory(prev => {
        const filtered = prev.filter(h => h.url !== url)
        return [{ url, threatScore: data.threatScore, domain: data.domain }, ...filtered].slice(0, 5)
      })
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

        {history.length > 0 && !loading && (
          <ScanHistory history={history} onRecan={analyzeUrl} />
        )}

        {error && (
          <div className="card p-4 border-red-500/20 bg-red-500/5 text-red-400 text-sm font-mono text-center mb-4 fade-in">
            ⚠ {error}
          </div>
        )}

        {loading && (
          <div className="card p-10 text-center fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-16 h-16">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 64" style={{ animation: 'spin 1.5s linear infinite' }}>
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(74,222,128,0.15)" strokeWidth="4" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#4ade80" strokeWidth="4"
                    strokeLinecap="round" strokeDasharray="40 140" />
                </svg>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 64" style={{ animation: 'spin 1s linear infinite reverse' }}>
                  <circle cx="32" cy="32" r="18" fill="none" stroke="rgba(74,222,128,0.1)" strokeWidth="3" />
                  <circle cx="32" cy="32" r="18" fill="none" stroke="rgba(74,222,128,0.6)" strokeWidth="3"
                    strokeLinecap="round" strokeDasharray="20 90" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-white text-sm font-mono mb-1">Analyzing threat intelligence...</p>
            <p className="text-slate-600 text-xs font-mono">Querying 90+ security engines</p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {result && !loading && <ResultCard result={result} />}
      </div>
    </div>
  )
}
import { useState, useRef, useEffect } from 'react'

const POPULAR_SITES = [
  'https://google.com', 'https://facebook.com', 'https://twitter.com',
  'https://instagram.com', 'https://youtube.com', 'https://reddit.com',
  'https://linkedin.com', 'https://github.com', 'https://paypal.com',
  'https://amazon.com', 'https://netflix.com', 'https://apple.com',
  'https://microsoft.com', 'https://dropbox.com', 'https://spotify.com',
  'https://discord.com', 'https://twitch.tv', 'https://tiktok.com',
  'https://whatsapp.com', 'https://telegram.org', 'https://zoom.us',
  'https://slack.com', 'https://notion.so', 'https://figma.com',
  'https://stackoverflow.com', 'https://medium.com', 'https://shopify.com',
  'https://wordpress.com', 'https://cloudflare.com', 'https://vercel.com',
]

const QUICK = [
  { label: 'google.com', url: 'https://google.com' },
  { label: 'github.com', url: 'https://github.com' },
  { label: 'paypal.com', url: 'https://paypal.com' },
]

export default function Scanner({ onAnalyze, loading }) {
  const [url, setUrl] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  const handleChange = (val) => {
    setUrl(val)
    setHighlighted(-1)
    if (val.length < 1) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    const q = val.toLowerCase().replace(/https?:\/\//, '')
    const matches = POPULAR_SITES.filter(site =>
      site.replace('https://', '').includes(q)
    ).slice(0, 6)
    setSuggestions(matches)
    setShowSuggestions(matches.length > 0)
  }

  const handleSelect = (site) => {
    setUrl(site)
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleSubmit = () => {
    if (url.trim()) {
      setShowSuggestions(false)
      let finalUrl = url.trim()
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl
      }
      setUrl(finalUrl)
      onAnalyze(finalUrl)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      if (highlighted >= 0 && suggestions[highlighted]) {
        handleSelect(suggestions[highlighted])
      } else {
        handleSubmit()
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const highlight = (text, query) => {
    const q = query.toLowerCase().replace(/https?:\/\//, '')
    const plain = text.replace('https://', '')
    const idx = plain.toLowerCase().indexOf(q)
    if (idx === -1) return <span>{plain}</span>
    return (
      <span>
        {plain.slice(0, idx)}
        <span style={{ color: '#4ade80' }}>{plain.slice(idx, idx + q.length)}</span>
        {plain.slice(idx + q.length)}
      </span>
    )
  }

  return (
    <div className="card p-5 mb-8 fade-in-up-1">
      <div className="stat-label mb-3">URL Analysis</div>
      <div className="flex gap-3 relative" ref={containerRef}>
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={e => handleChange(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Enter any URL or domain... e.g. suspicious-site.com"
            className="input-field"
          />

          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 card overflow-hidden z-50" style={{ border: '1px solid rgba(74,222,128,0.2)' }}>
              {suggestions.map((site, i) => (
                <div
                  key={site}
                  onMouseDown={() => handleSelect(site)}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
                  style={{
                    background: i === highlighted ? 'rgba(74,222,128,0.06)' : 'transparent',
                    borderBottom: i < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                  onMouseEnter={() => setHighlighted(i)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  <span className="font-mono text-sm text-slate-300">
                    {highlight(site, url)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleSubmit} disabled={loading || !url.trim()} className="btn-primary">
          {loading ? 'Scanning...' : 'Analyze →'}
        </button>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <span className="text-xs text-slate-600 font-mono">Quick scan:</span>
        {QUICK.map(q => (
          <button
            key={q.url}
            onClick={() => setUrl(q.url)}
            className="text-xs font-mono text-slate-500 hover:text-green-400 transition-colors"
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  )
}
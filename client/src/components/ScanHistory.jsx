export default function ScanHistory({ history, onRescan }) {
  const getScoreColor = (score) => {
    if (score === 0) return { text: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20', label: 'Clean' }
    if (score < 20) return { text: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', label: 'Low Risk' }
    if (score < 50) return { text: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20', label: 'Suspicious' }
    return { text: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', label: 'Dangerous' }
  }

  return (
    <div className="card p-5 mb-6 fade-in">
      <div className="stat-label mb-4">Recent Scans</div>
      <div className="space-y-2">
        {history.map((item, i) => {
          const score = getScoreColor(item.threatScore)
          return (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 card-inner rounded-lg hover:bg-white/[0.04] transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span className="font-mono text-sm text-slate-300 truncate">{item.domain}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`badge border ${score.bg} ${score.text}`}>
                  {item.threatScore === 0 ? '✓' : '!'} {score.label}
                </span>
                <button
                  onClick={() => onRescan(item.url)}
                  className="text-xs font-mono text-slate-600 hover:text-green-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  Rescan →
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
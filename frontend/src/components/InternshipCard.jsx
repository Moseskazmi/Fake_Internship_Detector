import { motion } from 'framer-motion'

export default function InternshipCard({ search, onClick, onDelete, onBookmark }) {
  const date = new Date(search.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const scoreColor =
    search.trust_score >= 75
      ? 'text-success-600 bg-success-100 dark:bg-success-900/30'
      : search.trust_score >= 50
        ? 'text-warning-600 bg-warning-100 dark:bg-warning-900/30'
        : 'text-danger-600 bg-danger-100 dark:bg-danger-900/30'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="glass-card p-5 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{search.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{date}</p>
        </div>
        <span className={`badge ${scoreColor} shrink-0`}>{search.trust_score}%</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {search.risk_level}
        </span>
        <div className="flex items-center gap-1">
          {onBookmark && (
            <button
              onClick={(e) => { e.stopPropagation(); onBookmark(search) }}
              className="btn-ghost !p-1.5"
              aria-label="Bookmark"
            >
              <BookmarkIcon filled={search.bookmarked} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(search) }}
              className="btn-ghost !p-1.5 text-danger-500"
              aria-label="Delete"
            >
              <TrashIcon />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function BookmarkIcon({ filled }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      className="w-4 h-4"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-4 h-4"
    >
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

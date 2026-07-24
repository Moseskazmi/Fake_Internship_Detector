import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Trash2, Download, Filter, Bookmark } from 'lucide-react'
import { fetchSearches, deleteSearch, toggleBookmark } from '../services/api'
import InternshipCard from '../components/InternshipCard'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'

export default function History() {
  const [searches, setSearches] = useState(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const load = async () => {
    const { data } = await fetchSearches()
    setSearches(data || [])
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!searches) return []
    return searches.filter((s) => {
      const matchesQuery = s.title.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'all' ? true : filter === 'bookmarked' ? s.bookmarked : s.risk_level === filter
      return matchesQuery && matchesFilter
    })
  }, [searches, query, filter])

  const handleDelete = async (s) => {
    const { error } = await deleteSearch(s.id)
    if (error) {
      toast.error('Could not delete')
      return
    }
    setSearches((prev) => prev.filter((x) => x.id !== s.id))
    toast.success('Deleted')
  }

  const handleBookmark = async (s) => {
    const next = !s.bookmarked
    setSearches((prev) => prev.map((x) => (x.id === s.id ? { ...x, bookmarked: next } : x)))
    await toggleBookmark(s.id, next)
    toast.success(next ? 'Bookmarked' : 'Removed bookmark')
  }

  const handleExport = () => {
    const lines = [
      'FAKE INTERNSHIP DETECTOR - HISTORY EXPORT',
      '========================================',
      '',
      ...filtered.map((s, i) => (
        `${i + 1}. ${s.title}\n   Risk: ${s.risk_level} | Score: ${s.trust_score}% | Date: ${new Date(s.created_at).toLocaleDateString()}\n   Input: ${s.input_value.slice(0, 100)}...`
      )),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'internship-history.txt'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('History exported')
  }

  if (!searches) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <Loading label="Loading history..." />
      </div>
    )
  }

  const filters = ['all', 'Safe', 'Moderate', 'High Risk', 'Very Dangerous', 'bookmarked']

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Scan History</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">{searches.length} internships scanned.</p>
          </div>
          {searches.length > 0 && (
            <button onClick={handleExport} className="btn-secondary">
              <Download className="w-4 h-4" /> Export Report
            </button>
          )}
        </motion.div>

        {searches.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title..."
                className="input-field pl-10"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                    filter === f
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              {searches.length === 0
                ? 'No scans yet. Analyze your first internship to see it here.'
                : 'No results match your search.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((s) => (
                <InternshipCard
                  key={s.id}
                  search={s}
                  onDelete={handleDelete}
                  onBookmark={handleBookmark}
                  onClick={() => toast(s.risk_level + ' — ' + s.trust_score + '%')}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

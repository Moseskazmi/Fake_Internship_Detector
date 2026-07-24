import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Brain,
  Lightbulb,
  ListChecks,
  Share2,
  Copy,
  Bookmark,
  BookmarkCheck,
  Download,
  RotateCcw,
} from 'lucide-react'
import SearchBar from '../components/SearchBar'
import TrustScore from '../components/TrustScore'
import RiskMeter from '../components/RiskMeter'
import Loading from '../components/Loading'
import { analyzeInternship, validateAnalyzeInput, deriveTitle } from '../utils/validator'
import { saveSearch, toggleBookmark } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const STATUS_ICON = {
  pass: { Icon: CheckCircle2, color: 'text-success-500', bg: 'bg-success-50 dark:bg-success-900/20', label: 'Passed' },
  fail: { Icon: XCircle, color: 'text-danger-500', bg: 'bg-danger-50 dark:bg-danger-900/20', label: 'Failed' },
  warn: { Icon: AlertTriangle, color: 'text-warning-500', bg: 'bg-warning-50 dark:bg-warning-900/20', label: 'Warning' },
}

export default function Analyze() {
  const location = useLocation()
  const { user } = useAuth()
  const [input, setInput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [savedId, setSavedId] = useState(null)
  const [bookmarked, setBookmarked] = useState(false)

  const runAnalysis = useCallback(
    async (inputType, inputValue) => {
      setLoading(true)
      setResult(null)
      setSavedId(null)
      setBookmarked(false)
      // simulate processing time for UX
      await new Promise((r) => setTimeout(r, 1400))
      const validation = validateAnalyzeInput({ inputType, inputValue })
      if (!validation.valid) {
        toast.error(validation.message)
        setLoading(false)
        return
      }
      const analysis = analyzeInternship(inputType, inputValue)
      setResult(analysis)
      setLoading(false)
      // persist to history if logged in
      if (user) {
        const { data, error } = await saveSearch({
          title: deriveTitle(inputType, inputValue),
          inputType,
          inputValue,
          trustScore: analysis.trustScore,
          riskLevel: analysis.riskLevel,
          checks: analysis.checks,
          suggestions: analysis.suggestions,
          bookmarked: false,
        })
        if (error) {
          toast.error('Could not save to history.')
        } else {
          setSavedId(data.id)
        }
      }
    },
    [user]
  )

  // Auto-run if navigated from search bar with input
  useEffect(() => {
    if (location.state?.inputType && location.state?.inputValue) {
      setInput(location.state)
      runAnalysis(location.state.inputType, location.state.inputValue)
    }
  }, [location.state, runAnalysis])

  const handleBookmark = async () => {
    if (!savedId) return
    const next = !bookmarked
    setBookmarked(next)
    await toggleBookmark(savedId, next)
    toast.success(next ? 'Bookmarked' : 'Removed bookmark')
  }

  const handleCopy = () => {
    if (!result) return
    const text = `Fake Internship Detector Report\nTrust Score: ${result.trustScore}%\nRisk Level: ${result.riskLevel}\n\nChecks:\n${result.checks.map((c) => `- ${c.label}: ${c.detail}`).join('\n')}`
    navigator.clipboard.writeText(text)
    toast.success('Report copied to clipboard')
  }

  const handleShare = async () => {
    if (!result) return
    const text = `I scanned an internship with Fake Internship Detector — Trust Score: ${result.trustScore}% (${result.riskLevel}). Scan yours too!`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Fake Internship Detector', text })
      } catch {
        /* user cancelled */
      }
    } else {
      navigator.clipboard.writeText(text)
      toast.success('Share text copied')
    }
  }

  const handleDownload = () => {
    if (!result) return
    const lines = [
      'FAKE INTERNSHIP DETECTOR - REPORT',
      '================================',
      `Trust Score: ${result.trustScore}%`,
      `Risk Level: ${result.riskLevel}`,
      '',
      'CHECKS:',
      ...result.checks.map((c) => `  [${c.status.toUpperCase()}] ${c.label} - ${c.detail}`),
      '',
      'WHY IT MAY BE FAKE:',
      ...result.suggestions.whyFake.map((s) => `  - ${s}`),
      '',
      'WHY IT MAY BE GENUINE:',
      ...result.suggestions.whyGenuine.map((s) => `  - ${s}`),
      '',
      'THINGS TO VERIFY:',
      ...result.suggestions.thingsToVerify.map((s) => `  - ${s}`),
      '',
      'SAFETY TIPS:',
      ...result.suggestions.safetyTips.map((s) => `  - ${s}`),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'internship-report.txt'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Report downloaded')
  }

  const handleReset = () => {
    setResult(null)
    setInput(null)
    setSavedId(null)
    setBookmarked(false)
  }

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Analyze an Internship</h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Paste the offer text or a link to get an instant trust report.
          </p>
        </motion.div>

        {!result && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            <SearchBar />
            {input && (
              <div className="mt-6 glass-card p-4">
                <p className="text-xs text-slate-400 mb-1">Submitted input ({input.inputType}):</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 break-all">{input.inputValue}</p>
              </div>
            )}
          </motion.div>
        )}

        {loading && (
          <div className="py-20">
            <Loading fullscreen label="Running 12-point risk analysis..." />
          </div>
        )}

        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Summary */}
              <div className="glass-card p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <TrustScore score={result.trustScore} riskLevel={result.riskLevel} />
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-3">
                      {result.riskLevel === 'Safe' ? (
                        <ShieldCheck className="w-5 h-5 text-success-500" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-danger-500" />
                      )}
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {result.riskLevel === 'Safe'
                          ? 'This offer looks genuine'
                          : 'Caution: this offer has risk factors'}
                      </h2>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      Based on 12 automated checks, this internship scored a trust of {result.trustScore}%.
                      {result.riskLevel !== 'Safe' &&
                        ' Review the failed checks below before proceeding.'}
                    </p>
                    <RiskMeter score={result.trustScore} />
                    <div className="flex flex-wrap gap-2 mt-6">
                      <button onClick={handleDownload} className="btn-secondary !py-2 !px-4 text-sm">
                        <Download className="w-4 h-4" /> Download
                      </button>
                      <button onClick={handleCopy} className="btn-secondary !py-2 !px-4 text-sm">
                        <Copy className="w-4 h-4" /> Copy
                      </button>
                      <button onClick={handleShare} className="btn-secondary !py-2 !px-4 text-sm">
                        <Share2 className="w-4 h-4" /> Share
                      </button>
                      {savedId && (
                        <button onClick={handleBookmark} className="btn-secondary !py-2 !px-4 text-sm">
                          {bookmarked ? <BookmarkCheck className="w-4 h-4 text-primary-600" /> : <Bookmark className="w-4 h-4" />}
                          {bookmarked ? 'Saved' : 'Save'}
                        </button>
                      )}
                      <button onClick={handleReset} className="btn-ghost !py-2 !px-4 text-sm">
                        <RotateCcw className="w-4 h-4" /> New Scan
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checks */}
              <div className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <ListChecks className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Risk Checks</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.checks.map((c, i) => {
                    const cfg = STATUS_ICON[c.status]
                    return (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={`flex items-start gap-3 p-4 rounded-xl ${cfg.bg}`}
                      >
                        <cfg.Icon className={`w-5 h-5 shrink-0 mt-0.5 ${cfg.color}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{c.label}</p>
                            <span className="text-[10px] uppercase font-bold text-slate-400">{cfg.label}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{c.detail}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SuggestionCard icon={XCircle} title="Why it may be fake" color="text-danger-500" items={result.suggestions.whyFake} />
                <SuggestionCard icon={CheckCircle2} title="Why it may be genuine" color="text-success-500" items={result.suggestions.whyGenuine} />
                <SuggestionCard icon={AlertTriangle} title="Things to verify" color="text-warning-500" items={result.suggestions.thingsToVerify} />
                <SuggestionCard icon={Lightbulb} title="Safety tips" color="text-primary-500" items={result.suggestions.safetyTips} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SuggestionCard({ icon: Icon, title, color, items }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${color}`} />
        <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex gap-2">
            <span className={`shrink-0 ${color}`}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

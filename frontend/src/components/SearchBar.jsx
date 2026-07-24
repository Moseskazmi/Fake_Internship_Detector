import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Link2, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { isValidUrl, isNonEmpty } from '../utils/validator'

export default function SearchBar({ compact = false }) {
  const [mode, setMode] = useState('text')
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const handleAnalyze = () => {
    if (!isNonEmpty(value)) {
      toast.error('Please paste an internship description or URL.')
      return
    }
    if (mode === 'url' && !isValidUrl(value.trim())) {
      toast.error('Please enter a valid URL starting with http:// or https://')
      return
    }
    if (mode === 'text' && value.trim().length < 20) {
      toast.error('Please paste a bit more of the description (at least 20 characters).')
      return
    }
    navigate('/analyze', { state: { inputType: mode, inputValue: value } })
  }

  return (
    <div className={`w-full ${compact ? 'max-w-2xl' : 'max-w-3xl'} mx-auto`}>
      <div className="glass-card p-2 flex flex-col sm:flex-row gap-2">
        <div className="flex gap-1 p-1">
          <button
            onClick={() => setMode('text')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'text'
                ? 'bg-primary-600 text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" /> Text
          </button>
          <button
            onClick={() => setMode('url')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'url'
                ? 'bg-primary-600 text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Link2 className="w-4 h-4" /> URL
          </button>
        </div>
        <div className="relative flex-1">
          {mode === 'url' && <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />}
          {mode === 'text' && <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />}
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder={mode === 'url' ? 'Paste internship URL (https://...)' : 'Paste internship description here...'}
            className="w-full pl-10 pr-4 py-3 bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>
        <button onClick={handleAnalyze} className="btn-primary !rounded-xl">
          <Search className="w-5 h-5" /> Analyze
        </button>
      </div>
    </div>
  )
}

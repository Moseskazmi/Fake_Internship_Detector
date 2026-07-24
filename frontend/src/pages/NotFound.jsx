import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-8xl font-bold text-primary-600 dark:text-primary-400">404</h1>
        <p className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-100">Page not found</p>
        <p className="mt-2 text-slate-500 dark:text-slate-400">The page you are looking for does not exist.</p>
        <div className="flex gap-3 justify-center mt-8">
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link to="/analyze" className="btn-secondary">
            <Search className="w-4 h-4" /> Analyze
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

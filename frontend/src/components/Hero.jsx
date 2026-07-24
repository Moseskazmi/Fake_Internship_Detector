import { motion } from 'framer-motion'
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6">
      {/* gradient blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-primary-300/30 dark:bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-secondary-300/30 dark:bg-secondary-600/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-primary-600 dark:text-primary-400 mb-6"
        >
          <Sparkles className="w-4 h-4" />
          AI-powered internship scam detection
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white"
        >
          Detect Fake Internship Offers
          <span className="block text-primary-600 dark:text-primary-400">Before You Apply</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
        >
          Paste an internship description or link and get an instant trust score with a detailed
          risk report — just like a security scan for job offers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10"
        >
          <SearchBar />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400"
        >
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-success-500" /> 12-point risk check</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-success-500" /> Instant trust score</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-success-500" /> Free to use</span>
        </motion.div>
      </div>
    </section>
  )
}

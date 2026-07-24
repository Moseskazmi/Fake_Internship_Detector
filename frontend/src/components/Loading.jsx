import { motion } from 'framer-motion'

export default function Loading({ label = 'Analyzing internship...', fullscreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-slate-700"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-slate-500 dark:text-slate-400 font-medium"
      >
        {label}
      </motion.p>
    </div>
  )

  if (fullscreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    )
  }
  return content
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-5">
      <div className="skeleton h-5 w-3/4 mb-3" />
      <div className="skeleton h-3 w-1/3 mb-4" />
      <div className="skeleton h-4 w-1/2" />
    </div>
  )
}

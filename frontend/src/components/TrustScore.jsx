import { motion } from 'framer-motion'

const STATUS_CONFIG = {
  Safe: { color: 'text-success-600', bg: 'bg-success-100 dark:bg-success-900/30', ring: 'stroke-success-500', label: 'Safe' },
  Moderate: { color: 'text-warning-600', bg: 'bg-warning-100 dark:bg-warning-900/30', ring: 'stroke-warning-500', label: 'Moderate' },
  'High Risk': { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', ring: 'stroke-orange-500', label: 'High Risk' },
  'Very Dangerous': { color: 'text-danger-600', bg: 'bg-danger-100 dark:bg-danger-900/30', ring: 'stroke-danger-500', label: 'Very Dangerous' },
}

export default function TrustScore({ score, riskLevel, size = 180 }) {
  const config = STATUS_CONFIG[riskLevel] || STATUS_CONFIG.Safe
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth="12"
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={config.ring}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-4xl font-bold ${config.color}`}
          >
            {score}%
          </motion.span>
          <span className="text-xs text-slate-400 mt-1">Trust Score</span>
        </div>
      </div>
      <span className={`badge ${config.bg} ${config.color}`}>{config.label}</span>
    </div>
  )
}

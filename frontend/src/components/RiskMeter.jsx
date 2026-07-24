import { motion } from 'framer-motion'

export default function RiskMeter({ score }) {
  const segments = [
    { range: [0, 25], label: 'Very Dangerous', color: 'bg-danger-500' },
    { range: [25, 50], label: 'High Risk', color: 'bg-orange-500' },
    { range: [50, 75], label: 'Moderate', color: 'bg-warning-500' },
    { range: [75, 101], label: 'Safe', color: 'bg-success-500' },
  ]

  return (
    <div className="w-full">
      <div className="relative h-4 rounded-full overflow-hidden flex">
        {segments.map((s) => (
          <div key={s.label} className={`flex-1 ${s.color} opacity-30`} title={s.label} />
        ))}
        <motion.div
          className="absolute top-0 bottom-0 w-1.5 bg-slate-900 dark:bg-white rounded-full shadow-lg"
          initial={{ left: '0%' }}
          animate={{ left: `calc(${score}% - 3px)` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-slate-400">
        <span>Danger</span>
        <span>Moderate</span>
        <span>Safe</span>
      </div>
    </div>
  )
}

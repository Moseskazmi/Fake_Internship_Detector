import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Search, ShieldCheck, ShieldAlert, AlertTriangle, History as HistoryIcon } from 'lucide-react'
import { fetchSearches } from '../services/api'
import Loading from '../components/Loading'

const RISK_COLORS = {
  Safe: '#22c55e',
  Moderate: '#f59e0b',
  'High Risk': '#f97316',
  'Very Dangerous': '#ef4444',
}

export default function Dashboard() {
  const [searches, setSearches] = useState(null)

  useEffect(() => {
    fetchSearches().then(({ data }) => setSearches(data || []))
  }, [])

  const stats = useCallback(() => {
    if (!searches) return { total: 0, safe: 0, fake: 0, high: 0 }
    const safe = searches.filter((s) => s.risk_level === 'Safe').length
    const high = searches.filter((s) => s.risk_level === 'High Risk' || s.risk_level === 'Very Dangerous').length
    const fake = searches.filter((s) => s.risk_level !== 'Safe').length
    return { total: searches.length, safe, fake, high }
  }, [searches])()

  const pieData = ['Safe', 'Moderate', 'High Risk', 'Very Dangerous']
    .map((level) => ({
      name: level,
      value: searches?.filter((s) => s.risk_level === level).length || 0,
    }))
    .filter((d) => d.value > 0)

  const barData = ['Safe', 'Moderate', 'High Risk', 'Very Dangerous'].map((level) => ({
    name: level.replace(' ', '\n'),
    count: searches?.filter((s) => s.risk_level === level).length || 0,
    fill: RISK_COLORS[level],
  }))

  if (!searches) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <Loading label="Loading dashboard..." />
      </div>
    )
  }

  const cards = [
    { label: 'Total Searches', value: stats.total, icon: Search, color: 'text-primary-600 bg-primary-100 dark:bg-primary-900/30' },
    { label: 'Safe Internships', value: stats.safe, icon: ShieldCheck, color: 'text-success-600 bg-success-100 dark:bg-success-900/30' },
    { label: 'Fake Internships', value: stats.fake, icon: ShieldAlert, color: 'text-danger-600 bg-danger-100 dark:bg-danger-900/30' },
    { label: 'High Risk', value: stats.high, icon: AlertTriangle, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' },
  ]

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Your internship scan analytics at a glance.</p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${c.color}`}>
                <c.icon className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{c.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{c.label}</p>
            </motion.div>
          ))}
        </div>

        {stats.total === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-4">No scans yet.</p>
            <Link to="/analyze" className="btn-primary">Run your first scan</Link>
          </div>
        ) : (
          <>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="glass-card p-6">
                <h2 className="font-bold text-slate-900 dark:text-white mb-4">Risk Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} paddingAngle={3}>
                      {pieData.map((d) => (
                        <Cell key={d.name} fill={RISK_COLORS[d.name]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: 'none', background: 'rgba(15,23,42,0.9)', color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-6">
                <h2 className="font-bold text-slate-900 dark:text-white mb-4">Risk Level Counts</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: 'none', background: 'rgba(15,23,42,0.9)', color: '#fff' }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent searches */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900 dark:text-white">Recent Searches</h2>
                <Link to="/history" className="text-sm text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:underline">
                  View all <HistoryIcon className="w-4 h-4" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <th className="py-3 font-medium">Internship</th>
                      <th className="py-3 font-medium">Risk Level</th>
                      <th className="py-3 font-medium">Score</th>
                      <th className="py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searches.slice(0, 6).map((s) => (
                      <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-3 text-slate-700 dark:text-slate-200 max-w-xs truncate">{s.title}</td>
                        <td className="py-3">
                      <span
                        className="badge"
                        style={{ backgroundColor: `${RISK_COLORS[s.risk_level]}20`, color: RISK_COLORS[s.risk_level] }}
                      >
                        {s.risk_level}
                      </span>
                        </td>
                        <td className="py-3 font-semibold text-slate-700 dark:text-slate-200">{s.trust_score}%</td>
                        <td className="py-3 text-slate-400">
                          {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  ScanSearch,
  Brain,
  FileBarChart,
  Lock,
  Zap,
  ArrowRight,
  Star,
} from 'lucide-react'
import Hero from '../components/Hero'
import FeatureCard from '../components/FeatureCard'

const stats = [
  { value: 12000, suffix: '+', label: 'Internships Scanned' },
  { value: 98, suffix: '%', label: 'Detection Accuracy' },
  { value: 12, suffix: '', label: 'Risk Factors Checked' },
  { value: 5000, suffix: '+', label: 'Students Protected' },
]

const features = [
  { icon: ScanSearch, title: 'Instant Analysis', description: 'Paste any internship description or URL and get a detailed risk report in seconds.' },
  { icon: Brain, title: 'AI Risk Scoring', description: 'A weighted trust score from 0 to 100% based on 12 proven scam indicators.' },
  { icon: FileBarChart, title: 'Detailed Reports', description: 'Every check is explained — see exactly why an offer looks safe or suspicious.' },
  { icon: Lock, title: 'Privacy First', description: 'Your searches are private to your account. We never share your data.' },
  { icon: Zap, title: 'Fast & Free', description: 'No credit card, no install. Run a scan right from your browser.' },
  { icon: ShieldCheck, title: 'Safety Tips', description: 'Get actionable advice on what to verify before you share any personal details.' },
]

const testimonials = [
  {
    name: 'Ananya R.',
    role: 'B.Tech Student, Delhi',
    quote: 'I almost paid a "registration fee" for an internship. This tool flagged it as Very Dangerous before I sent any money.',
  },
  {
    name: 'Karthik M.',
    role: 'MCA Student, Chennai',
    quote: 'The trust score and the point-by-point checks make it so clear. I use it on every offer I get now.',
  },
  {
    name: 'Priya S.',
    role: 'B.Com Student, Pune',
    quote: 'Saved me from a fake work-from-home offer. The AI suggestions told me exactly what to verify.',
  },
]

function CountUp({ end, suffix = '', duration = 2000 }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onViewportEnter={(entry) => {
        // animate count
        const node = entry.target
        let start = 0
        const step = end / (duration / 16)
        const tick = () => {
          start += step
          if (start < end) {
            node.textContent = Math.floor(start).toLocaleString() + suffix
            requestAnimationFrame(tick)
          } else {
            node.textContent = end.toLocaleString() + suffix
          }
        }
        tick()
      }}
      className="text-3xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400"
    >
      0{suffix}
    </motion.span>
  )
}

export default function Home() {
  return (
    <div>
      <Hero />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">How it protects you</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            A security-grade scan for internship offers — built for students, by people who have seen the scams.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 0.05} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-600 dark:bg-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label} className="text-white">
                <CountUp end={s.value} suffix={s.suffix} />
                <p className="mt-2 text-sm text-primary-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Students trust us</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">Real stories from students who caught a scam in time.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex gap-1 mb-3 text-warning-500">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-4">
                <p className="font-semibold text-slate-800 dark:text-slate-100">{t.name}</p>
                <p className="text-xs text-slate-400">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-10 text-center"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Got an offer? Scan it now.</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            It takes 10 seconds and could save you from a scam.
          </p>
          <Link to="/analyze" className="btn-primary mt-6">
            Analyze an Internship <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

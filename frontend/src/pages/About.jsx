import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Cpu, ShieldQuestion, ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'How does the trust score work?',
    a: 'We run 12 checks against the internship text or URL — each check is weighted by how strongly it signals a scam. Failed checks subtract the most points, warnings subtract half. The final 0-100% score maps to a risk level.',
  },
  {
    q: 'Can the tool detect every fake internship?',
    a: 'No tool is 100% accurate. We flag common red flags (payment requests, free email domains, no interview process, etc.) to help you decide. Always do your own verification too.',
  },
  {
    q: 'Is my data stored?',
    a: 'Your scans are saved to your account so you can review them later. They are private to you and protected by row-level security — no other user can see them.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'You can run a scan without an account, but signing in lets you save history, bookmark reports, and see your dashboard analytics.',
  },
]

export default function About() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">About Us</h1>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            We built this tool after seeing too many students lose money and time to fake internship offers.
          </p>
        </motion.div>

        {/* Mission */}
        <section className="glass-card p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Every year, thousands of students fall for fake internship offers that demand registration fees,
            steal personal information, or waste months of their time. Our mission is simple: give students a
            free, instant way to check if an offer is genuine before they apply — using the same kind of
            risk-scoring approach that security tools use to scan URLs for malware.
          </p>
        </section>

        {/* How it works */}
        <section className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How It Works</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Paste the offer', desc: 'Drop in the internship description text or a link to the posting.' },
              { step: '2', title: 'We run 12 checks', desc: 'Each check scans for a known scam indicator — from payment requests to missing company details.' },
              { step: '3', title: 'Get a trust score', desc: 'A weighted 0-100% score tells you how safe the offer is, with every check explained.' },
              { step: '4', title: 'Read the advice', desc: 'AI-style suggestions tell you why it looks fake, why it looks genuine, and what to verify next.' },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">{s.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology */}
        <section className="glass-card p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-secondary-100 dark:bg-secondary-900/40 flex items-center justify-center text-secondary-600">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Technology</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['React + Vite', 'Tailwind CSS', 'Supabase', 'Framer Motion', 'Recharts', 'Lucide Icons'].map((t) => (
              <span key={t} className="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 justify-center">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-warning-100 dark:bg-warning-900/40 flex items-center justify-center text-warning-600">
              <ShieldQuestion className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">FAQ</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((f, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-100">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <p className="p-4 pt-0 text-sm text-slate-500 dark:text-slate-400">{f.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

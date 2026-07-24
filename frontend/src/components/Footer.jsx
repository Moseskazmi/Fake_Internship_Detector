import { Link } from 'react-router-dom'
import { ShieldCheck, Globe, MessageCircle, Share2, Mail } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  const links = {
    Product: [
      { to: '/analyze', label: 'Analyze Internship' },
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/history', label: 'History' },
    ],
    Company: [
      { to: '/about', label: 'About Us' },
      { to: '/contact', label: 'Contact' },
      { to: '/register', label: 'Sign Up' },
    ],
  }

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary-600 dark:text-primary-400 mb-3">
              <ShieldCheck className="w-6 h-6" />
              Fake Internship Detector
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Helping students avoid scam internship offers with AI-assisted risk analysis and trust scoring.
            </p>
            <div className="flex gap-3 mt-4">
              {[Globe, MessageCircle, Share2, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="font-semibold text-sm mb-3 text-slate-700 dark:text-slate-200">{heading}</h4>
              <ul className="space-y-2">
                {items.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-400">
          © {year} Fake Internship Detector. Built for student safety.
        </div>
      </div>
    </footer>
  )
}

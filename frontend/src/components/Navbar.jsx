import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Menu, X, Sun, Moon, LogOut, User, LayoutDashboard, History } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, signOut, darkMode, toggleDarkMode } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out')
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/analyze', label: 'Analyze' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-md py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary-600 dark:text-primary-400">
          <ShieldCheck className="w-7 h-7" />
          <span className="hidden sm:inline">Fake Internship Detector</span>
          <span className="sm:hidden">FID</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === l.to
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                location.pathname === '/dashboard'
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="btn-ghost !p-2"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="btn-ghost">
                <User className="w-4 h-4" /> Profile
              </Link>
              <button onClick={handleSignOut} className="btn-ghost text-danger-600 dark:text-danger-400">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">Get Started</Link>
            </>
          )}
        </div>

        <button
          className="md:hidden btn-ghost !p-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass mx-4 mt-2 rounded-2xl"
          >
            <div className="p-4 flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} className="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  {l.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link to="/dashboard" className="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link to="/history" className="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                    <History className="w-4 h-4" /> History
                  </Link>
                  <Link to="/profile" className="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <button onClick={handleSignOut} className="px-4 py-2 rounded-lg text-danger-600 dark:text-danger-400 text-left flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              )}
              <div className="flex items-center justify-between px-4 py-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-500">Dark mode</span>
                <button onClick={toggleDarkMode} className="btn-ghost !p-2">
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
              {!user && (
                <div className="flex gap-2 mt-2">
                  <Link to="/login" className="btn-secondary flex-1">Login</Link>
                  <Link to="/register" className="btn-primary flex-1">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

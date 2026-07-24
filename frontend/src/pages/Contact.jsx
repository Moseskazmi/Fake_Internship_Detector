import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Send, Globe, MessageCircle, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all fields.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email.')
      return
    }
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setName('')
      setEmail('')
      setMessage('')
      toast.success('Message sent! We will get back to you soon.')
    }, 1000)
  }

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Get in Touch</h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Questions, feedback, or a scam to report? We would love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1.5">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1.5">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="input-field resize-none" placeholder="Your message..." />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full">
                <Send className="w-4 h-4" /> {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          {/* Info + map */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">Contact Info</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Mail className="w-5 h-5 text-primary-500" /> support@fakedetector.app
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Phone className="w-5 h-5 text-primary-500" /> +91 98765 43210
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <MapPin className="w-5 h-5 text-primary-500" /> Bangalore, India
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                {[Globe, MessageCircle, Share2].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-700 transition-colors">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="glass-card p-6">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">Find Us</h2>
              <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-10 h-10 text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">Map placeholder — Bangalore, India</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, GraduationCap, BookOpen, Mail, Plus, X, Moon, Sun, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchSearches } from '../services/api'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, profile, updateProfile, darkMode, toggleDarkMode, signOut } = useAuth()
  const [fullName, setFullName] = useState('')
  const [college, setCollege] = useState('')
  const [course, setCourse] = useState('')
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [savedCount, setSavedCount] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '')
      setCollege(profile.college || '')
      setCourse(profile.course || '')
      setSkills(profile.skills || [])
    }
  }, [profile])

  useEffect(() => {
    fetchSearches().then(({ data }) => {
      setSavedCount(data?.filter((s) => s.bookmarked).length || 0)
    })
  }, [])

  const addSkill = () => {
    const s = skillInput.trim()
    if (!s) return
    if (skills.includes(s)) {
      toast.error('Skill already added')
      return
    }
    setSkills((prev) => [...prev, s])
    setSkillInput('')
  }

  const removeSkill = (s) => setSkills((prev) => prev.filter((x) => x !== s))

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({ fullName, college, course, skills })
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.message || 'Could not update')
    } finally {
      setSaving(false)
    }
  }

  if (!profile) {
    return <div className="pt-32 text-center text-slate-400">Loading profile...</div>
  }

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your Profile</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Manage your details and preferences.</p>
        </motion.div>

        {/* Account info */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold">
              {(fullName || user?.email || '?')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{fullName || 'Student'}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
              <p className="text-xs text-slate-400 mt-1">{savedCount} saved searches</p>
            </div>
          </div>
        </div>

        {/* Editable details */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="font-bold text-slate-900 dark:text-white">Personal Details</h2>

          <Field icon={User} label="Full Name">
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" placeholder="Your name" />
          </Field>
          <Field icon={GraduationCap} label="College">
            <input value={college} onChange={(e) => setCollege(e.target.value)} className="input-field" placeholder="Your college" />
          </Field>
          <Field icon={BookOpen} label="Course">
            <input value={course} onChange={(e) => setCourse(e.target.value)} className="input-field" placeholder="Your course" />
          </Field>
          <Field icon={Mail} label="Email">
            <input value={user?.email || ''} disabled className="input-field opacity-60 cursor-not-allowed" />
          </Field>

          {/* Skills */}
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1.5">Skills</label>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="input-field"
                placeholder="Add a skill and press Enter"
              />
              <button onClick={addSkill} className="btn-secondary !px-4">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((s) => (
                  <span key={s} className="badge bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                    {s}
                    <button onClick={() => removeSkill(s)} className="hover:text-danger-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Preferences */}
        <div className="glass-card p-6 mt-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Preferences</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {darkMode ? <Moon className="w-5 h-5 text-primary-500" /> : <Sun className="w-5 h-5 text-warning-500" />}
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Dark Mode</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary-600' : 'bg-slate-300'}`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow"
                animate={{ x: darkMode ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
        <Icon className="w-4 h-4 text-slate-400" /> {label}
      </label>
      {children}
    </div>
  )
}

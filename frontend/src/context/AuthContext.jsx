import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../services/supabase'
import { fetchProfile, upsertProfile } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('fid-dark')
    if (saved !== null) return saved === 'true'
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  })

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('fid-dark', String(darkMode))
  }, [darkMode])

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), [])

  const loadProfile = useCallback(async (userId) => {
    if (!userId) return
    const { data } = await fetchProfile(userId)
    if (data) {
      setProfile({
        id: data.id,
        fullName: data.full_name || '',
        college: data.college || '',
        course: data.course || '',
        skills: data.skills || [],
      })
    } else {
      // Create a blank profile row on first login
      const { data: created } = await upsertProfile({
        id: userId,
        fullName: '',
        college: '',
        course: '',
        skills: [],
      })
      if (created) {
        setProfile({
          id: created.id,
          fullName: created.full_name || '',
          college: created.college || '',
          course: created.course || '',
          skills: created.skills || [],
        })
      }
    }
  }, [])

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        loadProfile(s.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      ;(async () => {
        setSession(s)
        setUser(s?.user ?? null)
        if (s?.user) {
          await loadProfile(s.user.id)
        } else {
          setProfile(null)
        }
      })()
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [loadProfile])

  const signUp = useCallback(async ({ email, password, fullName }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) throw error
    if (data.user) {
      await upsertProfile({
        id: data.user.id,
        fullName,
        college: '',
        course: '',
        skills: [],
      })
    }
    return data
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) toast.error(error.message)
    setProfile(null)
  }, [])

  const updateProfile = useCallback(
    async (updates) => {
      if (!user) return
      const { data, error } = await upsertProfile({
        id: user.id,
        fullName: updates.fullName ?? profile?.fullName ?? '',
        college: updates.college ?? profile?.college ?? '',
        course: updates.course ?? profile?.course ?? '',
        skills: updates.skills ?? profile?.skills ?? [],
      })
      if (error) throw error
      if (data) {
        setProfile({
          id: data.id,
          fullName: data.full_name || '',
          college: data.college || '',
          course: data.course || '',
          skills: data.skills || [],
        })
      }
    },
    [user, profile]
  )

  const value = {
    session,
    user,
    profile,
    loading,
    darkMode,
    toggleDarkMode,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

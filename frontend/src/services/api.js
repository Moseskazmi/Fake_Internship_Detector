import { supabase } from './supabase'

// Save a completed analysis to the user's history
export async function saveSearch(record) {
  const { data, error } = await supabase
    .from('searches')
    .insert({
      title: record.title,
      input_type: record.inputType,
      input_value: record.inputValue,
      trust_score: record.trustScore,
      risk_level: record.riskLevel,
      checks: record.checks,
      suggestions: record.suggestions,
      bookmarked: record.bookmarked ?? false,
    })
    .select()
    .single()
  return { data, error }
}

export async function fetchSearches() {
  const { data, error } = await supabase
    .from('searches')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function deleteSearch(id) {
  const { error } = await supabase.from('searches').delete().eq('id', id)
  return { error }
}

export async function toggleBookmark(id, bookmarked) {
  const { data, error } = await supabase
    .from('searches')
    .update({ bookmarked })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  return { data, error }
}

export async function upsertProfile(profile) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: profile.id,
        full_name: profile.fullName,
        college: profile.college,
        course: profile.course,
        skills: profile.skills,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    .select()
    .single()
  return { data, error }
}

/*
# Create profiles and searches tables for Fake Internship Detector

1. New Tables
- `profiles`: extends auth.users with extra user info (name, college, course, skills).
  - id (uuid, PK, references auth.users)
  - full_name (text)
  - college (text)
  - course (text)
  - skills (text[])
  - created_at, updated_at (timestamps)
- `searches`: stores each internship analysis run by a user.
  - id (uuid, primary key)
  - user_id (uuid, references auth.users, defaults to auth.uid())
  - title (text) - internship title/identifier
  - input_type (text) - 'text' or 'url'
  - input_value (text) - the pasted description or URL
  - trust_score (integer 0-100)
  - risk_level (text) - 'Safe' | 'Moderate' | 'High Risk' | 'Very Dangerous'
  - checks (jsonb) - array of check results
  - suggestions (jsonb) - AI suggestions object
  - bookmarked (boolean, default false)
  - created_at (timestamp)

2. Security
- Enable RLS on both tables.
- profiles: owner-scoped CRUD (authenticated users manage their own profile row).
- searches: owner-scoped CRUD (each user only sees/edits/deletes their own searches).
- user_id on searches defaults to auth.uid() so inserts omitting user_id succeed.
*/

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  college text DEFAULT '',
  course text DEFAULT '',
  skills text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON public.profiles;
CREATE POLICY "select_own_profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;
CREATE POLICY "insert_own_profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS public.searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Internship',
  input_type text NOT NULL DEFAULT 'text',
  input_value text NOT NULL DEFAULT '',
  trust_score integer NOT NULL DEFAULT 0,
  risk_level text NOT NULL DEFAULT 'Safe',
  checks jsonb NOT NULL DEFAULT '[]'::jsonb,
  suggestions jsonb NOT NULL DEFAULT '{}'::jsonb,
  bookmarked boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_searches" ON public.searches;
CREATE POLICY "select_own_searches" ON public.searches
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_searches" ON public.searches;
CREATE POLICY "insert_own_searches" ON public.searches
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_searches" ON public.searches;
CREATE POLICY "update_own_searches" ON public.searches
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_searches" ON public.searches;
CREATE POLICY "delete_own_searches" ON public.searches
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_searches_user_id ON public.searches(user_id);
CREATE INDEX IF NOT EXISTS idx_searches_created_at ON public.searches(created_at DESC);

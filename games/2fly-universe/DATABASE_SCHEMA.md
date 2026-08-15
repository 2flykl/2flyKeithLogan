# 2Fly Universe — PostgreSQL / Supabase Schema

```sql
-- 2Fly Universe DB Migration
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Stars table (visitor stars)
CREATE TABLE IF NOT EXISTS public.stars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  galaxy_id VARCHAR(32) NOT NULL,
  region_id VARCHAR(32) NOT NULL,
  x DOUBLE PRECISION NOT NULL,
  y DOUBLE PRECISION NOT NULL,
  z DOUBLE PRECISION NOT NULL,
  display_name VARCHAR(60) NOT NULL,
  star_name VARCHAR(60),
  message VARCHAR(280),
  signature_url TEXT,
  is_demo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index spatial coordinates and user_id for fast lookup
CREATE INDEX IF NOT EXISTS idx_stars_galaxy_region ON public.stars(galaxy_id, region_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_stars_user ON public.stars(user_id) WHERE user_id IS NOT NULL;

-- Row Level Security (RLS)
ALTER TABLE public.stars ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all public stars
CREATE POLICY "Public stars are readable by everyone"
  ON public.stars FOR SELECT
  USING (true);

-- Allow authenticated users to insert exactly one primary star
CREATE POLICY "Users can insert their own primary star"
  ON public.stars FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

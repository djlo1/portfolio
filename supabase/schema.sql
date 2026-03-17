-- =============================================================
-- SUPABASE SCHEMA FOR DJLO PORTFOLIO
-- Run this ONCE in Supabase SQL Editor
-- =============================================================

-- ===================== CREATE TABLES =====================

CREATE TABLE IF NOT EXISTS personal_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  title TEXT,
  tagline TEXT,
  description TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  linkedin TEXT,
  youtube TEXT,
  photo_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  location TEXT,
  period TEXT,
  role TEXT,
  missions JSONB DEFAULT '[]',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  level INT DEFAULT 50,
  items JSONB DEFAULT '[]',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT,
  period TEXT,
  type TEXT DEFAULT 'certification',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tags JSONB DEFAULT '[]',
  highlight BOOLEAN DEFAULT false,
  image_url TEXT,
  link TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS languages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT,
  percentage INT DEFAULT 50,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================== RLS =====================

ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read personal_info" ON personal_info FOR SELECT USING (true);
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read education" ON education FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read languages" ON languages FOR SELECT USING (true);

-- Authenticated write
CREATE POLICY "Auth insert personal_info" ON personal_info FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update personal_info" ON personal_info FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete personal_info" ON personal_info FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert experiences" ON experiences FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update experiences" ON experiences FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete experiences" ON experiences FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert skills" ON skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update skills" ON skills FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete skills" ON skills FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert education" ON education FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update education" ON education FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete education" ON education FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert languages" ON languages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update languages" ON languages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete languages" ON languages FOR DELETE USING (auth.role() = 'authenticated');

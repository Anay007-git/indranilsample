-- =======================================================
-- STUDIOFLAG PORTFOLIO & CASE STUDIES SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor to set up the DB
-- Idempotent script: Safe to run multiple times
-- =======================================================

-- 1. Create case_studies table
CREATE TABLE IF NOT EXISTS public.case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    one_liner TEXT NOT NULL,
    category TEXT NOT NULL,
    year TEXT NOT NULL DEFAULT '2024',
    accent_color TEXT NOT NULL DEFAULT '#C6A15B',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    client_name TEXT,
    services TEXT[] DEFAULT ARRAY[]::TEXT[],
    hero_image TEXT,
    challenge TEXT,
    approach TEXT,
    outcome TEXT,
    pull_quote TEXT,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexes for fast filtering and ordering
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON public.case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_category ON public.case_studies(category);
CREATE INDEX IF NOT EXISTS idx_case_studies_sort_order ON public.case_studies(sort_order);
CREATE INDEX IF NOT EXISTS idx_case_studies_status ON public.case_studies(status);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- 4. Clean existing policies (idempotent)
DROP POLICY IF EXISTS "Public case studies are viewable by everyone" ON public.case_studies;
DROP POLICY IF EXISTS "Authenticated users can insert case studies" ON public.case_studies;
DROP POLICY IF EXISTS "Authenticated users can update case studies" ON public.case_studies;
DROP POLICY IF EXISTS "Authenticated users can delete case studies" ON public.case_studies;

-- 5. Re-create public read policy
CREATE POLICY "Public case studies are viewable by everyone" 
ON public.case_studies 
FOR SELECT 
USING (status = 'published' OR auth.role() = 'authenticated');

-- 6. Authenticated admin write policies
CREATE POLICY "Authenticated users can insert case studies" 
ON public.case_studies 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update case studies" 
ON public.case_studies 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete case studies" 
ON public.case_studies 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 7. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_case_studies_updated_at ON public.case_studies;
CREATE TRIGGER set_case_studies_updated_at
BEFORE UPDATE ON public.case_studies
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- =======================================================
-- SEED INITIAL 16 DOSSIERS (Optional: Only if table is empty)
-- =======================================================
INSERT INTO public.case_studies (name, slug, one_liner, category, year, accent_color, featured, sort_order, status, client_name, services, hero_image, challenge, approach, outcome, pull_quote, gallery_images)
VALUES 
(
  'Aethelgard AI',
  'aethelgard-ai',
  'Autonomous algorithmic intelligence for enterprise decision engineering.',
  'AI & Machine Learning',
  '2024',
  '#00F0FF',
  true,
  1,
  'published',
  'Aethelgard Neural Labs',
  ARRAY['Brand Architecture', 'Interface Systems', '3D Motion Design', 'Design Token Matrix'],
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
  'Aethelgard pioneered a breakthrough neural decision model but struggled to communicate its institutional superiority to sovereign funds.',
  'We architected an unapologetic, high-contrast visual identity fusing quantum topography with bespoke typographic disciplines.',
  'Secured $42M Series A funding within 90 days of launch, establishing immediate market category leadership.',
  'StudioFlag elevated our technology from obscure research into an institutional market force.',
  ARRAY['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80']
),
(
  'Vanguard Capital',
  'vanguard-capital',
  'Institutional venture architecture and sovereign wealth asset syndication.',
  'Fintech & Capital',
  '2024',
  '#C6A15B',
  true,
  2,
  'published',
  'Vanguard Global Partners',
  ARRAY['Executive Branding', 'Editorial Architecture', 'Investor Dossiers', 'Print Production'],
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
  'Vanguard needed to consolidate three sovereign wealth syndicates under a unified, ultra-premium heritage aesthetic.',
  'Formulated a timeless editorial identity blending Fraunces serif discipline with gold foil tactile physical artifacts.',
  'Facilitated $1.4B in syndicated capital commitments during the inaugural annual partner summit.',
  'The identity commands immediate deference across European and Gulf investment boards.',
  ARRAY['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']
),
(
  'Terraform Oceanic',
  'terraform-oceanic',
  'Autonomous aquatic infrastructure and deep sea atmospheric carbon capture.',
  'Climate & Deep Tech',
  '2023',
  '#5E8B7E',
  true,
  3,
  'published',
  'Terraform Marine Holdings',
  ARRAY['Environmental Identity', 'Spatial Systems', 'Interactive Telemetry', 'Field Documentation'],
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'Translating deep ocean kinetic hardware into a clear, trustworthy narrative for global governmental regulatory bodies.',
  'Constructed a scientific oceanic design system utilizing deep marine gradients and tactical telemetry readouts.',
  'Accelerated maritime permits across 4 sovereign jurisdictions, unlocking $85M in governmental infrastructure grants.',
  'Precision in design translated directly into regulatory trust and swift global clearance.',
  ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80']
)
ON CONFLICT (slug) DO NOTHING;

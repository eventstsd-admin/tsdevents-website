-- ============================================================================
-- MIGRATION: Update past_events schema to use event_date instead of date/time
-- ============================================================================
-- Run this in Supabase SQL Editor to fix the schema mismatch

-- Step 1: Drop event_photos table (depends on past_events)
DROP TABLE IF EXISTS event_photos CASCADE;

-- Step 2: Drop past_events table
DROP TABLE IF EXISTS past_events CASCADE;

-- Step 3: Create past_events with correct schema
CREATE TABLE public.past_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  event_date DATE NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS past_events_category_idx ON public.past_events(category);
CREATE INDEX IF NOT EXISTS past_events_event_date_idx ON public.past_events(event_date);
CREATE INDEX IF NOT EXISTS past_events_created_at_idx ON public.past_events(created_at DESC);

-- Step 5: Create event_photos table
CREATE TABLE public.event_photos (
  id BIGSERIAL PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.past_events(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(event_id, url)
);

-- Step 6: Create indexes for event_photos
CREATE INDEX IF NOT EXISTS event_photos_event_id_idx ON public.event_photos(event_id);
CREATE INDEX IF NOT EXISTS event_photos_created_at_idx ON public.event_photos(created_at DESC);

-- Step 7: Enable Row Level Security
ALTER TABLE public.past_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_photos ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS policies for past_events
CREATE POLICY "Anyone can view past events"
ON public.past_events
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create events"
ON public.past_events
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update events"
ON public.past_events
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete events"
ON public.past_events
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Step 9: Create RLS policies for event_photos
CREATE POLICY "Anyone can view event photos"
ON public.event_photos
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can add photos"
ON public.event_photos
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete photos"
ON public.event_photos
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- VERIFICATION QUERIES (Run these after the migration to verify)
-- ============================================================================
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'past_events' ORDER BY ordinal_position;
-- SELECT * FROM past_events LIMIT 1;

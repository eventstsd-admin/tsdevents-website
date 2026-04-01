-- ============================================================================
-- COMPREHENSIVE FIX: Database schema, foreign keys, and RLS policies
-- ============================================================================
-- Run this in Supabase SQL Editor to fix all event creation errors
-- This script:
-- 1. Drops and recreates event_photos with correct UUID foreign key
-- 2. Fixes all RLS policies to allow authenticated users
-- 3. Ensures proper cascading deletes

-- ============================================================================
-- Step 1: Drop existing event_photos table (has broken foreign key)
-- ============================================================================
DROP TABLE IF EXISTS event_photos CASCADE;

-- ============================================================================
-- Step 2: Ensure past_events table exists with correct schema
-- ============================================================================
-- This should already exist from previous runs
-- If you're starting fresh, uncomment below:
/*
DROP TABLE IF EXISTS past_events CASCADE;

CREATE TABLE past_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  event_date DATE NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_past_events_category ON past_events(category);
CREATE INDEX idx_past_events_date ON past_events(event_date);
*/

-- ============================================================================
-- Step 3: Recreate event_photos with correct schema
-- ============================================================================
CREATE TABLE event_photos (
  id BIGSERIAL PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES past_events(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, url)
);

CREATE INDEX idx_event_photos_event_id ON event_photos(event_id);
CREATE INDEX idx_event_photos_created_at ON event_photos(created_at DESC);

-- ============================================================================
-- Step 4: Enable RLS on both tables
-- ============================================================================
ALTER TABLE past_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Step 5: Drop ALL existing policies (clean slate)
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can read past events" ON past_events;
DROP POLICY IF EXISTS "Authenticated users can insert past events" ON past_events;
DROP POLICY IF EXISTS "Authenticated users can update past events" ON past_events;
DROP POLICY IF EXISTS "Authenticated users can delete past events" ON past_events;
DROP POLICY IF EXISTS "Admins can insert past events" ON past_events;
DROP POLICY IF EXISTS "Admins can update past events" ON past_events;
DROP POLICY IF EXISTS "Admins can delete past events" ON past_events;

DROP POLICY IF EXISTS "Anyone can read event photos" ON event_photos;
DROP POLICY IF EXISTS "Authenticated users can insert event photos" ON event_photos;
DROP POLICY IF EXISTS "Authenticated users can update event photos" ON event_photos;
DROP POLICY IF EXISTS "Authenticated users can delete event photos" ON event_photos;
DROP POLICY IF EXISTS "Admins can insert event photos" ON event_photos;
DROP POLICY IF EXISTS "Admins can update event photos" ON event_photos;
DROP POLICY IF EXISTS "Admins can delete event photos" ON event_photos;

-- ============================================================================
-- Step 6: Create NEW simplified RLS policies
-- ============================================================================

-- past_events policies
CREATE POLICY "Anyone can view past events"
ON past_events
FOR SELECT
USING (true);

CREATE POLICY "Only admins can create events"
ON past_events
FOR INSERT
WITH CHECK (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Only admins can update events"
ON past_events
FOR UPDATE
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Only admins can delete events"
ON past_events
FOR DELETE
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- event_photos policies
CREATE POLICY "Anyone can view event photos"
ON event_photos
FOR SELECT
USING (true);

CREATE POLICY "Only admins can upload photos"
ON event_photos
FOR INSERT
WITH CHECK (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Only admins can update photos"
ON event_photos
FOR UPDATE
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Only admins can delete photos"
ON event_photos
FOR DELETE
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- ============================================================================
-- VERIFICATION QUERIES (run to check everything is correct)
-- ============================================================================
/*
-- Check event_photos FK relationship:
SELECT 
  constraint_name,
  table_name,
  column_name,
  foreign_table_name,
  foreign_column_name
FROM information_schema.key_column_usage
WHERE table_name = 'event_photos'
AND constraint_name LIKE '%fk%';

-- Check all RLS policies:
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  qual
FROM pg_policies
WHERE tablename IN ('past_events', 'event_photos')
ORDER BY tablename, policyname;

-- Check table schema:
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('past_events', 'event_photos')
ORDER BY table_name, ordinal_position;
*/

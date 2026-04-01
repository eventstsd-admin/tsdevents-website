-- ============================================================================
-- TSD Events - Supabase Setup SQL
-- ============================================================================
-- Run these queries in Supabase SQL Editor to set up:
-- 1. Admin user metadata
-- 2. Past Events table
-- 3. Event Photos table (images linked to specific events - max 5 per event)
-- ============================================================================

-- ============================================================================
-- STEP 1: Set Admin User Metadata
-- ============================================================================
-- Note: The admin user must be created in Supabase Auth first
-- Auth Dashboard > Users > Create new user
-- Email: admin@tsd.in
-- Password: Admin@tsd.2010
-- Auto confirm: YES
-- After creating the user, run this query to add admin role:

UPDATE auth.users 
SET raw_user_meta_data = jsonb_build_object('role', 'admin', 'name', 'admin')
WHERE email = 'admin@tsd.in';

-- ============================================================================
-- STEP 2: Create Past Events Table
-- ============================================================================
-- This table stores past events that can have associated photos

CREATE TABLE IF NOT EXISTS past_events (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  event_date DATE NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_past_events_category ON past_events(category);
CREATE INDEX IF NOT EXISTS idx_past_events_date ON past_events(event_date DESC);

-- ============================================================================
-- STEP 3: Create Event Photos Table
-- ============================================================================
-- This table stores photos uploaded for each past event
-- Max 5 photos per event
-- Gallery page will randomly fetch from this table

CREATE TABLE IF NOT EXISTS event_photos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_id UUID NOT NULL REFERENCES past_events(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, url)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_event_photos_event_id ON event_photos(event_id);
CREATE INDEX IF NOT EXISTS idx_event_photos_uploaded_by ON event_photos(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_event_photos_created_at ON event_photos(created_at DESC);

-- ============================================================================
-- STEP 4: Enable Row Level Security (RLS)
-- ============================================================================
-- RLS ensures users can only access data they should

ALTER TABLE past_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 5: Create RLS Policies
-- ============================================================================

-- Event Photos Policies
CREATE POLICY "Anyone can read event photos" 
ON event_photos
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert event photos" 
ON event_photos
FOR INSERT 
WITH CHECK (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can update event photos" 
ON event_photos
FOR UPDATE 
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can delete event photos" 
ON event_photos
FOR DELETE 
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Past Events Policies
CREATE POLICY "Anyone can read past events" 
ON past_events
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert past events" 
ON past_events
FOR INSERT 
WITH CHECK (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can update past events" 
ON past_events
FOR UPDATE 
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can delete past events" 
ON past_events
FOR DELETE 
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- ============================================================================
-- Verification Queries (Run these to verify setup)
-- ============================================================================

-- Check if admin user exists and has correct role
-- SELECT id, email, raw_user_meta_data FROM auth.users WHERE email = 'admin@tsd.in';

-- Check if event_photos table exists
-- SELECT * FROM information_schema.tables WHERE table_name = 'event_photos';

-- Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('past_events', 'event_photos');

-- ============================================================================
-- Optional: Sample Data (for testing)
-- ============================================================================
-- First create a past event:
-- INSERT INTO past_events (title, description, category, event_date, location)
-- VALUES ('Wedding Celebration', 'Beautiful wedding event', 'Wedding', '2024-03-15', 'Mumbai');

-- Then add photos to that event (max 5):
-- INSERT INTO event_photos (event_id, url, alt_text) 
-- VALUES (1, 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/...jpg', 'Wedding photo 1');

-- ============================================================================
-- Notes & Workflow
-- ============================================================================
-- WORKFLOW:
-- 1. Admin creates a "Past Event" in admin panel
-- 2. Admin uploads UP TO 5 PHOTOS to that event
-- 3. Gallery Page shows RANDOM photos from all past events
-- 4. When user clicks a Past Event, they see ALL photos from that event
--
-- TABLE STRUCTURE:
-- past_events → id, title, description, category, event_date, location
-- event_photos → id, event_id (FK), url, alt_text, uploaded_by
--
-- CONSTRAINTS:
-- - Max 5 photos per event (enforced by frontend UI)
-- - Photos deleted when event is deleted (ON DELETE CASCADE)
-- - Anyone can view photos (public read)
-- - Only admins can upload/delete
-- ============================================================================

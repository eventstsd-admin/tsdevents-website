-- ============================================================================
-- Recreate past_events table with correct schema
-- ============================================================================
-- This fixes the existing past_events table which had wrong columns

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

-- ============================================================================
-- Add indexes
-- ============================================================================
CREATE INDEX idx_past_events_category ON past_events(category);
CREATE INDEX idx_past_events_date ON past_events(event_date);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================
ALTER TABLE past_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================
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
-- Verification
-- ============================================================================
-- SELECT * FROM information_schema.columns 
-- WHERE table_name = 'past_events'
-- ORDER BY ordinal_position;

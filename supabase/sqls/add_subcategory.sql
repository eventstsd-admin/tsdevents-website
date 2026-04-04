-- ============================================================================
-- Add subcategory column to past_events table
-- ============================================================================
-- Run this migration to add subcategory support for events

-- Add subcategory column (nullable for backward compatibility with existing events)
ALTER TABLE past_events 
ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- Add index for subcategory queries
CREATE INDEX IF NOT EXISTS idx_past_events_subcategory ON past_events(subcategory);

-- ============================================================================
-- Verification
-- ============================================================================
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'past_events'
-- ORDER BY ordinal_position;


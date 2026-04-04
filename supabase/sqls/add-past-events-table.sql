-- Add past_events table to Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.past_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS past_events_category_idx ON public.past_events(category);
CREATE INDEX IF NOT EXISTS past_events_date_idx ON public.past_events(date);
CREATE INDEX IF NOT EXISTS past_events_created_at_idx ON public.past_events(created_at);

-- Enable Row Level Security
ALTER TABLE public.past_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on past_events" ON public.past_events
  FOR ALL USING (true) WITH CHECK (true);

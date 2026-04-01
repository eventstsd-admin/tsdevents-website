# Supabase Database Schema

This file contains the SQL schema for the TSD Events Supabase database.

## How to Use

1. Go to your Supabase project: https://supabase.com
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the SQL below and paste it into the editor
5. Click "Run"

---

## SQL Schema

```sql
-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress')),
  amount INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price_range TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create inquiries table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS bookings_status_idx ON public.bookings(status);
CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON public.bookings(created_at);
CREATE INDEX IF NOT EXISTS events_active_idx ON public.events(active);
CREATE INDEX IF NOT EXISTS inquiries_email_idx ON public.inquiries(email);
CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON public.inquiries(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations
CREATE POLICY "Allow all operations on bookings" ON public.bookings
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on events" ON public.events
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on inquiries" ON public.inquiries
  FOR ALL USING (true) WITH CHECK (true);
```

---

## Table Descriptions

### bookings
Stores event booking information with booking status and amount.

### events
Manages event packages/offerings that customers can book.

### inquiries
Stores customer inquiries and messages.

All tables include timestamps for auditing purposes and proper indexing for performance.

-- Create inquiries table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS inquiries_email_idx ON public.inquiries(email);
CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON public.inquiries(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations on inquiries (for admin access)
CREATE POLICY "Allow all operations on inquiries" ON public.inquiries
USING (true)
WITH CHECK (true);
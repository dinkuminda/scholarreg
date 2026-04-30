-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  course TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy for development
DROP POLICY IF EXISTS "Allow public access" ON students;
CREATE POLICY "Allow public access" ON students
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

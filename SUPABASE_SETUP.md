# Supabase Database Setup

To make ScholarReg function correctly, you need to create a `students` table in your Supabase project.

### 1. Run SQL in Supabase Dashboard
Go to your Supabase project's **SQL Editor** and run the following command:

```sql
create table students (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  course text not null,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) if needed
alter table students enable row level security;

-- Create policy to allow all actions for service role (used by server)
-- Or allow public access if you are using the anon key directly for demo
create policy "Enable all access for everyone" on "public"."students"
as permissive for all
to public
using (true)
with check (true);
```

### 2. Configure Environment Variables
In the **Secrets** panel (or `.env`), set the following:

- `SUPABASE_URL`: Your Project URL from Settings > API.
- `SUPABASE_ANON_KEY`: Your Anon Key from Settings > API.

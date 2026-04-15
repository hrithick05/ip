import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kjbpwxubekbqiqqjnowh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYnB3eHViZWticWlxcWpub3doIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjIzMjA0NCwiZXhwIjoyMDkxODA4MDQ0fQ.zVd-nIYeT0H0o2k5ewA-KOcTEzeWCe6VeHKsDGKs1JQ"
);

const { error } = await supabase.from("users").select("id").limit(1);
if (error?.code === "42P01") {
  console.log("users table missing — please run this SQL in Supabase dashboard:");
  console.log(`
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password text not null,
  name text,
  created_at timestamptz default now()
);
  `);
} else {
  console.log("✓ users table exists");
}

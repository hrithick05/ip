import { createClient } from "@supabase/supabase-js";

const s = createClient(
  "https://kjbpwxubekbqiqqjnowh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYnB3eHViZWticWlxcWpub3doIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjIzMjA0NCwiZXhwIjoyMDkxODA4MDQ0fQ.zVd-nIYeT0H0o2k5ewA-KOcTEzeWCe6VeHKsDGKs1JQ"
);

const insert = await s.from("users").insert({ email: "test3@test.com", password: "test123", name: "Test" }).select().single();
console.log("insert:", JSON.stringify(insert));

const select = await s.from("users").select("*").limit(3);
console.log("select:", JSON.stringify(select));

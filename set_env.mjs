import { execSync } from "child_process";

const vars = {
  NEXT_PUBLIC_SUPABASE_URL: "https://kjbpwxubekbqiqqjnowh.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYnB3eHViZWticWlxcWpub3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMzIwNDQsImV4cCI6MjA5MTgwODA0NH0.TaEwaoOHE1WRVJk_bshWjHrbXl1cRi7tzNvHxdqu6aQ",
  NEXT_PUBLIC_API_URL: "https://ip-1-0o5h.onrender.com"
};

for (const [key, value] of Object.entries(vars)) {
  try {
    execSync(
      `vercel env add ${key} production --cwd interview-prep/frontend --yes`,
      { input: value, stdio: ["pipe", "inherit", "inherit"] }
    );
    console.log(`✓ Added ${key}`);
  } catch (e) {
    console.error(`✗ Failed ${key}:`, e.message);
  }
}

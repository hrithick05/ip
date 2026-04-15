import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "./lib/supabaseAdmin.js";
import codeRoutes from "./routes/code.js";
import interviewRoutes from "./routes/interview.js";
import hrRoutes from "./routes/hr.js";
import resumeRoutes from "./routes/resume.js";
import adminRoutes from "./routes/admin.js";

const app = express();
const SECRET = process.env.JWT_SECRET || "interviewprep_secret_2025";

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

// Register
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) return res.status(400).json({ error: "Email already registered" });

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .insert({ email, password, name: name || email.split("@")[0] })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  const token = jwt.sign({ userId: user.id, email: user.email }, SECRET, { expiresIn: "7d" });
  return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, email, name, password")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (!user) return res.status(401).json({ error: "Invalid email or password" });

  const token = jwt.sign({ userId: user.id, email: user.email }, SECRET, { expiresIn: "7d" });
  return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// Me
app.get("/api/auth/me", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(auth.slice(7), SECRET);
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id, email, name")
      .eq("id", payload.userId)
      .single();
    return res.json(user);
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
});

app.use("/api/code", codeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/admin", adminRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));

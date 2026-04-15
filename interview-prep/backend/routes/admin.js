import express from "express";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

const router = express.Router();

const SECRET = process.env.ADMIN_JWT_SECRET;

export function requireAdminJwt(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(auth.slice(7), SECRET);
    if (payload.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ role: "admin", username }, SECRET, { expiresIn: "8h" });
  return res.json({ token });
});

// GET all questions
router.get("/questions", requireAdminJwt, async (_req, res) => {
  const { data, error } = await supabaseAdmin.from("questions").select("*").order("field").order("category");
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// POST add a question
router.post("/questions", requireAdminJwt, async (req, res) => {
  const { question_text, option1, option2, option3, option4, correct_answer, field, category } = req.body;
  if (!question_text || !field || !category) {
    return res.status(400).json({ error: "question_text, field, and category are required" });
  }
  const { data, error } = await supabaseAdmin
    .from("questions")
    .insert({ question_text, option1, option2, option3, option4, correct_answer, field, category })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// DELETE a question
router.delete("/questions/:id", requireAdminJwt, async (req, res) => {
  const { error } = await supabaseAdmin.from("questions").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ deleted: true });
});

// GET all coding questions
router.get("/coding-questions", requireAdminJwt, async (_req, res) => {
  const { data, error } = await supabaseAdmin.from("coding_questions").select("*").order("difficulty").order("title");
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// POST add a coding question
router.post("/coding-questions", requireAdminJwt, async (req, res) => {
  const { title, difficulty, description, input_data, expected_output } = req.body;
  if (!title || !description || !expected_output) {
    return res.status(400).json({ error: "title, description, and expected_output are required" });
  }
  const { data, error } = await supabaseAdmin
    .from("coding_questions")
    .insert({ title, difficulty: difficulty || "Easy", description, input_data: input_data || "", expected_output })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// DELETE a coding question
router.delete("/coding-questions/:id", requireAdminJwt, async (req, res) => {
  const { error } = await supabaseAdmin.from("coding_questions").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ deleted: true });
});

export default router;

import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ message: "HR route is active" });
});

router.post("/answer", requireAuth, async (req, res) => {
  try {
    const { question_id, answer_text } = req.body;

    if (!question_id || !answer_text) {
      return res.status(400).json({ error: "question_id and answer_text are required" });
    }

    const { error } = await supabaseAdmin.from("hr_answers").insert({
      clerk_user_id: req.userId,
      question_id,
      answer_text
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ saved: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;

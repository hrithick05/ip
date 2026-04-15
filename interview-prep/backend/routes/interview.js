import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ message: "Interview route is active" });
});

router.post("/submit", requireAuth, async (req, res) => {
  try {
    const { field, category, score } = req.body;

    if (!field || !category || typeof score !== "number") {
      return res.status(400).json({ error: "field, category, and score are required" });
    }

    const { error } = await supabaseAdmin.from("interview_submissions").insert({
      clerk_user_id: req.userId,
      field,
      category,
      score
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

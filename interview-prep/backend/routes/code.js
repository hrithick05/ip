import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

const router = express.Router();

async function runWithJudge0(code, stdin) {
  const submitResponse = await fetch(
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
      },
      body: JSON.stringify({
        source_code: code,
        language_id: 71,
        stdin: stdin || ""
      })
    }
  );

  if (!submitResponse.ok) {
    throw new Error("Judge0 request failed");
  }

  const result = await submitResponse.json();
  return result.stdout ?? result.stderr ?? result.compile_output ?? "";
}

async function runWithPiston(code, stdin) {
  const pistonResponse = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: "python",
      version: "3.10.0",
      files: [{ content: code }],
      stdin: stdin || ""
    })
  });

  if (!pistonResponse.ok) {
    throw new Error("Piston request failed");
  }

  const result = await pistonResponse.json();
  return result.run?.output ?? "";
}

router.post("/run", requireAuth, async (req, res) => {
  try {
    const { code, questionId } = req.body;
    if (!code || !questionId) {
      return res.status(400).json({ error: "code and questionId are required" });
    }

    const { data: question, error: questionError } = await supabaseAdmin
      .from("coding_questions")
      .select("id, expected_output, input_data")
      .eq("id", questionId)
      .single();

    if (questionError || !question) {
      return res.status(404).json({ error: "Question not found" });
    }

    let output = "";
    try {
      output = await runWithJudge0(code, question.input_data);
    } catch (_error) {
      output = await runWithPiston(code, question.input_data);
    }

    const normalizedActual = output.trim();
    const normalizedExpected = (question.expected_output ?? "").trim();
    const status = normalizedActual === normalizedExpected ? "Correct" : "Wrong";

    const { error: submissionError } = await supabaseAdmin.from("submissions").insert({
      clerk_user_id: req.userId,
      question_id: questionId,
      code,
      status
    });

    if (submissionError) {
      return res.status(500).json({ error: submissionError.message });
    }

    return res.json({
      status,
      output: normalizedActual,
      expected: normalizedExpected
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { CodeEditor } from "@/components/CodeEditor";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MotionPage } from "@/components/MotionPage";
import { supabase } from "@/lib/supabase";
import { useApi } from "@/lib/api";

type Question = {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  input_data: string;
  expected_output: string;
};

export default function CodingQuestionPage() {
  const params = useParams<{ id: string }>();
  const { apiFetch } = useApi();
  const [question, setQuestion] = useState<Question | null>(null);
  const [code, setCode] = useState("print('Hello World')");
  const [language, setLanguage] = useState("Python");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: string; output: string; expected: string } | null>(null);

  useEffect(() => {
    async function loadQuestion() {
      const { data } = await supabase
        .from("coding_questions")
        .select("id, title, difficulty, description, input_data, expected_output")
        .eq("id", params.id)
        .single();

      setQuestion(data ?? null);
    }

    loadQuestion();
  }, [params.id]);

  async function runCode() {
    setLoading(true);
    try {
      const data = await apiFetch("/api/code/run", {
        method: "POST",
        body: JSON.stringify({ code, questionId: params.id })
      });
      setResult(data);
      toast.success(data.status === "Correct" ? "All test cases passed" : "Execution completed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Execution failed");
    } finally {
      setLoading(false);
    }
  }

  if (!question) return <p>Loading question...</p>;

  return (
    <MotionPage>
      <section className="grid gap-4 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-3">
        <div className="text-sm text-[#9B99B8]">
          Coding <ChevronRight className="mx-1 inline h-4 w-4" /> Problem
        </div>
        <div className="card">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h1 className="text-2xl font-bold">{question.title}</h1>
            <span
              className={`pill ${
                question.difficulty === "Easy"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : question.difficulty === "Medium"
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-rose-500/20 text-rose-300"
              }`}
            >
              {question.difficulty}
            </span>
          </div>
          <p className="mb-3 text-[#9B99B8]">{question.description}</p>
          <div className="space-y-2 font-[var(--font-jetbrains)] text-sm">
            <div className="rounded-xl border border-white/10 bg-[#0F0F13] p-3">
              <p className="mb-1 text-xs uppercase tracking-[0.08em] text-[#9B99B8]">Input</p>
              <p>{question.input_data || "None"}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0F0F13] p-3">
              <p className="mb-1 text-xs uppercase tracking-[0.08em] text-[#9B99B8]">Expected Output</p>
              <p>{question.expected_output || "None"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 lg:col-span-2">
        <div className="flex justify-end">
          <select className="input-base w-40" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option>Python</option>
            <option>JavaScript</option>
            <option>Java</option>
          </select>
        </div>
        <CodeEditor value={code} onChange={setCode} />
        <div className="flex gap-2">
          <button type="button" onClick={runCode} disabled={loading} className="button-primary flex items-center gap-2 px-4 py-2">
            {loading ? <LoadingSpinner size={16} /> : null}
            {loading ? "Running..." : "Run Code"}
          </button>
          <button type="button" onClick={() => setCode("print('Hello World')")} className="button-secondary px-4 py-2">
            Reset
          </button>
        </div>
      </div>

      {result ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`card mt-2 lg:col-span-5 ${result.status === "Correct" ? "border-emerald-400/30 bg-emerald-500/10" : "border-rose-400/30 bg-rose-500/10"}`}
        >
          <p className={`mb-2 flex items-center gap-2 font-semibold ${result.status === "Correct" ? "text-emerald-300" : "text-rose-300"}`}>
            {result.status === "Correct" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            {result.status === "Correct" ? "All test cases passed" : "Wrong output"}
          </p>
          <p className="text-sm">Actual: {result.output}</p>
          <p className="text-sm">Expected: {result.expected}</p>
        </motion.div>
      ) : null}
    </section>
    </MotionPage>
  );
}

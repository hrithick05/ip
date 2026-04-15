"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useApi } from "@/lib/api";
import { MotionPage } from "@/components/MotionPage";

type Question = {
  id: string;
  question_text: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_answer: string;
};

export default function InterviewFlowPage() {
  const params = useParams<{ field: string; category: string }>();
  const field = decodeURIComponent(params.field);
  const category = decodeURIComponent(params.category);
  const { apiFetch } = useApi();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const [seconds, setSeconds] = useState(75);

  useEffect(() => {
    async function loadQuestions() {
      const key = `interview_${field}_${category}`;
      const cached = sessionStorage.getItem(key);
      if (cached) { setQuestions(JSON.parse(cached)); return; }
      const { data } = await supabase
        .from("questions")
        .select("id, question_text, option1, option2, option3, option4, correct_answer")
        .eq("field", field)
        .eq("category", category);
      const result = data ?? [];
      sessionStorage.setItem(key, JSON.stringify(result));
      setQuestions(result);
    }
    loadQuestions();
  }, [field, category]);

  const current = questions[index];
  const options = useMemo(() => {
    if (!current) return [];
    return [current.option1, current.option2, current.option3, current.option4].filter(Boolean);
  }, [current]);

  useEffect(() => {
    if (complete) return;
    const timer = setInterval(() => setSeconds((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [complete, index]);

  function goNext() {
    setSelected(null);
    setSeconds(75);
    if (index + 1 >= questions.length) {
      setComplete(true);
    } else {
      setIndex((prev) => prev + 1);
    }
  }

  async function submitAnswer() {
    if (!current) return;
    const isCorrect = selected === current.correct_answer;
    const nextScore = isCorrect ? score + 1 : score;
    setScore(nextScore);
    await apiFetch("/api/interview/submit", {
      method: "POST",
      body: JSON.stringify({ field, category, score: nextScore, total: questions.length })
    });
    goNext();
  }

  if (!questions.length) return <p>Loading interview questions...</p>;
  if (complete) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <MotionPage>
      <section className="card space-y-4 text-center">
        <h1 className="text-2xl font-bold">Interview Complete</h1>
        <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-8 border-indigo-500/30">
          <div>
            <p className="text-2xl font-bold text-indigo-300">{percent}%</p>
            <p className="text-xs text-[#9B99B8]">
              {score}/{questions.length}
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <button type="button" className="button-primary px-4 py-2" onClick={() => window.location.reload()}>
            Try Again
          </button>
          <button type="button" className="button-secondary px-4 py-2" onClick={() => (window.location.href = "/mock-interview")}>
            New Topic
          </button>
        </div>
      </section>
      </MotionPage>
    );
  }

  const progress = ((index + 1) / questions.length) * 100;

  return (
    <MotionPage>
      <section className="space-y-4">
      <div className="card space-y-2">
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-[#9B99B8]">
        {field} / {category} - Question {index + 1} of {questions.length}
          <span className={`ml-2 ${seconds < 30 ? "text-rose-300" : "text-indigo-300"}`}>• {seconds}s</span>
      </p>
      </div>
      <motion.div key={current.id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="card">
        <p className="mb-3 text-sm text-[#9B99B8]">Q{index + 1}</p>
        <p className="mb-4 text-lg font-semibold">{current.question_text}</p>
        <div className="grid gap-2">
          {options.map((option, optionIndex) => (
            <button
              key={option}
              type="button"
              className={`focus-ring rounded-xl border px-4 py-3 text-left transition ${
                selected === option ? "border-indigo-400 bg-indigo-500/20 text-white" : "border-white/15 bg-[#0F0F13] text-[#D8D6F1] hover:bg-indigo-500/10"
              }`}
              onClick={() => setSelected(option)}
            >
              <span className="mr-2 font-semibold text-indigo-300">{String.fromCharCode(65 + optionIndex)}.</span>
              {option}
            </button>
          ))}
        </div>
      </motion.div>
      <div className="flex gap-2">
        <button type="button" className="button-primary px-4 py-2 disabled:opacity-50" disabled={!selected} onClick={submitAnswer}>
          Submit Answer
        </button>
        <button type="button" className="button-secondary px-4 py-2" onClick={goNext}>
          Skip
        </button>
      </div>
    </section>
    </MotionPage>
  );
}

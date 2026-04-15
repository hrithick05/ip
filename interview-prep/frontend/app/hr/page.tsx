"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { MotionPage } from "@/components/MotionPage";
import { useApi } from "@/lib/api";

type HrQuestion = { id: string; question_text: string };
type AnswerRecord = { questionId: string; answer: string };

function feedbackFor(answer: string) {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  if (words < 30) return "Too brief — add more detail";
  if (words <= 100) return "Good answer";
  return "Detailed response";
}

export default function HrPage() {
  const { apiFetch } = useApi();
  const [questions, setQuestions] = useState<HrQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [done, setDone] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      const cached = sessionStorage.getItem("hr_questions");
      if (cached) { setQuestions(JSON.parse(cached)); return; }
      const { data } = await supabase.from("questions").select("id, question_text").eq("field", "HR");
      const result = data ?? [];
      sessionStorage.setItem("hr_questions", JSON.stringify(result));
      setQuestions(result);
    }
    loadQuestions();
  }, []);

  const current = questions[index];
  const summary = useMemo(
    () =>
      answers.map((item) => ({
        ...item,
        question: questions.find((q) => q.id === item.questionId)?.question_text ?? "Unknown question",
        feedback: feedbackFor(item.answer)
      })),
    [answers, questions]
  );

  async function submitAnswer() {
    if (!current || !answer.trim()) return;

    await apiFetch("/api/hr/answer", {
      method: "POST",
      body: JSON.stringify({ question_id: current.id, answer_text: answer })
    });

    const nextAnswers = [...answers, { questionId: current.id, answer }];
    setAnswers(nextAnswers);
    toast.success(feedbackFor(answer));
    setAnswer("");

    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex((prev) => prev + 1);
    }
  }

  if (!questions.length) return <p>Loading HR questions...</p>;
  if (done) {
    return (
      <MotionPage>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">HR Summary</h1>
        {summary.map((item, idx) => (
          <div key={item.questionId} className="card">
            <button className="flex w-full items-center justify-between text-left" onClick={() => setOpenItem((prev) => (prev === item.questionId ? null : item.questionId))}>
              <p className="font-medium">Q{idx + 1}: {item.question}</p>
              <ChevronDown className={`h-4 w-4 transition ${openItem === item.questionId ? "rotate-180" : ""}`} />
            </button>
            {openItem === item.questionId ? (
              <div className="mt-3 space-y-2">
                <p className="text-[#D7D5EF]">{item.answer}</p>
                <p className={`pill inline-flex ${item.feedback.includes("Too brief") ? "bg-amber-500/20 text-amber-300" : item.feedback.includes("Detailed") ? "bg-emerald-500/20 text-emerald-300" : "bg-indigo-500/20 text-indigo-300"}`}>{item.feedback}</p>
              </div>
            ) : null}
          </div>
        ))}
      </section>
      </MotionPage>
    );
  }

  const progress = ((index + 1) / questions.length) * 100;
  const words = answer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <MotionPage>
      <section className="space-y-4">
      <h1 className="text-2xl font-bold">HR Questions</h1>
      <div className="card space-y-2">
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-[#9B99B8]">
          Question {index + 1} of {questions.length}
        </p>
      </div>
      <div className="card space-y-3">
        <p className="font-medium">{current.question_text}</p>
        <textarea className="input-base min-h-[120px] w-full resize-none" placeholder="Type your answer here..." value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <div className="flex justify-between text-sm text-[#9B99B8]">
          <span>Words: {words}</span>
          <span>Chars: {answer.length}</span>
        </div>
        {answer.length > 0 ? (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`pill inline-flex ${feedbackFor(answer).includes("Too brief") ? "bg-amber-500/20 text-amber-300" : feedbackFor(answer).includes("Detailed") ? "bg-emerald-500/20 text-emerald-300" : "bg-indigo-500/20 text-indigo-300"}`}>
            {feedbackFor(answer)}
          </motion.span>
        ) : null}
        <button type="button" className="button-primary w-fit px-4 py-2" onClick={submitAnswer}>
          Submit
        </button>
      </div>
    </section>
    </MotionPage>
  );
}

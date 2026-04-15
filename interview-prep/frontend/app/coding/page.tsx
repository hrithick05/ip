"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { QuestionCard } from "@/components/QuestionCard";
import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";
import { SkeletonCard } from "@/components/SkeletonCard";
import { motion } from "framer-motion";
import { MotionPage } from "@/components/MotionPage";

type CodingQuestion = {
  id: string;
  title: string;
  difficulty: string;
};

export default function CodingPage() {
  const { userId } = useAuth();
  const [questions, setQuestions] = useState<CodingQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [difficulty, setDifficulty] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    async function loadQuestions() {
      setLoading(true);
      const cached = sessionStorage.getItem("coding_questions");
      if (cached) {
        setQuestions(JSON.parse(cached));
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("coding_questions")
        .select("id, title, difficulty")
        .order("title", { ascending: true });
      const result = data ?? [];
      sessionStorage.setItem("coding_questions", JSON.stringify(result));
      setQuestions(result);
      setLoading(false);
    }
    loadQuestions();
  }, []);

  useEffect(() => {
    async function loadSubmissions() {
      if (!userId) return;
      const { data } = await supabase
        .from("submissions")
        .select("question_id, status")
        .eq("clerk_user_id", userId)
        .eq("status", "Correct");

      const ids = new Set((data ?? []).map((item) => item.question_id as string));
      setCompletedIds(ids);
    }

    loadSubmissions();
  }, [userId]);

  const filtered = useMemo(() => {
    const normalizedSearch = search.toLowerCase();
    return questions.filter((question) => {
      const matchesDifficulty = difficulty === "All" || question.difficulty === difficulty;
      const matchesSearch = question.title.toLowerCase().includes(normalizedSearch);
      return matchesDifficulty && matchesSearch;
    });
  }, [questions, difficulty, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <MotionPage>
      <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">Coding Questions</h1>
        <span className="pill bg-indigo-500/20 text-indigo-300">{filtered.length} Problems</span>
      </div>
      <div className="card grid gap-3 md:grid-cols-3">
        <select className="input-base" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <label className="relative md:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B99B8]" />
          <input className="input-base w-full pl-10" placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
      </div>

      <div className="grid gap-3">
        {loading
          ? Array.from({ length: 5 }, (_, index) => <SkeletonCard key={index} />)
          : paginated.map((question, index) => (
              <motion.div key={question.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                <QuestionCard id={question.id} title={question.title} difficulty={question.difficulty} completed={completedIds.has(question.id)} />
              </motion.div>
            ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="button-secondary px-3 py-1 disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className="button-secondary px-3 py-1 disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </section>
    </MotionPage>
  );
}

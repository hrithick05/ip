"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";


type Question = {
  id: string;
  field: string;
  category: string;
  question_text: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  option4: string | null;
  correct_answer: string | null;
};

type CodingQuestion = {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  input_data: string;
  expected_output: string;
};

const emptyQ = { question_text: "", field: "", category: "", option1: "", option2: "", option3: "", option4: "", correct_answer: "" };
const emptyC = { title: "", difficulty: "Easy", description: "", input_data: "", expected_output: "" };

export default function AdminQuestions() {
  const [tab, setTab] = useState<"interview" | "coding">("interview");

  function adminFetch(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem("admin_token") ?? "";
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...options.headers },
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    });
  }

  const [questions, setQuestions] = useState<Question[]>([]);
  const [codingQuestions, setCodingQuestions] = useState<CodingQuestion[]>([]);

  const [qForm, setQForm] = useState(emptyQ);
  const [cForm, setCForm] = useState(emptyC);
  const [showQForm, setShowQForm] = useState(false);
  const [showCForm, setShowCForm] = useState(false);
  const [filterField, setFilterField] = useState("All");

  useEffect(() => {
    adminFetch("/api/admin/questions").then(setQuestions).catch(() => toast.error("Failed to load questions"));
    adminFetch("/api/admin/coding-questions").then(setCodingQuestions).catch(() => toast.error("Failed to load coding questions"));
  }, []);

  async function addQuestion() {
    if (!qForm.question_text || !qForm.field || !qForm.category) return toast.error("question, field and category are required");
    try {
      const created = await adminFetch("/api/admin/questions", { method: "POST", body: JSON.stringify(qForm) });
      setQuestions((prev) => [...prev, created]);
      setQForm(emptyQ);
      setShowQForm(false);
      toast.success("Question added");
    } catch { toast.error("Failed to add question"); }
  }

  async function deleteQuestion(id: string) {
    try {
      await adminFetch(`/api/admin/questions/${id}`, { method: "DELETE" });
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed to delete"); }
  }

  async function addCodingQuestion() {
    if (!cForm.title || !cForm.description || !cForm.expected_output) return toast.error("title, description and expected output are required");
    try {
      const created = await adminFetch("/api/admin/coding-questions", { method: "POST", body: JSON.stringify(cForm) });
      setCodingQuestions((prev) => [...prev, created]);
      setCForm(emptyC);
      setShowCForm(false);
      toast.success("Coding question added");
    } catch { toast.error("Failed to add coding question"); }
  }

  async function deleteCodingQuestion(id: string) {
    try {
      await adminFetch(`/api/admin/coding-questions/${id}`, { method: "DELETE" });
      setCodingQuestions((prev) => prev.filter((q) => q.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed to delete"); }
  }

  const fields = ["All", ...Array.from(new Set(questions.map((q) => q.field)))];
  const filteredQ = filterField === "All" ? questions : questions.filter((q) => q.field === filterField);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        <button type="button" className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === "interview" ? "bg-indigo-500 text-white" : "button-secondary"}`} onClick={() => setTab("interview")}>
          Interview / HR ({questions.length})
        </button>
        <button type="button" className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === "coding" ? "bg-indigo-500 text-white" : "button-secondary"}`} onClick={() => setTab("coding")}>
          Coding ({codingQuestions.length})
        </button>
      </div>

      {tab === "interview" && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <select className="input-base w-44" value={filterField} onChange={(e) => setFilterField(e.target.value)}>
              {fields.map((f) => <option key={f}>{f}</option>)}
            </select>
            <button type="button" className="button-primary flex items-center gap-1 px-3 py-2 text-sm ml-auto" onClick={() => setShowQForm((v) => !v)}>
              <Plus className="h-4 w-4" /> Add Question
            </button>
          </div>

          {showQForm && (
            <div className="card space-y-3">
              <p className="font-semibold">New Interview / HR Question</p>
              <div className="grid gap-2 md:grid-cols-2">
                <input className="input-base" placeholder="Field (e.g. Software Engineering)" value={qForm.field} onChange={(e) => setQForm({ ...qForm, field: e.target.value })} />
                <input className="input-base" placeholder="Category (e.g. DSA) — use HR for HR questions" value={qForm.category} onChange={(e) => setQForm({ ...qForm, category: e.target.value })} />
              </div>
              <textarea className="input-base w-full resize-none" rows={2} placeholder="Question text" value={qForm.question_text} onChange={(e) => setQForm({ ...qForm, question_text: e.target.value })} />
              <div className="grid gap-2 md:grid-cols-2">
                <input className="input-base" placeholder="Option A (leave blank for HR)" value={qForm.option1} onChange={(e) => setQForm({ ...qForm, option1: e.target.value })} />
                <input className="input-base" placeholder="Option B" value={qForm.option2} onChange={(e) => setQForm({ ...qForm, option2: e.target.value })} />
                <input className="input-base" placeholder="Option C" value={qForm.option3} onChange={(e) => setQForm({ ...qForm, option3: e.target.value })} />
                <input className="input-base" placeholder="Option D" value={qForm.option4} onChange={(e) => setQForm({ ...qForm, option4: e.target.value })} />
              </div>
              <input className="input-base w-full" placeholder="Correct answer (must match one option exactly)" value={qForm.correct_answer} onChange={(e) => setQForm({ ...qForm, correct_answer: e.target.value })} />
              <div className="flex gap-2">
                <button type="button" className="button-primary px-4 py-2 text-sm" onClick={addQuestion}>Save</button>
                <button type="button" className="button-secondary px-4 py-2 text-sm" onClick={() => setShowQForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="card overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1C1C24]">
                <tr>
                  <th className="p-3">Field / Category</th>
                  <th className="p-3">Question</th>
                  <th className="p-3 w-10" />
                </tr>
              </thead>
              <tbody>
                {filteredQ.map((q) => (
                  <tr key={q.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                    <td className="p-3 whitespace-nowrap">
                      <span className="pill bg-indigo-500/20 text-indigo-300">{q.field}</span>
                      <span className="ml-1 pill bg-white/10 text-[#9B99B8]">{q.category}</span>
                    </td>
                    <td className="p-3 max-w-xs truncate">{q.question_text}</td>
                    <td className="p-3">
                      <button type="button" onClick={() => deleteQuestion(q.id)} className="text-rose-400 hover:text-rose-300 transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "coding" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button type="button" className="button-primary flex items-center gap-1 px-3 py-2 text-sm" onClick={() => setShowCForm((v) => !v)}>
              <Plus className="h-4 w-4" /> Add Coding Question
            </button>
          </div>

          {showCForm && (
            <div className="card space-y-3">
              <p className="font-semibold">New Coding Question</p>
              <div className="grid gap-2 md:grid-cols-2">
                <input className="input-base" placeholder="Title" value={cForm.title} onChange={(e) => setCForm({ ...cForm, title: e.target.value })} />
                <select className="input-base" value={cForm.difficulty} onChange={(e) => setCForm({ ...cForm, difficulty: e.target.value })}>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <textarea className="input-base w-full resize-none" rows={3} placeholder="Problem description" value={cForm.description} onChange={(e) => setCForm({ ...cForm, description: e.target.value })} />
              <textarea className="input-base w-full resize-none font-mono text-xs" rows={2} placeholder="Input data (stdin)" value={cForm.input_data} onChange={(e) => setCForm({ ...cForm, input_data: e.target.value })} />
              <textarea className="input-base w-full resize-none font-mono text-xs" rows={2} placeholder="Expected output (must match exactly)" value={cForm.expected_output} onChange={(e) => setCForm({ ...cForm, expected_output: e.target.value })} />
              <div className="flex gap-2">
                <button type="button" className="button-primary px-4 py-2 text-sm" onClick={addCodingQuestion}>Save</button>
                <button type="button" className="button-secondary px-4 py-2 text-sm" onClick={() => setShowCForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="card overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1C1C24]">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Difficulty</th>
                  <th className="p-3 w-10" />
                </tr>
              </thead>
              <tbody>
                {codingQuestions.map((q) => (
                  <tr key={q.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                    <td className="p-3">{q.title}</td>
                    <td className="p-3">
                      <span className={`pill ${q.difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-300" : q.difficulty === "Medium" ? "bg-amber-500/20 text-amber-300" : "bg-rose-500/20 text-rose-300"}`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="p-3">
                      <button type="button" onClick={() => deleteCodingQuestion(q.id)} className="text-rose-400 hover:text-rose-300 transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

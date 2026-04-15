"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Braces, Cpu, LayoutTemplate, MonitorCog, Sparkles } from "lucide-react";
import { MotionPage } from "@/components/MotionPage";

const fields = [
  { name: "Frontend", icon: LayoutTemplate },
  { name: "Backend", icon: MonitorCog },
  { name: "DSA", icon: Braces },
  { name: "System Design", icon: Cpu },
  { name: "ML", icon: Sparkles }
];
const categories = ["Beginner", "Intermediate", "Advanced", "Company Focus"];

export default function MockInterviewPickerPage() {
  const router = useRouter();
  const [field, setField] = useState("");
  const [category, setCategory] = useState("");

  return (
    <MotionPage>
      <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.02em]">Mock Interview</h1>
        <p className="text-[#9B99B8]">Choose your path and launch a timed interview drill.</p>
      </div>
      <div className="space-y-4">
        <h2 className="text-sm uppercase tracking-[0.1em] text-[#9B99B8]">Step 1: Choose Field</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {fields.map((item) => (
            <button
              key={item.name}
              className={`card text-left transition hover:-translate-y-[3px] ${field === item.name ? "border-indigo-400 bg-indigo-500/10" : ""}`}
              onClick={() => setField(item.name)}
            >
              <item.icon className="mb-2 h-5 w-5 text-indigo-300" />
              <p className="font-semibold">{item.name}</p>
            </button>
          ))}
        </div>
      </div>

      {field ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <h2 className="text-sm uppercase tracking-[0.1em] text-[#9B99B8]">Step 2: Choose Category</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((value) => (
              <button
                key={value}
                className={`card text-left transition hover:-translate-y-[3px] ${category === value ? "border-indigo-400 bg-indigo-500/10" : ""}`}
                onClick={() => setCategory(value)}
              >
                <p className="font-semibold">{value}</p>
              </button>
            ))}
          </div>
        </motion.div>
      ) : null}

      {field && category ? (
        <div className="card flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#9B99B8]">Estimated: 12 min • 10 questions</p>
          <button type="button" className="button-primary px-5 py-2.5 shadow-[0_0_25px_rgba(99,102,241,0.35)]" onClick={() => router.push(`/mock-interview/${encodeURIComponent(field)}/${encodeURIComponent(category)}`)}>
            Start Interview
          </button>
        </div>
      ) : null}
    </section>
    </MotionPage>
  );
}

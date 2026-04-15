"use client";

import Link from "next/link";
import { CalendarDays, CheckCircle2, Flame, Mic2, Target, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { MotionPage } from "@/components/MotionPage";
import { useAppStore } from "@/lib/store";

const metricCards = [
  { title: "Problems Solved", value: 128, icon: CheckCircle2, suffix: "" },
  { title: "Streak", value: 19, icon: Flame, suffix: "d" },
  { title: "Accuracy", value: 86, icon: Target, suffix: "%" },
  { title: "Interviews Done", value: 14, icon: Mic2, suffix: "" }
];

export default function DashboardPage() {
  const activities = useAppStore((s) => s.activities);
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <MotionPage>
      <section className="space-y-6">
        <div className="card">
          <h1 className="text-3xl font-bold tracking-[-0.02em]">Good morning, Candidate</h1>
          <p className="mt-2 flex items-center gap-2 text-[#9B99B8]">
            <CalendarDays className="h-4 w-4" /> {today}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {metricCards.map((metric) => (
            <div key={metric.title} className="card">
              <div className="mb-2 flex items-center justify-between">
                <metric.icon className="h-4 w-4 text-indigo-300" />
                <span className="inline-flex items-center gap-1 text-xs text-emerald-300">
                  <TrendingUp className="h-3 w-3" /> +4.2%
                </span>
              </div>
              <p className="text-xl font-bold text-[#F1F0FF]">
                <AnimatedCounter to={metric.value} suffix={metric.suffix} />
              </p>
              <p className="text-sm text-[#9B99B8]">{metric.title}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="card space-y-3">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/coding" className="button-primary px-4 py-2 text-center">
                Solve Coding
              </Link>
              <Link href="/mock-interview" className="button-secondary px-4 py-2 text-center">
                Mock Round
              </Link>
              <Link href="/hr" className="button-secondary px-4 py-2 text-center">
                HR Answers
              </Link>
              <Link href="/resume" className="button-secondary px-4 py-2 text-center">
                Build Resume
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="mb-3 text-lg font-semibold">Overall Completion</h2>
            <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full border-8 border-indigo-500/30">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-300">72%</p>
                <p className="text-xs uppercase tracking-[0.08em] text-[#9B99B8]">Progress</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
          <ul className="space-y-2">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0F0F13] px-3 py-2">
                <p className="text-sm">{activity.label}</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`pill ${
                      activity.status === "success"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : activity.status === "warning"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-rose-500/20 text-rose-300"
                    }`}
                  >
                    {activity.status}
                  </span>
                  <span className="text-xs text-[#9B99B8]">{activity.timestamp}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </MotionPage>
  );
}

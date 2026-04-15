"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, FileText, Mic2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { MotionPage } from "@/components/MotionPage";

const roles = ["Software Engineer", "Data Scientist", "Product Manager"];

const items = [
  { href: "/coding", title: "Coding Practice", icon: Code2, desc: "Solve curated DSA and company-tagged coding sets." },
  { href: "/mock-interview", title: "Mock Interview", icon: Mic2, desc: "Run timed interview simulations with instant scoring." },
  { href: "/hr", title: "HR Questions", icon: Users, desc: "Practice behavioral answers with structured feedback." },
  { href: "/resume", title: "Resume Builder", icon: FileText, desc: "Craft premium resumes with live ATS-aware previews." }
];

export default function HomePage() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setRoleIndex((prev) => (prev + 1) % roles.length), 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <MotionPage>
      <section className="space-y-12">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#17171D] p-8 text-center sm:p-12">
          <div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
          <h1 className="text-4xl font-bold tracking-[-0.02em] sm:text-5xl">
            Prepare smarter and{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent">ace your next interview</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[#9B99B8]">InterviewPrep helps you practice coding, HR rounds, mock interviews, and resume building in one premium workspace.</p>
          <p className="mt-4 text-sm text-indigo-300">
            Target role: <span className="font-semibold">{roles[roleIndex]}</span>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/coding" className="button-primary px-5 py-2.5">
              Get Started
            </Link>
            <button className="button-secondary px-5 py-2.5">Watch Demo</button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, index) => (
            <motion.div key={item.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <Link href={item.href} className="card block transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                <item.icon className="mb-3 h-5 w-5 text-indigo-300" />
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-[#9B99B8]">{item.desc}</p>
                <p className="mt-4 text-sm text-indigo-300">Explore →</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="card text-center">
            <p className="text-2xl font-bold text-indigo-300">
              <AnimatedCounter to={10000} suffix="+" />
            </p>
            <p className="text-sm text-[#9B99B8]">Questions</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-indigo-300">
              <AnimatedCounter to={50} suffix="+" />
            </p>
            <p className="text-sm text-[#9B99B8]">Companies</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-indigo-300">
              <AnimatedCounter to={95} suffix="%" />
            </p>
            <p className="text-sm text-[#9B99B8]">Placement Rate</p>
          </div>
        </div>
      </section>
    </MotionPage>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap } from "lucide-react";
import { useAppStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const { setAuth } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Login failed"); return; }
      setAuth(data.user, data.token);
      toast.success("Welcome back!");
      window.location.href = "/coding";
    } catch {
      toast.error("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#17171D]/80 p-8 backdrop-blur-xl space-y-6">
        <div className="flex flex-col items-center gap-2">
          <span className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 p-2 text-white">
            <Zap className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Sign in to InterviewPrep</h1>
          <p className="text-sm text-[#9B99B8]">Welcome back — let's get you prepared</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-[#9B99B8]">Email</label>
            <input className="input-base w-full" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-[#9B99B8]">Password</label>
            <div className="relative">
              <input className="input-base w-full pr-10" type={show ? "text" : "password"}
                placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B99B8]" onClick={() => setShow(v => !v)}>
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="button-primary w-full py-2.5 disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-[#9B99B8]">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-indigo-300 hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}

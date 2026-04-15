"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, User, X, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";

const links = [
  { href: "/", label: "Home" },
  { href: "/coding", label: "Coding" },
  { href: "/mock-interview", label: "Mock" },
  { href: "/hr", label: "HR" },
  { href: "/resume", label: "Resume" },
  { href: "/admin", label: "Admin" }
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, token, clearAuth, setAuth } = useAppStore();

  // Rehydrate user from token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken && !user) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then((r) => r.json())
        .then((u) => { if (u?.id) setAuth(u, storedToken); })
        .catch(() => {});
    }
  }, []);

  function logout() {
    clearAuth();
    router.push("/");
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0F0F13]/85 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 p-1.5 text-white">
            <Zap className="h-4 w-4" />
          </span>
          <span className="bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-lg font-bold text-transparent tracking-tight">
            InterviewPrep
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href} className={`relative transition ${active ? "text-[#F1F0FF]" : "text-[#9B99B8] hover:text-white"}`}>
                {link.label}
                {active ? <span className="absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-indigo-400" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {token ? (
            <>
              <span className="flex items-center gap-1.5 text-sm text-[#9B99B8]">
                <User className="h-4 w-4" /> {user?.name ?? "User"}
              </span>
              <button onClick={logout} className="focus-ring flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-sm text-[#9B99B8] hover:text-white transition">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="focus-ring rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-[#F1F0FF] transition hover:bg-white/5">
                Sign In
              </Link>
              <Link href="/sign-up" className="focus-ring button-primary px-4 py-2 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="focus-ring rounded-xl border border-white/10 p-2 text-[#F1F0FF] md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle Menu">
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open ? (
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="glass fixed inset-0 top-16 p-6 md:hidden">
          <div className="grid gap-4">
            {links.map((link, index) => (
              <motion.div key={link.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                <Link href={link.href} onClick={() => setOpen(false)} className="block rounded-2xl border border-white/10 px-4 py-3 text-[#F1F0FF]">
                  {link.label}
                </Link>
              </motion.div>
            ))}
            {token ? (
              <button onClick={logout} className="rounded-2xl border border-white/10 px-4 py-3 text-left text-rose-400">Sign Out</button>
            ) : (
              <Link href="/sign-in" onClick={() => setOpen(false)} className="block rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-indigo-300">Sign In</Link>
            )}
          </div>
        </motion.div>
      ) : null}
    </header>
  );
}

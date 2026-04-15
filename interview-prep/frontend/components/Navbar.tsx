"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, X, Zap } from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/coding", label: "Coding" },
  { href: "/mock-interview", label: "Mock" },
  { href: "/hr", label: "HR" },
  { href: "/resume", label: "Resume" },
  { href: "/admin", label: "Admin" }
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link key={link.href} href={link.href} className={`relative transition ${active ? "text-[#F1F0FF]" : "text-[#9B99B8] hover:text-white"}`}>
                {link.label}
                {active ? <span className="absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-indigo-400" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Show when="signed-in">
            <button className="focus-ring rounded-xl border border-white/10 p-2 text-[#9B99B8] hover:text-white">
              <Bell className="h-4 w-4" />
            </button>
            <UserButton afterSignOutUrl="/" />
          </Show>
          <Show when="signed-out">
            <SignInButton>
              <button className="focus-ring rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-[#F1F0FF] transition hover:bg-white/5">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="focus-ring button-primary px-4 py-2 text-sm">Get Started</button>
            </SignUpButton>
          </Show>
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
          </div>
        </motion.div>
      ) : null}
    </header>
  );
}

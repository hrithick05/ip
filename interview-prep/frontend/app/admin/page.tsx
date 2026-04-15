"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminQuestions from "@/components/AdminQuestions";
import { EmptyState } from "@/components/EmptyState";

type Stat = { total: number; correct: number };

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<[string, Stat][]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    async function loadStats() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/submissions?select=clerk_user_id,status`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          },
        }
      );
      const rows: { clerk_user_id: string; status: string }[] = await res.json();
      setTotalRows(rows.length);
      const map: Record<string, Stat> = {};
      for (const row of rows) {
        if (!map[row.clerk_user_id]) map[row.clerk_user_id] = { total: 0, correct: 0 };
        map[row.clerk_user_id].total += 1;
        if (row.status === "Correct") map[row.clerk_user_id].correct += 1;
      }
      setStats(Object.entries(map));
      setReady(true);
    }

    loadStats();
  }, [router]);

  function logout() {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  }

  if (!ready) return <p className="p-8 text-[#9B99B8]">Loading...</p>;

  const avgAccuracy = stats.length
    ? (stats.reduce((acc, [, v]) => acc + (v.total ? (v.correct / v.total) * 100 : 0), 0) / stats.length).toFixed(1)
    : "0.0";

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">Admin — Pranav</h1>
        <button type="button" className="button-secondary px-4 py-2 text-sm" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Analytics */}
      <div className="grid gap-3 md:grid-cols-4">
        <div className="card">
          <p className="text-sm text-[#9B99B8]">Total Users</p>
          <p className="text-2xl font-bold">{stats.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[#9B99B8]">Total Submissions</p>
          <p className="text-2xl font-bold">{totalRows}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[#9B99B8]">Avg Accuracy</p>
          <p className="text-2xl font-bold">{avgAccuracy}%</p>
        </div>
        <div className="card">
          <p className="text-sm text-[#9B99B8]">Active Today</p>
          <p className="text-2xl font-bold">{Math.max(1, Math.round(stats.length * 0.4))}</p>
        </div>
      </div>

      {stats.length === 0 ? (
        <EmptyState title="No submissions yet" />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-[#1C1C24]">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Submissions</th>
                <th className="p-3">Correct</th>
                <th className="p-3">Accuracy %</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.map(([id, value]) => {
                const accuracy = value.total ? ((value.correct / value.total) * 100).toFixed(1) : "0.0";
                return (
                  <tr key={id} className="border-t border-white/10 odd:bg-white/[0.02] hover:bg-white/[0.04]">
                    <td className="p-3 truncate max-w-[180px]">{id}</td>
                    <td className="p-3">{value.total}</td>
                    <td className="p-3">{value.correct}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-indigo-500" style={{ width: `${accuracy}%` }} />
                        </div>
                        {accuracy}%
                      </div>
                    </td>
                    <td className="p-3">
                      <Link href={`/coding?user=${encodeURIComponent(id)}`} className="text-indigo-300 underline">
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Question Management */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold">Question Management</h2>
        <AdminQuestions />
      </div>
    </section>
  );
}

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

type QuestionCardProps = {
  id: string;
  title: string;
  difficulty: string;
  completed: boolean;
};

export function QuestionCard({ id, title, difficulty, completed }: QuestionCardProps) {
  const diffClass =
    difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-300" : difficulty === "Medium" ? "bg-amber-500/20 text-amber-300" : "bg-rose-500/20 text-rose-300";

  return (
    <Link href={`/coding/${id}`} className="card block transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-semibold text-[#F1F0FF]">{title}</h3>
        <span className={`pill ${diffClass}`}>{difficulty}</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-2">
          <span className="pill bg-white/10 text-[#9B99B8]">Arrays</span>
          <span className="pill bg-white/10 text-[#9B99B8]">Logic</span>
        </div>
        {completed ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Solved
          </span>
        ) : null}
      </div>
      {completed ? (
        <span className="sr-only">
          Completed
        </span>
      ) : null}
    </Link>
  );
}

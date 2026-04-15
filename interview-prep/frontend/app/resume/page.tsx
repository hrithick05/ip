import Link from "next/link";
import { MotionPage } from "@/components/MotionPage";

const templates = [
  { id: "1", title: "Minimal" },
  { id: "2", title: "Professional" },
  { id: "3", title: "Creative" },
  { id: "4", title: "Technical" }
];

export default function ResumeTemplatePage() {
  return (
    <MotionPage>
      <section className="space-y-4">
      <h1 className="text-2xl font-bold">Resume Templates</h1>
      <p className="text-[#9B99B8]">Choose a template to start building your premium resume.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <Link key={template.id} href={`/resume/${template.id}`} className="group relative card overflow-hidden transition hover:-translate-y-[3px]">
            <div className="mb-3 h-36 rounded-xl border border-white/10 bg-[#0F0F13] p-3">
              <div className="mb-2 h-3 w-2/3 rounded bg-white/10" />
              <div className="mb-2 h-2 w-full rounded bg-white/10" />
              <div className="mb-2 h-2 w-5/6 rounded bg-white/10" />
              <div className="h-16 rounded bg-indigo-500/10" />
            </div>
            <span className="pill bg-indigo-500/20 text-indigo-300">{template.title}</span>
            <div className="absolute inset-0 hidden items-center justify-center bg-black/45 group-hover:flex">
              <span className="button-primary px-4 py-2 text-sm">Use This Template</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
    </MotionPage>
  );
}

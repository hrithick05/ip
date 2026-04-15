import { FileX2 } from "lucide-react";

export function EmptyState({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-3">
        <FileX2 className="h-8 w-8 text-[#9B99B8]" />
      </div>
      <h3 className="text-lg font-semibold text-[#F1F0FF]">{title}</h3>
      <p className="mt-2 text-sm text-[#9B99B8]">No records found right now. Start by taking an action.</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

"use client";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  const lineCount = value.split("\n").length;
  const lines = Array.from({ length: Math.max(lineCount, 10) }, (_, i) => i + 1);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D1117]">
      <div className="flex border-b border-white/10 px-4 py-2 text-xs text-[#9B99B8]">
        <span>main.py</span>
      </div>
      <div className="flex">
        <div className="max-h-80 min-h-80 overflow-hidden border-r border-white/10 bg-[#0A0D13] px-3 py-4 font-mono text-xs text-[#6E749A]">
          {lines.map((line) => (
            <div key={line} className="leading-6">
              {line}
            </div>
          ))}
        </div>
        <textarea
          className="focus-ring min-h-80 w-full resize-none bg-[#0D1117] p-4 font-mono text-[14px] leading-6 text-[#C9D1D9] caret-indigo-400"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Write your Python code here..."
        />
      </div>
    </div>
  );
}

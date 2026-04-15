type InterviewQuestionProps = {
  questionText: string;
  options: string[];
  onSelect: (option: string) => void;
};

export function InterviewQuestion({ questionText, options, onSelect }: InterviewQuestionProps) {
  return (
    <div className="card">
      <h2 className="mb-4 text-lg font-semibold">{questionText}</h2>
      <div className="grid gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className="rounded border p-2 text-left hover:bg-slate-50"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

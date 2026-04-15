export function LoadingSpinner({ size = 20 }: { size?: number }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-indigo-400/30 border-t-indigo-400"
      style={{ width: size, height: size }}
      aria-hidden
    />
  );
}

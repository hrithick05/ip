import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-7xl font-bold text-transparent">404</h1>
      <p className="mt-3 text-lg text-[#9B99B8]">This page does not exist.</p>
      <Link href="/" className="button-primary mt-6 px-5 py-2.5">
        Back to Home
      </Link>
    </section>
  );
}

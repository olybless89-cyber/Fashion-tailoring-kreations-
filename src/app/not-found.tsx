import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-start justify-center px-6">
      <h1 className="display display-lg">Not found</h1>
      <p className="mt-4 text-stone">This page or order doesn&rsquo;t exist, or the link is incomplete.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn btn-ink">Go to the homepage</Link>
        <Link href="/track" className="btn btn-line">Track an order</Link>
      </div>
    </main>
  );
}

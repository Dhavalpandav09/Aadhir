import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <p className="font-serif text-8xl font-bold text-amber-400 mb-4">404</p>
      <p className="text-zinc-500 mb-8">This page doesn't exist</p>
      <Link href="/" className="btn-primary">Go Home</Link>
    </div>
  );
}

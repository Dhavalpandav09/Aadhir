'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 py-16 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <p className="font-serif text-2xl font-bold mb-3">MARCUS<span className="text-amber-400">.</span></p>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mb-6">
            Award-winning photographer capturing life's most significant moments with artistry and authenticity.
          </p>
          <div className="flex gap-3">
            {['IG', 'FB', 'YT', 'PIN'].map(s => (
              <a key={s} href="#" className="w-9 h-9 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-[10px] tracking-wider hover:border-amber-400 hover:text-amber-500 transition-all">{s}</a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase text-zinc-400 mb-4">Navigate</p>
          <div className="space-y-2">
            {[['/', 'Home'], ['/portfolio', 'Portfolio'], ['/projects', 'Projects'], ['/get-started', 'Get Started'], ['/contact', 'Contact']].map(([href, label]) => (
              <Link key={href} href={href} className="block text-sm text-zinc-500 hover:text-amber-500 transition-colors">{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase text-zinc-400 mb-4">Contact</p>
          <div className="space-y-2 text-sm text-zinc-500">
            <p>hello@marcusphoto.com</p>
            <p>+91 98765 43210</p>
            <p>Mumbai · Milan</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap justify-between items-center gap-4 text-xs text-zinc-400">
        <p>© {new Date().getFullYear()} Marcus Aurelius Photography. All rights reserved.</p>
        <Link href="/admin-login" className="hover:text-amber-500 transition-colors">Admin</Link>
      </div>
    </footer>
  );
}

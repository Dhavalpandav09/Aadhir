'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = [
  { href: '/',           label: 'Home' },
  { href: '/portfolio',  label: 'Portfolio' },
  { href: '/projects',   label: 'Projects' },
  { href: '/get-started',label: 'Get Started' },
  { href: '/contact',    label: 'Contact' },
];

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const isHome   = pathname === '/';
  const scrolled = scrollY > 50;
  const textLight = isHome && !scrolled;

  return (
    <nav className={`fixed w-full z-40 transition-all duration-500 ${
      scrolled
        ? dark ? 'bg-zinc-950/95 backdrop-blur-md shadow-xl' : 'bg-white/95 backdrop-blur-md shadow-xl'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className={`font-serif text-xl font-bold tracking-[0.15em] transition-colors ${textLight ? 'text-white' : dark ? 'text-white' : 'text-zinc-900'}`}>
          MARCUS<span className="text-amber-400">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`text-xs tracking-widest uppercase font-medium transition-colors ${
                pathname === href ? 'text-amber-400'
                : textLight ? 'text-white/80 hover:text-white'
                : dark ? 'text-zinc-300 hover:text-white'
                : 'text-zinc-600 hover:text-zinc-900'
              }`}>
              {label}
            </Link>
          ))}
          <button onClick={toggle} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            {dark ? <SunIcon className="w-5 h-5 text-amber-300" /> : <MoonIcon className={`w-5 h-5 ${textLight ? 'text-white' : 'text-zinc-700'}`} />}
          </button>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggle} className="p-2">
            {dark ? <SunIcon className="w-5 h-5 text-amber-300" /> : <MoonIcon className={`w-5 h-5 ${textLight ? 'text-white' : 'text-zinc-700'}`} />}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 flex flex-col gap-1.5 ${textLight ? 'text-white' : dark ? 'text-white' : 'text-zinc-900'}`}>
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={`md:hidden px-6 pb-6 ${dark ? 'bg-zinc-950' : 'bg-white'}`}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}
              className={`block py-3 text-sm tracking-widest uppercase border-b transition-colors ${
                dark ? 'border-zinc-800 text-zinc-300' : 'border-zinc-100 text-zinc-600'
              } ${pathname === href ? 'text-amber-500' : ''}`}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

function SunIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" /></svg>;
}
function MoonIcon({ className }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>;
}

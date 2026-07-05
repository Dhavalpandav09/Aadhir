'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPhotos, getProjects } from '../../lib/api';

export default function HeroSlideshow() {
  const [slides, setSlides]   = useState([]);
  const [current, setCurrent] = useState(0);
  const [fade, setFade]       = useState(true);

  useEffect(() => {
    Promise.allSettled([getPhotos({ limit: 20, featured: 'true' }), getProjects({ limit: 10 })]).then(([pr, jr]) => {
      const fromPhotos   = pr.status === 'fulfilled' ? (pr.value.data?.photos   || []).map(p => ({ src: p.src,   title: p.title, category: p.category })) : [];
      const fromProjects = jr.status === 'fulfilled' ? (jr.value.data?.projects || []).map(p => ({ src: p.cover, title: p.title, category: p.category })) : [];
      const combined = [...fromProjects, ...fromPhotos];
      const seen = new Set();
      const unique = combined.filter(s => { if (seen.has(s.src)) return false; seen.add(s.src); return true; });
      if (unique.length > 0) setSlides(unique.slice(0, 10));
    });
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setCurrent(c => (c + 1) % slides.length); setFade(true); }, 600);
    }, 5500);
    return () => clearInterval(t);
  }, [slides.length]);

  const s = slides[current];

  return (
    <section className="relative h-screen overflow-hidden bg-zinc-900">
      <div className={`absolute inset-0 transition-opacity duration-1000 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s?.src} alt={s?.title} className="w-full h-full object-cover animate-slow-zoom" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80" />
      </div>

      <div className="absolute top-24 left-8 z-10 hidden md:block">
        <div className={`transition-all duration-700 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <span className="inline-block px-3 py-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] tracking-[0.3em] uppercase backdrop-blur-sm">{s?.category}</span>
          <p className="text-white/50 text-xs mt-2">{s?.title}</p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <div style={{ animation: 'fadeUp 1.2s ease both', animationDelay: '0.3s' }}>
          <p className="text-xs tracking-[0.4em] uppercase text-amber-400 mb-4">Award-Winning Photography</p>
          <h1 className="font-serif text-5xl md:text-8xl font-bold leading-none mb-6">
            AADHIR<br /><span className="italic text-amber-300">FILMS</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto mb-10 font-light tracking-wide">
            Crafting timeless visual stories — from intimate weddings to grand fashion campaigns
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/portfolio" className="btn-primary">View Portfolio</Link>
            <Link href="/get-started" className="btn-outline">Book a Session</Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <div className="flex gap-2">
          {slides?.map((_, i) => (
            <button key={i} onClick={() => { setCurrent(i); setFade(true); }}
              className={`h-0.5 transition-all duration-500 ${i === current ? 'w-10 bg-amber-400' : 'w-4 bg-white/40 hover:bg-white/70'}`} />
          ))}
        </div>
        <span className="text-[10px] text-white/30 tracking-widest">{current + 1} / {slides?.length}</span>
      </div>

      <div className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2 text-white/40">
        <span className="text-[10px] tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        <div className="w-px h-12 bg-white/30 relative overflow-hidden">
          <div className="w-full bg-amber-400 absolute animate-scroll-line" style={{ height: '40%' }} />
        </div>
      </div>
    </section>
  );
}

'use client';
import { useState, useEffect, useCallback } from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import { Reveal, Spinner } from '../../components/ui/index';
import { getPhotos } from '../../lib/api';

const CATEGORIES = ['All', 'Wedding', 'Pre-wedding', 'Events', 'Portraits', 'Nature', 'Fashion'];

function Lightbox({ photos, index, onClose }) {
  const [cur, setCur] = useState(index);
  const prev = useCallback(() => setCur(c => (c - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setCur(c => (c + 1) % photos.length), [photos.length]);
  useEffect(() => {
    const fn = e => { if (e.key==='Escape') onClose(); if (e.key==='ArrowLeft') prev(); if (e.key==='ArrowRight') next(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose, prev, next]);
  const p = photos[cur];
  return (
    <div className="fixed inset-0 z-50 bg-black/96 flex items-center justify-center" onClick={onClose}>
      <button className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl z-10">✕</button>
      <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-6xl px-2 z-10" onClick={e=>{e.stopPropagation();prev();}}>‹</button>
      <div className="max-w-5xl max-h-[90vh] px-16" onClick={e=>e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.src} alt={p.title} className="max-h-[78vh] w-auto mx-auto object-contain" />
        <div className="text-center mt-4">
          <p className="text-white font-semibold">{p.title}</p>
          <p className="text-zinc-400 text-sm mt-1">{p.location}</p>
          <p className="text-amber-400 text-xs tracking-widest uppercase mt-1">{p.category}</p>
        </div>
      </div>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-6xl px-2 z-10" onClick={e=>{e.stopPropagation();next();}}>›</button>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-zinc-600 text-xs">{cur+1} / {photos.length}</div>
    </div>
  );
}

export default function PortfolioPage() {
  const [cat, setCat]           = useState('All');
  const [allPhotos, setAllPhotos] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [lbIndex, setLbIndex]   = useState(null);

  useEffect(() => {
    getPhotos({ limit: 200 })
      .then(r => setAllPhotos(r.data?.photos || []))
      .catch(() => setAllPhotos([]))
      .finally(() => setLoading(false));
  }, []);

  const photos = cat === 'All' ? allPhotos : allPhotos.filter(p => p.category === cat);

  return (
    <PublicLayout>
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Reveal><span className="section-label">Visual Stories</span></Reveal>
          <Reveal delay={100}><h1 className="font-serif text-5xl md:text-6xl font-bold">Portfolio</h1></Reveal>
          {!loading && <Reveal delay={200}><p className="text-zinc-500 mt-4">{allPhotos.length} photographs</p></Reveal>}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map(c => {
            const count = c === 'All' ? allPhotos.length : allPhotos.filter(p => p.category === c).length;
            return (
              <button key={c} onClick={() => setCat(c)}
                className={`px-5 py-2 text-xs tracking-widest uppercase transition-all ${cat===c ? 'bg-amber-400 text-zinc-900 font-bold' : 'border border-zinc-300 dark:border-zinc-700 dark:text-zinc-300 hover:border-amber-400 hover:text-amber-500'}`}>
                {c} <span className="opacity-50 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : photos.length === 0 ? (
          <div className="text-center py-24 text-zinc-500">
            <p className="text-5xl mb-4">📷</p>
            <p className="text-lg mb-2">{cat==='All' ? 'No photos yet' : `No photos in "${cat}"`}</p>
            <p className="text-sm opacity-60">{cat==='All' ? 'Upload photos from the admin panel' : 'Try another category'}</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {photos.map((photo, i) => (
              <div key={photo._id}
                className="masonry-item group cursor-pointer relative overflow-hidden bg-zinc-100 dark:bg-zinc-800"
                style={{ animation: 'fadeUp 0.5s ease both', animationDelay: `${Math.min(i*40,400)}ms` }}
                onClick={() => setLbIndex(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.src} alt={photo.title} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white font-semibold text-sm">{photo.title}</p>
                  <p className="text-amber-400 text-xs tracking-wider mt-0.5">{photo.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {lbIndex !== null && <Lightbox photos={photos} index={lbIndex} onClose={() => setLbIndex(null)} />}
      </div>
    </PublicLayout>
  );
}

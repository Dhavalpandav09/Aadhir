'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicLayout from '../../components/layout/PublicLayout';
import { Reveal, Divider, Spinner } from '../../components/ui/index';
import { getProjects } from '../../lib/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getProjects({ limit: 20 })
      .then(r => setProjects(r.data?.projects || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <PublicLayout><div className="flex justify-center items-center min-h-screen"><Spinner size="lg" /></div></PublicLayout>
  );

  return (
    <PublicLayout>
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <Reveal><span className="section-label">Behind the Lens</span></Reveal>
          <Reveal delay={100}><h1 className="font-serif text-5xl md:text-6xl font-bold">Projects</h1></Reveal>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-24 text-zinc-500">
            <p className="text-5xl mb-4">🎬</p>
            <p className="text-lg mb-2">No projects yet</p>
            <p className="text-sm opacity-60">Add your first project from the admin panel</p>
          </div>
        ) : (
          <div className="space-y-24">
            {projects.map((p, i) => (
              <Reveal key={p._id} delay={i * 80}>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                    <Link href={`/projects/${p._id}`} className="group overflow-hidden block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.cover} alt={p.title}
                        className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy" />
                    </Link>
                  </div>
                  <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                    <p className="text-xs tracking-[0.4em] uppercase text-amber-500 mb-4">
                      {p.location} · {new Date(p.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">{p.title}</h2>
                    <Divider />
                    <p className="text-zinc-500 leading-relaxed mb-8">{p.description}</p>
                    <Link href={`/projects/${p._id}`}
                      className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-amber-500 border-b border-amber-500 pb-1 hover:gap-4 transition-all">
                      View Project →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

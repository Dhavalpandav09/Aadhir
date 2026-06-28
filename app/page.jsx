'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicLayout from '../components/layout/PublicLayout';
import HeroSlideshow from '../components/home/HeroSlideshow';
import { AboutSection, TestimonialsSection, QuickContactSection } from '../components/home/HomeSections';
import { Reveal, Divider, Spinner } from '../components/ui/index';
import { getProjects } from '../lib/api';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getProjects({ limit: 3 })
      .then(r => setProjects(r.data?.projects || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      <HeroSlideshow />
      <AboutSection />

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <Reveal><span className="section-label">Selected Work</span></Reveal>
            <Reveal delay={100}><h2 className="font-serif text-4xl md:text-5xl font-bold">Recent Projects</h2></Reveal>
          </div>
          <Link href="/projects" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase text-amber-500 hover:gap-4 transition-all">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-zinc-400">
            <p className="text-lg mb-2">No projects yet</p>
            <p className="text-sm opacity-60">Add your first project from the admin panel</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <Reveal key={p._id} delay={i * 150}>
                <Link href={`/projects/${p._id}`} className="group block">
                  <div className="overflow-hidden mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.cover} alt={p.title}
                      className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy" />
                  </div>
                  <p className="text-xs tracking-[0.3em] uppercase text-amber-500 mb-1">{p.location}</p>
                  <h3 className="font-serif text-xl font-bold mb-1">{p.title}</h3>
                  <p className="text-zinc-500 text-sm">
                    {new Date(p.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
        <div className="mt-10 text-center md:hidden">
          <Link href="/projects" className="btn-primary">View All Projects</Link>
        </div>
      </section>

      <TestimonialsSection />
      <QuickContactSection />
    </PublicLayout>
  );
}

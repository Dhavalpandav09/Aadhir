'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PublicLayout from '../../../components/layout/PublicLayout';
import { Reveal, Divider, Spinner } from '../../../components/ui/index';
import { getProjectById } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function ProjectDetailPage({ params }) {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjectById(params.id)
      .then(r => setProject(r.data))
      .catch(() => { toast.error('Project not found'); router.push('/projects'); })
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading) return (
    <PublicLayout><div className="flex justify-center items-center min-h-screen"><Spinner size="lg" /></div></PublicLayout>
  );
  if (!project) return null;

  return (
    <PublicLayout>
      <div className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
        <Link href="/projects"
          className="inline-flex items-center gap-2 text-amber-500 text-sm tracking-widest uppercase mb-12 hover:gap-4 transition-all">
          ← Back to Projects
        </Link>

        <Reveal>
          <p className="text-xs tracking-[0.4em] uppercase text-amber-500 mb-3">
            {project.location} · {new Date(project.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
          <Divider />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.cover} alt={project.title} className="w-full aspect-video object-cover mb-8" />
          <p className="text-zinc-500 text-lg leading-relaxed mb-12">{project.description}</p>
        </Reveal>

        {project.photos?.length > 0 && (
          <div className="mb-16">
            <Reveal><h2 className="font-serif text-2xl font-bold mb-6">Gallery</h2></Reveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.photos.map((src, i) => (
                <Reveal key={i} delay={i * 60}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy"
                    className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300" />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {project.videos?.length > 0 && (
          <div className="mb-16">
            <Reveal><h2 className="font-serif text-2xl font-bold mb-6">Videos</h2></Reveal>
            <div className="grid md:grid-cols-2 gap-6">
              {project.videos.map((video, i) => (
                <Reveal key={i} delay={i * 80}>
                  {video.type === 'upload' ? (
                    <video src={video.url} controls preload="metadata" poster={project.cover}
                      className="w-full aspect-video bg-black" />
                  ) : (
                    <div className="relative w-full aspect-video">
                      <iframe src={video.url} title={video.title || `Video ${i + 1}`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen />
                    </div>
                  )}
                  {video.title && <p className="text-zinc-400 text-sm mt-2">{video.title}</p>}
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

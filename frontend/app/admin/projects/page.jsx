'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getAllProjects, createProject, updateProject, deleteProject } from '../../../lib/api';
import { Spinner, Badge, EmptyState } from '../../../components/ui/index';
import toast from 'react-hot-toast';

const CATEGORIES = ['Wedding', 'Pre-wedding', 'Events', 'Portraits', 'Nature', 'Fashion', 'Corporate', 'Other'];
const iCls = (err) => `w-full px-4 py-3 bg-zinc-800 border ${err ? 'border-red-500' : 'border-zinc-700'} text-white text-sm focus:outline-none focus:border-amber-400 transition-colors`;
const sCls = () => `w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors cursor-pointer`;

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs text-zinc-400 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function ProjectModal({ project, onClose, onSaved }) {
  const isEdit = !!project;
  const [tab, setTab] = useState('basic');
  const [form, setForm] = useState(isEdit ? {
    title: project.title || '', location: project.location || '',
    date: project.date ? project.date.slice(0, 10) : '',
    description: project.description || '', category: project.category || 'Wedding',
    coverUrl: '', featured: project.featured ?? false, published: project.published ?? true,
    videoUrls: '',
  } : { title: '', location: '', date: '', description: '', category: 'Wedding', coverUrl: '', featured: false, published: true, videoUrls: '' });

  const [coverFile,  setCoverFile]  = useState(null);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [saving,  setSaving]  = useState(false);
  const [errors,  setErrors]  = useState({});
  const coverRef  = useRef(null);
  const photosRef = useRef(null);
  const videosRef = useRef(null);
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Required';
    if (!form.location.trim())    e.location    = 'Required';
    if (!form.date)               e.date        = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    if (!isEdit && !coverFile && !form.coverUrl.trim()) e.coverUrl = 'Cover image is required';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      if (e.title || e.location || e.date || e.description) setTab('basic');
      else if (e.coverUrl) setTab('media');
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title',       form.title.trim());
      fd.append('location',    form.location.trim());
      fd.append('date',        form.date);
      fd.append('description', form.description.trim());
      fd.append('category',    form.category);
      fd.append('featured',    String(form.featured));
      fd.append('published',   String(form.published));
      if (coverFile)             fd.append('cover', coverFile);
      else if (form.coverUrl.trim()) fd.append('coverUrl', form.coverUrl.trim());
      photoFiles.forEach(f => fd.append('photos', f));
      videoFiles.forEach(f => fd.append('videos', f));
      if (form.videoUrls.trim()) fd.append('videoUrls', form.videoUrls.trim());

      if (isEdit) { await updateProject(project._id, fd); toast.success('Project updated!'); }
      else        { await createProject(fd);              toast.success('Project created!'); }
      onSaved(); onClose();
    } catch (err) {
      toast.error(err?.response?.data?.error || (isEdit ? 'Update failed' : 'Create failed'));
    } finally { setSaving(false); }
  };

  const TABS = [{ id: 'basic', label: '① Details' }, { id: 'media', label: '② Photos' }, { id: 'videos', label: '③ Videos' }];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-start justify-center overflow-y-auto p-4">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 shadow-2xl my-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
          <h2 className="text-lg font-bold text-white">{isEdit ? `Edit: ${project.title}` : 'Create New Project'}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${tab === t.id ? 'text-amber-400 border-b-2 border-amber-400 bg-zinc-800/50' : 'text-zinc-400 hover:text-zinc-200'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6 min-h-[400px]">
          {/* ── Tab 1: Basic ── */}
          {tab === 'basic' && (
            <div className="space-y-4">
              <Field label="Project Title *" error={errors.title}>
                <input className={iCls(errors.title)} placeholder="e.g. Aria & James Wedding" value={form.title} onChange={e => set('title', e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Location *" error={errors.location}>
                  <input className={iCls(errors.location)} placeholder="City, Country" value={form.location} onChange={e => set('location', e.target.value)} />
                </Field>
                <Field label="Date *" error={errors.date}>
                  <input type="date" className={iCls(errors.date)} value={form.date} onChange={e => set('date', e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <select className={sCls()} value={form.category} onChange={e => set('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-zinc-800 text-white">{c}</option>)}
                  </select>
                </Field>
                <Field label="Status">
                  <select className={sCls()} value={String(form.published)} onChange={e => set('published', e.target.value === 'true')}>
                    <option value="true"  className="bg-zinc-800 text-white">Published</option>
                    <option value="false" className="bg-zinc-800 text-white">Draft (hidden)</option>
                  </select>
                </Field>
              </div>
              <Field label="Description *" error={errors.description}>
                <textarea rows={5} className={`${iCls(errors.description)} resize-none`}
                  placeholder="Describe this project..." value={form.description} onChange={e => set('description', e.target.value)} />
              </Field>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 accent-amber-400" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                <span className="text-sm text-zinc-300">Feature on homepage</span>
              </label>
              <div className="pt-2">
                <button onClick={() => setTab('media')} className="px-6 py-2.5 bg-amber-400 text-zinc-900 text-sm font-bold hover:bg-amber-300 transition-colors">Next: Add Photos →</button>
              </div>
            </div>
          )}

          {/* ── Tab 2: Photos ── */}
          {tab === 'media' && (
            <div className="space-y-5">
              <div className="border border-zinc-700 p-4 space-y-3">
                <p className="text-xs text-zinc-300 uppercase tracking-widest font-semibold">
                  Cover Image {!isEdit && <span className="text-red-400">*</span>}
                </p>
                {(coverFile || (isEdit && project.cover)) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverFile ? URL.createObjectURL(coverFile) : project.cover} alt="cover" className="h-36 w-full object-cover border border-zinc-700" />
                )}
                <Field label="Upload cover file" error={errors.coverUrl}>
                  <div className="flex items-center gap-3">
                    <input ref={coverRef} type="file" accept="image/*" className="hidden"
                      onChange={e => { setCoverFile(e.target.files[0] || null); setErrors(er => ({ ...er, coverUrl: '' })); }} />
                    <button type="button" onClick={() => coverRef.current?.click()} className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm">Choose File</button>
                    <span className="text-zinc-400 text-sm truncate">{coverFile ? coverFile.name : isEdit ? 'Keep existing' : 'No file chosen'}</span>
                    {coverFile && <button onClick={() => { setCoverFile(null); if (coverRef.current) coverRef.current.value = ''; }} className="text-red-400 text-xs">✕</button>}
                  </div>
                </Field>
                <Field label="— OR paste cover URL" error={!coverFile ? errors.coverUrl : ''}>
                  <input className={iCls(!coverFile ? errors.coverUrl : '')} placeholder="https://example.com/cover.jpg" value={form.coverUrl} onChange={e => set('coverUrl', e.target.value)} />
                </Field>
              </div>

              <div className="border border-zinc-700 p-4 space-y-3">
                <p className="text-xs text-zinc-300 uppercase tracking-widest font-semibold">Gallery Photos (optional)</p>
                {isEdit && project.photos?.length > 0 && photoFiles.length === 0 && (
                  <div>
                    <p className="text-zinc-500 text-xs mb-2">Existing ({project.photos.length}) — new uploads will be added:</p>
                    <div className="flex gap-2 flex-wrap">
                      {project.photos.map((src, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={src} alt="" className="h-14 w-14 object-cover border border-zinc-700 opacity-60" />
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 flex-wrap">
                  <input ref={photosRef} type="file" accept="image/*" multiple className="hidden" onChange={e => setPhotoFiles(Array.from(e.target.files))} />
                  <button type="button" onClick={() => photosRef.current?.click()} className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm">Choose Photos</button>
                  <span className="text-zinc-400 text-sm">{photoFiles.length > 0 ? `${photoFiles.length} photo(s)` : 'No files chosen'}</span>
                  {photoFiles.length > 0 && <button onClick={() => { setPhotoFiles([]); if (photosRef.current) photosRef.current.value = ''; }} className="text-red-400 text-xs">Clear</button>}
                </div>
                {photoFiles.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {photoFiles.map((f, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={URL.createObjectURL(f)} alt="" className="h-16 w-16 object-cover border border-amber-400/40" />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-2">
                <button onClick={() => setTab('basic')} className="px-6 py-2.5 bg-zinc-700 text-white text-sm hover:bg-zinc-600 transition-colors">← Back</button>
                <button onClick={() => setTab('videos')} className="px-6 py-2.5 bg-amber-400 text-zinc-900 text-sm font-bold hover:bg-amber-300 transition-colors">Next: Add Videos →</button>
              </div>
            </div>
          )}

          {/* ── Tab 3: Videos ── */}
          {tab === 'videos' && (
            <div className="space-y-5">
              <p className="text-zinc-400 text-sm leading-relaxed">Add YouTube/Vimeo links or upload video files (MP4, MOV, WebM).</p>

              {isEdit && project.videos?.length > 0 && (
                <div className="border border-zinc-700 p-4">
                  <p className="text-xs text-zinc-300 uppercase tracking-widest font-semibold mb-3">Existing Videos ({project.videos.length})</p>
                  <div className="space-y-2">
                    {project.videos.map((v, i) => (
                      <div key={i} className="flex items-center gap-3 bg-zinc-800 p-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${v.type==='youtube' ? 'bg-red-500/20 text-red-400' : v.type==='vimeo' ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-600 text-zinc-300'}`}>
                          {v.type==='youtube' ? '▶ YouTube' : v.type==='vimeo' ? '▶ Vimeo' : '🎬 File'}
                        </span>
                        <span className="text-zinc-400 text-xs truncate flex-1">{v.title || v.url}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border border-zinc-700 p-4 space-y-3">
                <p className="text-xs text-zinc-300 uppercase tracking-widest font-semibold">YouTube / Vimeo Links</p>
                <p className="text-zinc-500 text-xs">Paste one or more links separated by commas.</p>
                <textarea rows={3} className={`${iCls()} resize-none`}
                  placeholder="https://youtube.com/watch?v=..., https://vimeo.com/..."
                  value={form.videoUrls} onChange={e => set('videoUrls', e.target.value)} />
              </div>

              <div className="border border-zinc-700 p-4 space-y-3">
                <p className="text-xs text-zinc-300 uppercase tracking-widest font-semibold">Upload Video Files</p>
                <p className="text-zinc-500 text-xs">MP4, MOV, WebM — max 200MB each.</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <input ref={videosRef} type="file" accept="video/mp4,video/mov,video/webm,video/quicktime" multiple className="hidden"
                    onChange={e => setVideoFiles(Array.from(e.target.files))} />
                  <button type="button" onClick={() => videosRef.current?.click()} className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm">Choose Videos</button>
                  <span className="text-zinc-400 text-sm">{videoFiles.length > 0 ? `${videoFiles.length} video(s)` : 'No files chosen'}</span>
                  {videoFiles.length > 0 && <button onClick={() => { setVideoFiles([]); if (videosRef.current) videosRef.current.value = ''; }} className="text-red-400 text-xs">Clear</button>}
                </div>
                {videoFiles.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {videoFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 bg-zinc-800 p-3">
                        <span className="text-2xl">🎬</span>
                        <div><p className="text-white text-sm truncate">{f.name}</p><p className="text-zinc-500 text-xs">{(f.size/1024/1024).toFixed(1)} MB</p></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-2">
                <button onClick={() => setTab('media')} className="px-6 py-2.5 bg-zinc-700 text-white text-sm hover:bg-zinc-600 transition-colors">← Back</button>
                <button onClick={handleSave} disabled={saving}
                  className="px-8 py-2.5 bg-amber-400 text-zinc-900 text-sm font-bold hover:bg-amber-300 transition-colors disabled:opacity-60 flex items-center gap-2 min-w-[160px] justify-center">
                  {saving ? <><Spinner size="sm" /> Saving…</> : (isEdit ? '✓ Update Project' : '✓ Create Project')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getAllProjects({ limit: 100 })
      .then(r => setProjects(r.data?.projects || []))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await deleteProject(id); setProjects(p => p.filter(pr => pr._id !== id)); toast.success('Deleted'); }
    catch (err) { toast.error(err?.response?.data?.error || 'Delete failed'); }
  };

  return (
    <div className="p-8">
      {modal && <ProjectModal project={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSaved={load} />}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Manage Projects</h1>
        <button onClick={() => setModal('new')} className="px-6 py-3 bg-amber-400 text-zinc-900 text-sm font-bold tracking-wider hover:bg-amber-300 transition-colors">+ New Project</button>
      </div>
      {loading ? <div className="flex justify-center py-24"><Spinner size="lg" /></div>
       : projects.length === 0 ? <EmptyState message="No projects yet — click '+ New Project'" />
       : (
        <>
          <p className="text-zinc-500 text-sm mb-4">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
          <div className="space-y-3">
            {projects.map(p => (
              <div key={p._id} className="flex gap-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 p-4 items-center transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt={p.title} className="w-24 h-16 object-cover border border-zinc-700 flex-shrink-0" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-white truncate">{p.title}</p>
                    {p.featured   && <Badge color="amber">Featured</Badge>}
                    {!p.published && <Badge color="zinc">Draft</Badge>}
                    <Badge color="blue">{p.category}</Badge>
                    {p.videos?.length > 0 && <Badge color="red">🎬 {p.videos.length}</Badge>}
                  </div>
                  <p className="text-zinc-400 text-sm truncate">{p.location}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    {new Date(p.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    {p.photos?.length > 0 && ` · ${p.photos.length} photo${p.photos.length > 1 ? 's' : ''}`}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setModal(p)} className="px-4 py-2 bg-amber-400/10 text-amber-400 border border-amber-400/30 text-sm hover:bg-amber-400/20 transition-colors">✎ Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-400/30 text-sm hover:bg-red-500/20 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

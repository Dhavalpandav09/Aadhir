'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getPhotos, createPhoto, updatePhoto, deletePhoto } from '../../../lib/api';
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

function PhotoModal({ photo, onClose, onSaved }) {
  const isEdit = !!photo;
  const [form, setForm] = useState({ title: photo?.title ?? '', category: photo?.category ?? 'Wedding', location: photo?.location ?? '', featured: photo?.featured ?? false, src: '' });
  const [file, setFile]     = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const handleSave = async () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Required';
    if (!isEdit && !file && !form.src.trim()) e.src = 'Upload a file or paste a URL';
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title',    form.title.trim());
      fd.append('category', form.category);
      fd.append('location', form.location.trim());
      fd.append('featured', String(form.featured));
      if (!isEdit && form.src.trim() && !file) fd.append('src', form.src.trim());
      if (file) fd.append('image', file);
      if (isEdit) { await updatePhoto(photo._id, fd); toast.success('Photo updated!'); }
      else        { await createPhoto(fd);            toast.success('Photo uploaded!'); }
      onSaved(); onClose();
    } catch (err) { toast.error(err?.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Photo' : 'Upload Photo'}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl leading-none">✕</button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {(file || (isEdit && photo.src)) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={file ? URL.createObjectURL(file) : photo.src} alt="preview" className="w-full h-36 object-cover border border-zinc-700" />
          )}
          <Field label="Title *" error={errors.title}>
            <input className={iCls(errors.title)} placeholder="Photo title" value={form.title} onChange={e => set('title', e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select className={sCls()} value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-zinc-800 text-white">{c}</option>)}
              </select>
            </Field>
            <Field label="Location">
              <input className={iCls()} placeholder="City, Country" value={form.location} onChange={e => set('location', e.target.value)} />
            </Field>
          </div>
          <Field label={isEdit ? 'Replace Image (optional)' : 'Upload Image File'}>
            <div className="flex items-center gap-3">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files[0] || null)} />
              <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm">Choose File</button>
              <span className="text-zinc-400 text-sm truncate">{file ? file.name : isEdit ? 'Keep existing' : 'No file chosen'}</span>
              {file && <button onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }} className="text-red-400 text-xs">✕</button>}
            </div>
          </Field>
          {!isEdit && (
            <Field label="— OR paste image URL" error={errors.src}>
              <input className={iCls(errors.src)} placeholder="https://example.com/photo.jpg" value={form.src} onChange={e => set('src', e.target.value)} />
            </Field>
          )}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input type="checkbox" className="w-4 h-4 accent-amber-400" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
            <span className="text-sm text-zinc-300">Mark as Featured</span>
          </label>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-800">
          <button onClick={onClose} disabled={saving} className="px-6 py-2.5 bg-zinc-700 text-sm text-white hover:bg-zinc-600 transition-colors disabled:opacity-50">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-8 py-2.5 bg-amber-400 text-zinc-900 text-sm font-bold hover:bg-amber-300 transition-colors disabled:opacity-60 flex items-center gap-2 min-w-[130px] justify-center">
            {saving ? <><Spinner size="sm" /> Saving…</> : (isEdit ? 'Save Changes' : 'Upload Photo')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPortfolio() {
  const [photos,  setPhotos]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getPhotos({ limit: 200 })
      .then(r => setPhotos(r.data?.photos || []))
      .catch(() => toast.error('Failed to load photos'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try { await deletePhoto(id); setPhotos(p => p.filter(x => x._id !== id)); toast.success('Deleted'); }
    catch (err) { toast.error(err?.response?.data?.error || 'Delete failed'); }
  };

  return (
    <div className="p-8">
      {modal && <PhotoModal photo={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSaved={load} />}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Manage Portfolio</h1>
        <button onClick={() => setModal('new')} className="px-6 py-3 bg-amber-400 text-zinc-900 text-sm font-bold tracking-wider hover:bg-amber-300">+ Upload Photo</button>
      </div>
      {loading ? <div className="flex justify-center py-24"><Spinner size="lg" /></div>
       : photos.length === 0 ? <EmptyState message="No photos yet" />
       : (
        <>
          <p className="text-zinc-500 text-sm mb-4">{photos.length} photos</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {photos.map(photo => (
              <div key={photo._id} className="relative group aspect-square overflow-hidden bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <p className="text-white text-xs text-center font-semibold line-clamp-2">{photo.title}</p>
                  <Badge color="amber">{photo.category}</Badge>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => setModal(photo)} className="px-3 py-1.5 bg-amber-400 text-zinc-900 text-xs font-bold hover:bg-amber-300">Edit</button>
                    <button onClick={() => handleDelete(photo._id)} className="px-3 py-1.5 bg-red-500 text-white text-xs hover:bg-red-600">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

'use client';
import { useState, useEffect, useCallback } from 'react';
import { getEnquiries, updateEnquiry, deleteEnquiry } from '../../../lib/api';
import { Spinner, Badge, EmptyState } from '../../../components/ui/index';
import toast from 'react-hot-toast';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('all');

  const load = useCallback(() => {
    setLoading(true);
    const params = filter === 'all' ? {} : { contacted: filter === 'contacted' };
    getEnquiries(params)
      .then(r => setEnquiries(r.data?.enquiries || []))
      .catch(() => toast.error('Failed to load enquiries'))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const toggleContacted = async (id, current) => {
    try {
      await updateEnquiry(id, { contacted: !current });
      setEnquiries(p => p.map(e => e._id === id ? { ...e, contacted: !current } : e));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try { await deleteEnquiry(id); setEnquiries(p => p.filter(e => e._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  const pending   = enquiries.filter(e => !e.contacted).length;
  const contacted = enquiries.filter(e =>  e.contacted).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Manage Enquiries</h1>
        <div className="flex gap-4 text-sm">
          <span className="text-amber-400 font-semibold">{pending} pending</span>
          <span className="text-zinc-400">{contacted} contacted</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {[['all','All'],['pending','Pending'],['contacted','Contacted']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors ${filter===v ? 'bg-amber-400 text-zinc-900 font-bold' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
            {l}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-24"><Spinner size="lg" /></div>
       : enquiries.length === 0 ? <EmptyState icon="✉" message="No enquiries found" />
       : (
        <div className="space-y-4">
          {enquiries.map(e => (
            <div key={e._id} className="bg-zinc-900 border border-zinc-800 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-white">{e.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mt-1">
                    <a href={`mailto:${e.email}`} className="hover:text-amber-400 transition-colors">✉ {e.email}</a>
                    {e.phone && <a href={`tel:${e.phone}`} className="hover:text-amber-400">✆ {e.phone}</a>}
                  </div>
                </div>
                <Badge color={e.contacted ? 'green' : 'amber'}>{e.contacted ? 'Contacted' : 'Pending'}</Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-zinc-500 mb-4">
                <span>Event: <span className="text-zinc-300">{e.eventType || '—'}</span></span>
                {e.eventDate && <span>Date: <span className="text-zinc-300">{new Date(e.eventDate).toLocaleDateString()}</span></span>}
                <span>Received: <span className="text-zinc-300">{new Date(e.createdAt).toLocaleDateString()}</span></span>
              </div>
              {e.message && <p className="text-zinc-400 text-sm mb-4 border-l-2 border-amber-400 pl-4 italic">"{e.message}"</p>}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => toggleContacted(e._id, e.contacted)} className="px-4 py-2 text-xs bg-amber-400/10 text-amber-400 border border-amber-400/30 hover:bg-amber-400/20 transition-colors">
                  {e.contacted ? 'Mark Pending' : 'Mark Contacted'}
                </button>
                <a href={`mailto:${e.email}?subject=Re: Photography Enquiry`} className="px-4 py-2 text-xs bg-blue-500/10 text-blue-400 border border-blue-400/30 hover:bg-blue-500/20 transition-colors">
                  Reply via Email
                </a>
                {e.phone && (
                  <a href={`https://wa.me/${e.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="px-4 py-2 text-xs bg-green-500/10 text-green-400 border border-green-400/30 hover:bg-green-500/20 transition-colors">WhatsApp</a>
                )}
                <button onClick={() => handleDelete(e._id)} className="px-4 py-2 text-xs bg-red-500/10 text-red-400 border border-red-400/30 hover:bg-red-500/20 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { getStats } from '../../../lib/api';
import { Spinner, Badge, EmptyState } from '../../../components/ui/index';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(r => setStats(r.data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center pt-24"><Spinner size="lg" /></div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8 text-white">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Total Enquiries',   value: stats?.totalEnquiries   ?? 0, g: 'from-amber-400 to-amber-600' },
          { label: 'Active Projects',   value: stats?.totalProjects    ?? 0, g: 'from-blue-500 to-blue-700' },
          { label: 'Photos Uploaded',   value: stats?.totalPhotos      ?? 0, g: 'from-emerald-500 to-emerald-700' },
          { label: 'Pending Responses', value: stats?.pendingEnquiries ?? 0, g: 'from-rose-500 to-rose-700' },
        ].map(c => (
          <div key={c.label} className={`bg-gradient-to-br ${c.g} p-6 rounded-sm`}>
            <p className="text-4xl font-bold mb-1">{c.value}</p>
            <p className="text-sm opacity-80">{c.label}</p>
          </div>
        ))}
      </div>
      <h2 className="text-lg font-semibold mb-4 text-zinc-300">Recent Enquiries</h2>
      <div className="space-y-3">
        {!stats?.recentEnquiries?.length && <EmptyState icon="✉" message="No enquiries yet" />}
        {stats?.recentEnquiries?.map(e => (
          <div key={e._id} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-6 py-4">
            <div>
              <p className="font-semibold text-white">{e.name}</p>
              <p className="text-zinc-400 text-sm">{e.eventType} · {new Date(e.createdAt).toLocaleDateString()}</p>
            </div>
            <Badge color={e.contacted ? 'green' : 'amber'}>{e.contacted ? 'Contacted' : 'Pending'}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [show,     setShow]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const { isAdmin, adminLogin } = useAuth();
  const router = useRouter();

  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (isAdmin) router.replace('/admin/dashboard');
  }, [isAdmin, router]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!password) return;
    setLoading(true);
    try {
      const res = await loginAdmin(password);
      adminLogin(res.data.token);
      toast.success('Welcome, Marcus!');
      router.push('/admin/dashboard');
    } catch {
      toast.error('Invalid password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <p className="font-serif text-3xl font-bold text-white mb-2">
            MARCUS<span className="text-amber-400">.</span>
          </p>
          <p className="text-xs tracking-[0.3em] uppercase text-zinc-500">Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              placeholder="Enter admin password"
              className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-amber-400 pr-16 transition-colors"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            <button type="button" onClick={() => setShow(s => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs tracking-wider transition-colors">
              {show ? 'HIDE' : 'SHOW'}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-4 bg-amber-400 text-zinc-900 text-sm tracking-widest uppercase font-bold hover:bg-amber-300 transition-all disabled:opacity-60">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-zinc-600 text-xs text-center mt-8">Authorized personnel only</p>
      </div>
    </div>
  );
}

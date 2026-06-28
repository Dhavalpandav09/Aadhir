'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../../components/ui/index';
import toast from 'react-hot-toast';

const MENU = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/portfolio',  label: 'Portfolio',  icon: '◫' },
  { href: '/admin/projects',   label: 'Projects',   icon: '◈' },
  { href: '/admin/enquiries',  label: 'Enquiries',  icon: '✉' },
];

export default function AdminLayout({ children }) {
  const { isAdmin, loading, adminLogout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect once auth check is complete
    if (!loading && !isAdmin) {
      router.replace('/admin-login');
    }
  }, [isAdmin, loading, router]);

  // Show spinner only while verifying an existing token
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Not authenticated — render nothing (redirect is in progress)
  if (!isAdmin) return null;

  const handleLogout = () => {
    adminLogout();
    toast.success('Logged out');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-56 bg-zinc-900 flex flex-col border-r border-zinc-800 fixed h-full z-30">
        <div className="p-6 border-b border-zinc-800">
          <p className="font-serif text-lg font-bold">MARCUS<span className="text-amber-400">.</span></p>
          <p className="text-[10px] tracking-widest uppercase text-zinc-500 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {MENU.map(({ href, label, icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-all ${
                pathname === href
                  ? 'bg-amber-400 text-zinc-900 font-semibold'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}>
              <span>{icon}</span> {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800 space-y-2">
          <Link href="/"
            className="block w-full text-center py-2 text-xs tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">
            View Site →
          </Link>
          <button onClick={handleLogout}
            className="w-full py-2 text-xs tracking-widest uppercase text-zinc-500 hover:text-red-400 transition-colors">
            Logout
          </button>
        </div>
      </aside>
      {/* Main */}
      <main className="flex-1 ml-56 overflow-auto min-h-screen bg-zinc-950">
        {children}
      </main>
    </div>
  );
}

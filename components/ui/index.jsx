'use client';
import { useEffect, useRef, useState } from 'react';

export function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-4' }[size];
  return <div className={`${s} border-amber-400 border-t-transparent rounded-full animate-spin`} />;
}

export function Badge({ children, color = 'amber' }) {
  const c = {
    amber: 'bg-amber-400/20 text-amber-400 border border-amber-400/30',
    green: 'bg-green-500/20 text-green-400 border border-green-400/30',
    blue:  'bg-blue-500/20 text-blue-400 border border-blue-400/30',
    zinc:  'bg-zinc-700/50 text-zinc-300 border border-zinc-600/30',
    red:   'bg-red-500/20 text-red-400 border border-red-400/30',
  };
  return <span className={`px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-sm ${c[color] || c.amber}`}>{children}</span>;
}

export function Divider() {
  return <div className="w-12 h-px bg-amber-400 my-6" />;
}

export function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

export function InputField({ label, error, textarea, rows = 4, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs tracking-widest uppercase text-zinc-500 mb-2">{label}</label>}
      {textarea
        ? <textarea rows={rows} className={`input-field resize-none ${error ? 'border-red-400' : ''}`} {...props} />
        : <input className={`input-field ${error ? 'border-red-400' : ''}`} {...props} />
      }
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function SelectField({ label, options = [], error, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs tracking-widest uppercase text-zinc-500 mb-2">{label}</label>}
      <select
        className={`w-full px-5 py-4 border cursor-pointer text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-400 transition-colors ${error ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}`}
        {...props}
      >
        {options.map(o => {
          const val = typeof o === 'string' ? o : o.value;
          const lbl = typeof o === 'string' ? o : o.label;
          return <option key={val} value={val} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">{lbl}</option>;
        })}
      </select>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function EmptyState({ icon = '📷', message = 'No items found' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="text-sm tracking-widest uppercase">{message}</p>
    </div>
  );
}

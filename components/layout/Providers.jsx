'use client';
import { ThemeProvider } from '../../context/ThemeContext';
import { AuthProvider } from '../../context/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46' },
            success: { iconTheme: { primary: '#fbbf24', secondary: '#18181b' } },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import LoginPage from '@/components/auth/LoginPage';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    
    // If already authenticated, redirect to dashboard
    if (isAuthenticated && typeof window !== 'undefined') {
      window.location.href = '/dashboard/';
    }
  }, [isAuthenticated]);

  // Show loading while checking auth
  if (!mounted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #e5e7eb',
            borderTopColor: '#16a34a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // If authenticated and mounted, show redirect message
  if (isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <p style={{ color: '#6b7280' }}>Redirecting to dashboard...</p>
      </div>
    );
  }

  return <LoginPage />;
}

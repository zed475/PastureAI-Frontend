'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useDashboardStore } from '@/lib/store';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import OverviewPanel from '@/components/dashboard/panels/OverviewPanel';
import NDVIPanel from '@/components/dashboard/panels/NDVIPanel';
import LivestockHealthPanel from '@/components/dashboard/panels/LivestockHealthPanel';
import AlertsPanel from '@/components/dashboard/panels/AlertsPanel';
import ReportsPanel from '@/components/dashboard/panels/ReportsPanel';
import CommunityPanel from '@/components/dashboard/panels/CommunityPanel';
import ResourcesPanel from '@/components/dashboard/panels/ResourcesPanel';
import SettingsPanel from '@/components/dashboard/panels/SettingsPanel';

function LoadingFallback() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '400px',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTopColor: '#16a34a',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p style={{ color: '#6b7280' }}>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

// Error boundary component for individual panels
function PanelErrorBoundary({ children, panelName }: { children: React.ReactNode; panelName: string }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      event.preventDefault();
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div style={{ 
        padding: '32px', 
        textAlign: 'center',
        backgroundColor: '#fef2f2',
        borderRadius: '8px',
        margin: '16px 0'
      }}>
        <p style={{ color: '#dc2626', marginBottom: '12px' }}>Unable to load {panelName}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [panelErrors, setPanelErrors] = useState<Record<string, boolean>>({});
  const { user, isAuthenticated } = useAuthStore();
  const { activeTab } = useDashboardStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading while mounting (SSR safe)
  if (!mounted) {
    return <LoadingFallback />;
  }

  // Not authenticated - redirect message
  if (!isAuthenticated || !user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '16px' }}>
            Please log in to access the dashboard.
          </p>
          <a 
            href="/login/" 
            style={{
              display: 'inline-block',
              backgroundColor: '#16a34a',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Render active panel with error boundary
  const renderPanel = () => {
    switch (activeTab) {
      case 'overview': 
        return (
          <PanelErrorBoundary panelName="Overview">
            <OverviewPanel />
          </PanelErrorBoundary>
        );
      case 'ndvi-monitor': 
        return (
          <PanelErrorBoundary panelName="NDVI Monitor">
            <NDVIPanel />
          </PanelErrorBoundary>
        );
      case 'livestock-health': 
        return (
          <PanelErrorBoundary panelName="Livestock Health">
            <LivestockHealthPanel />
          </PanelErrorBoundary>
        );
      case 'alerts': 
        return (
          <PanelErrorBoundary panelName="Alerts">
            <AlertsPanel />
          </PanelErrorBoundary>
        );
      case 'reports': 
        return (
          <PanelErrorBoundary panelName="Reports">
            <ReportsPanel />
          </PanelErrorBoundary>
        );
      case 'community': 
        return (
          <PanelErrorBoundary panelName="Community">
            <CommunityPanel />
          </PanelErrorBoundary>
        );
      case 'resources': 
        return (
          <PanelErrorBoundary panelName="Resources">
            <ResourcesPanel />
          </PanelErrorBoundary>
        );
      case 'settings': 
        return (
          <PanelErrorBoundary panelName="Settings">
            <SettingsPanel />
          </PanelErrorBoundary>
        );
      default: 
        return (
          <PanelErrorBoundary panelName="Overview">
            <OverviewPanel />
          </PanelErrorBoundary>
        );
    }
  };

  return (
    <DashboardLayout>
      {renderPanel()}
    </DashboardLayout>
  );
}

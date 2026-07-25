'use client';

import { useAuthStore } from '@/lib/store';
import { useDashboardStore } from '@/lib/store';
import DashboardLayout from './DashboardLayout';
import OverviewPanel from './panels/OverviewPanel';
import NDVIPanel from './panels/NDVIPanel';
import LivestockHealthPanel from './panels/LivestockHealthPanel';
import AlertsPanel from './panels/AlertsPanel';
import ReportsPanel from './panels/ReportsPanel';
import CommunityPanel from './panels/CommunityPanel';
import ResourcesPanel from './panels/ResourcesPanel';
import SettingsPanel from './panels/SettingsPanel';

export default function UserDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const { activeTab } = useDashboardStore();

  const renderPanel = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPanel />;
      case 'ndvi-monitor':
        return <NDVIPanel />;
      case 'livestock-health':
        return <LivestockHealthPanel />;
      case 'alerts':
        return <AlertsPanel />;
      case 'reports':
        return <ReportsPanel />;
      case 'community':
        return <CommunityPanel />;
      case 'resources':
        return <ResourcesPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <OverviewPanel />;
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Please log in to access the dashboard.</p>
          <a href="/login" className="mt-4 inline-block text-green-600 hover:text-green-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {renderPanel()}
    </DashboardLayout>
  );
}

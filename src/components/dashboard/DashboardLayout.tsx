'use client';

import { ReactNode } from 'react';
import { useAuthStore } from '@/lib/store';
import { useDashboardStore } from '@/lib/store';
import {
  LayoutDashboard,
  Map,
  BarChart3,
  AlertTriangle,
  Newspaper,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
  ChevronRight
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['USER', 'NGO', 'GOVERNMENT', 'ADMIN'] },
  { id: 'ndvi-monitor', label: 'NDVI Monitor', icon: Map, roles: ['USER', 'NGO', 'GOVERNMENT', 'ADMIN'] },
  { id: 'livestock-health', label: 'Livestock Health', icon: BarChart3, roles: ['USER', 'NGO', 'GOVERNMENT', 'ADMIN'] },
  { id: 'alerts', label: 'Alerts & Warnings', icon: AlertTriangle, roles: ['USER', 'NGO', 'GOVERNMENT', 'ADMIN'] },
  { id: 'reports', label: 'Reports', icon: Newspaper, roles: ['NGO', 'GOVERNMENT', 'ADMIN'] },
  { id: 'community', label: 'Community', icon: Users, roles: ['USER', 'NGO', 'GOVERNMENT', 'ADMIN'] },
  { id: 'resources', label: 'Resources', icon: Settings, roles: ['USER', 'NGO', 'GOVERNMENT', 'ADMIN'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['USER', 'NGO', 'GOVERNMENT', 'ADMIN'] }
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore();
  const { activeTab, setActiveTab, sidebarOpen, toggleSidebar, setSidebarOpen } = useDashboardStore();

  const filteredItems = sidebarItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-gray-900 to-gray-800 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-green-400" />
            <span className="text-xl font-bold text-white">PastureAI</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-green-600/20 text-green-400'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-green-400' : ''}`} />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-600/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Last Updated */}
            <span className="hidden sm:block text-xs text-gray-500">
              Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

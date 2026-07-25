'use client';

import { useAuthStore } from '@/lib/store';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Droplets,
  Thermometer,
  MapPin,
  Users,
  Beef,
  Activity,
  ArrowRight
} from 'lucide-react';
import NDVIChart from '../charts/NDVIChart';
import AlertSummary from '../charts/AlertSummary';
import RegionStatus from '../charts/RegionStatus';

const statsCards = [
  {
    title: 'NDVI Index',
    value: '0.42',
    change: '-0.03',
    trend: 'down' as const,
    icon: Activity,
    color: 'bg-green-500',
    description: 'Vegetation health'
  },
  {
    title: 'Active Alerts',
    value: '12',
    change: '+3',
    trend: 'up' as const,
    icon: AlertTriangle,
    color: 'bg-red-500',
    description: 'Requires attention'
  },
  {
    title: 'Rainfall (7d)',
    value: '8.2mm',
    change: '-45%',
    trend: 'down' as const,
    icon: Droplets,
    color: 'bg-blue-500',
    description: 'Below average'
  },
  {
    title: 'Temperature',
    value: '32°C',
    change: '+2°',
    trend: 'up' as const,
    icon: Thermometer,
    color: 'bg-orange-500',
    description: 'Above normal'
  }
];

export default function OverviewPanel() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome back, {user?.name || 'User'}!</h2>
            <p className="text-green-100">
              Here's what's happening with Ethiopia's livestock and pasture conditions today.
              {user?.region && ` Monitoring: ${user.region}`}
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium whitespace-nowrap">
            View Full Report <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NDVI Trend Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">NDVI Vegetation Index</h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 outline-none">
              <option>All Regions</option>
              <option>Somali</option>
              <option>Oromia</option>
              <option>Afar</option>
            </select>
          </div>
          <NDVIChart />
        </div>

        {/* Alerts Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Active Alerts by Type</h3>
            <a href="#" className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <AlertSummary />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Status */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Regional Status Overview</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              Ethiopian Pastoral Areas
            </div>
          </div>
          <RegionStatus />
        </div>

        {/* Quick Actions / Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Livestock Population</h3>
          <div className="space-y-4">
            {[
              { type: 'Cattle', count: '65M', icon: Beef, color: 'text-amber-600', bg: 'bg-amber-50' },
              { type: 'Camel', count: '7.2M', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
              { type: 'Goat', count: '42M', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
              { type: 'Sheep', count: '38M', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.type} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.bg}`}>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.type}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{item.count}</span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Data source: Central Statistical Agency of Ethiopia (CSA), 2024 estimates
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Recent System Activity</h3>
        <div className="space-y-3">
          {[
            { time: '2 hours ago', event: 'Drought alert issued for Shabelle Zone (Somali)', type: 'alert' },
            { time: '5 hours ago', event: 'NDVI data updated for Oromia region', type: 'data' },
            { time: '8 hours ago', event: 'New livestock report submitted from Afar Zone 3', type: 'report' },
            { time: '12 hours ago', event: 'Water point status updated in Jijiga zone', type: 'resource' },
            { time: '1 day ago', event: 'Monthly situation analysis report generated', type: 'report' }
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-3 py-2">
              <span className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === 'alert' ? 'bg-red-500' :
                activity.type === 'data' ? 'bg-blue-500' :
                activity.type === 'resource' ? 'bg-green-500' : 'bg-purple-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">{activity.event}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

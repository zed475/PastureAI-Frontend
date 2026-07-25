'use client';

import { MapPin, Calendar, Download, Filter, Layers, Info, Satellite, BarChart3 } from 'lucide-react';
import NDVIChart from '../charts/NDVIChart';
import NDVIMap from '../maps/NDVIMap';

const ndviStats = [
  { region: 'Somali Region', current: 0.38, previous: 0.42, status: 'Warning', color: 'text-orange-600 bg-orange-50' },
  { region: 'Oromia (Pastoral)', current: 0.48, previous: 0.45, status: 'Good', color: 'text-green-600 bg-green-50' },
  { region: 'Afar Region', current: 0.32, previous: 0.35, status: 'Critical', color: 'text-red-600 bg-red-50' }
];

export default function NDVIPanel() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-5 text-white shadow-lg">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Satellite className="w-7 h-7" />
          NDVI Vegetation Monitor
        </h2>
        <p className="text-green-100 mt-1 text-sm">
          🛰️ Satellite-based pasture health monitoring for Ethiopian pastoral regions
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Filters:</span>
          </div>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none">
            <option>All Regions</option>
            <option>Somali Region</option>
            <option>Oromia Pastoral Areas</option>
            <option>Afar Region</option>
          </select>
          <input type="date" defaultValue={new Date().toISOString().split('T')[0]} 
                 className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Last 6 Months</option>
            <option>1 Year</option>
          </select>
        </div>
      </div>

      {/* MAP SECTION - ALWAYS VISIBLE! */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Satellite className="w-5 h-5" />
            🗺️ Interactive Satellite Map - Ethiopia Pastoral Regions
          </h3>
          <span className="text-blue-100 text-sm">12 Monitoring Stations Active</span>
        </div>
        
        {/* THE MAP! */}
        <NDVIMap />
      </div>

      {/* CHART SECTION */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            NDVI Vegetation Trends Chart
          </h3>
        </div>
        <div className="p-6">
          <NDVIChart height={350} />
        </div>
      </div>

      {/* Regional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ndviStats.map((stat) => (
          <div key={stat.region} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-800">{stat.region}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${stat.color}`}>
                {stat.status}
              </span>
            </div>
            <div className="flex items-end gap-4 mt-4">
              <div>
                <p className="text-3xl font-bold text-gray-800">{stat.current.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Current NDVI</p>
              </div>
              <div className="pb-1">
                <span className={`text-sm ${stat.current > stat.previous ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.current > stat.previous ? '+' : ''}{(stat.current - stat.previous).toFixed(2)}
                </span>
                <p className="text-xs text-gray-500">vs last month</p>
              </div>
            </div>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  stat.current >= 0.45 ? 'bg-green-500' :
                  stat.current >= 0.35 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(stat.current * 150, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          Understanding NDVI Values
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-8 rounded-lg mb-2" style={{
              background: 'linear-gradient(to right, #b7b7b7, #d4d4aa, #a6cf6c, #3e8e36, #08450a)'
            }}></div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0.0 (Barren)</span>
              <span>0.25 (Sparse)</span>
              <span>0.5 (Moderate)</span>
              <span>0.75 (Dense)</span>
              <span>1.0 (Very Dense)</span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p><strong className="text-red-600">&lt; 0.25:</strong> Severe vegetation stress</p>
            <p><strong className="text-orange-600">0.25 - 0.35:</strong> Drought conditions</p>
            <p><strong className="text-yellow-600">0.35 - 0.45:</strong> Below normal</p>
            <p><strong className="text-green-600">0.45 - 0.60:</strong> Normal conditions</p>
            <p><strong className="text-emerald-600">&gt; 0.60:</strong> Excellent forage</p>
          </div>
        </div>
      </div>
    </div>
  );
}

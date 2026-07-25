'use client';

import { useState } from 'react';
import { 
  Droplets, 
  MapPin, 
  Navigation,
  Warehouse,
  Stethoscope,
  ShoppingBag,
  Home,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';

interface Resource {
  id: number;
  name: string;
  type: string;
  region: string;
  zone: string;
  woreda: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'NON_FUNCTIONAL' | 'UNKNOWN';
  capacity?: string;
  lastUpdated: string;
  lat: number;
  lng: number;
}

const resources: Resource[] = [
  {
    id: 1,
    name: 'Shabelle Borehole #1',
    type: 'WATER_POINT',
    region: 'Somali Region',
    zone: 'Shabelle',
    woreda: 'Mustahil',
    status: 'DEGRADED',
    capacity: '50,000 L/day',
    lastUpdated: '2024-01-15',
    lat: 6.2333,
    lng: 44.0833
  },
  {
    id: 2,
    name: 'Jijiga Veterinary Clinic',
    type: 'VETERINARY_CLINIC',
    region: 'Somali Region',
    zone: 'Jijiga',
    woreda: 'Jijiga',
    status: 'OPERATIONAL',
    lastUpdated: '2024-01-14',
    lat: 9.4000,
    lng: 42.8333
  },
  {
    id: 3,
    name: 'Dollo Cattle Market',
    type: 'LIVESTOCK_MARKET',
    region: 'Somali Region',
    zone: 'Dollo',
    woreda: 'Warder',
    status: 'OPERATIONAL',
    lastUpdated: '2024-01-13',
    lat: 6.4167,
    lng: 43.9000
  },
  {
    id: 4,
    name: 'Afar Emergency Shelter - Zone 3',
    type: 'EMERGENCY_SHELTER',
    region: 'Afar Region',
    zone: 'Zone 3',
    woreda: 'Gewane',
    status: 'OPERATIONAL',
    capacity: '200 families',
    lastUpdated: '2024-01-12',
    lat: 11.3000,
    lng: 40.1000
  },
  {
    id: 5,
    name: 'Borena Grazing Reserve A',
    type: 'GRAZING_AREA',
    region: 'Oromia Region',
    zone: 'Borena',
    woreda: 'Yabelo',
    status: 'DEGRADED',
    capacity: '5,000 hectares',
    lastUpdated: '2024-01-10',
    lat: 4.6333,
    lng: 38.5000
  },
  {
    id: 6,
    name: 'Nogob Feed Storage Facility',
    type: 'FEED_STORAGE',
    region: 'Somali Region',
    zone: 'Nogob',
    woreda: 'Danot',
    status: 'OPERATIONAL',
    capacity: '100 tons',
    lastUpdated: '2024-01-09',
    lat: 7.3333,
    lng: 43.6667
  }
];

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  WATER_POINT: { icon: Droplets, color: 'bg-blue-100 text-blue-700', label: 'Water Point' },
  GRAZING_AREA: { icon: MapPin, color: 'bg-green-100 text-green-700', label: 'Grazing Area' },
  LIVESTOCK_MARKET: { icon: ShoppingBag, color: 'bg-purple-100 text-purple-700', label: 'Livestock Market' },
  VETERINARY_CLINIC: { icon: Stethoscope, color: 'bg-red-100 text-red-700', label: 'Veterinary Clinic' },
  FEED_STORAGE: { icon: Warehouse, color: 'bg-orange-100 text-orange-700', label: 'Feed Storage' },
  EMERGENCY_SHELTER: { icon: Home, color: 'bg-yellow-100 text-yellow-700', label: 'Emergency Shelter' }
};

const statusConfig: Record<string, { color: string; dot: string }> = {
  OPERATIONAL: { color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  DEGRADED: { color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  NON_FUNCTIONAL: { color: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
  UNKNOWN: { color: 'bg-gray-100 text-gray-800', dot: 'bg-gray-500' }
};

export default function ResourcesPanel() {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const filteredResources = resources.filter(resource => {
    if (filterType !== 'all' && resource.type !== filterType) return false;
    if (filterStatus !== 'all' && resource.status !== filterStatus) return false;
    if (searchQuery && !resource.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: resources.length,
    operational: resources.filter(r => r.status === 'OPERATIONAL').length,
    degraded: resources.filter(r => r.status === 'DEGRADED').length,
    nonFunctional: resources.filter(r => r.status === 'NON_FUNCTIONAL').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Navigation className="w-6 h-6 text-green-600" />
            Resources & Infrastructure
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Water points, grazing areas, markets, veterinary services, and emergency facilities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'list' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'map' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Map View
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Resources</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
          <p className="text-sm text-green-600">Operational</p>
          <p className="text-2xl font-bold text-green-600">{stats.operational}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-100">
          <p className="text-sm text-yellow-600">Degraded</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.degraded}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
          <p className="text-sm text-red-600">Non-functional</p>
          <p className="text-2xl font-bold text-red-600">{stats.nonFunctional}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="all">All Types</option>
            <option value="WATER_POINT">Water Points</option>
            <option value="GRAZING_AREA">Grazing Areas</option>
            <option value="LIVESTOCK_MARKET">Livestock Markets</option>
            <option value="VETERINARY_CLINIC">Veterinary Clinics</option>
            <option value="FEED_STORAGE">Feed Storage</option>
            <option value="EMERGENCY_SHELTER">Emergency Shelters</option>
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="OPERATIONAL">Operational</option>
            <option value="DEGRADED">Degraded</option>
            <option value="NON_FUNCTIONAL">Non-Functional</option>
          </select>
        </div>
      </div>

      {/* Resources List */}
      <div className="space-y-3">
        {filteredResources.map((resource) => {
          const typeInfo = typeConfig[resource.type];
          const statusInfo = statusConfig[resource.status];
          const TypeIcon = typeInfo?.icon || MapPin;

          return (
            <div key={resource.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-xl ${typeInfo?.color || 'bg-gray-100'}`}>
                  <TypeIcon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800">{resource.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo?.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusInfo?.dot}`} />
                      {resource.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600 mt-2">
                    <p><strong>Type:</strong> {typeInfo?.label || resource.type}</p>
                    <p><strong>Location:</strong> {resource.woreda}, {resource.zone}</p>
                    <p><strong>Region:</strong> {resource.region}</p>
                    {resource.capacity && <p><strong>Capacity:</strong> {resource.capacity}</p>}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Last updated: {new Date(resource.lastUpdated).toLocaleDateString()}
                    </span>
                    <button className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700">
                      <ExternalLink className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredResources.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Navigation className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No resources match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

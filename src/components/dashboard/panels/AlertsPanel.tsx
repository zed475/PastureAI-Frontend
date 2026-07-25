'use client';

import { useState } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  XCircle, 
  CloudRain, 
  Thermometer,
  Bug,
  MapPin,
  Clock,
  Filter,
  Bell,
  CheckCircle
} from 'lucide-react';

interface Alert {
  id: number;
  title: string;
  description: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  region: string;
  zone?: string;
  time: string;
  isActive: boolean;
}

const alerts: Alert[] = [
  {
    id: 1,
    title: 'Severe Drought Warning',
    description: 'NDVI values below critical threshold (0.25) in Shabelle Zone. Immediate intervention required for livestock feed and water.',
    type: 'DROUGHT',
    severity: 'CRITICAL',
    region: 'Somali Region',
    zone: 'Shabelle',
    time: '2 hours ago',
    isActive: true
  },
  {
    id: 2,
    title: 'Water Point Depletion Alert',
    description: '3 of 5 monitored water points in Afar Zone 3 have reached critically low levels. Emergency water trucking recommended.',
    type: 'RESOURCE_CONFLICT',
    severity: 'HIGH',
    region: 'Afar Region',
    zone: 'Zone 3',
    time: '4 hours ago',
    isActive: true
  },
  {
    id: 3,
    title: 'PPR Disease Outbreak',
    description: 'Suspected Peste des Petits Ruminants cases reported in Jijiga woreda. Veterinary teams dispatched for confirmation.',
    type: 'DISEASE_OUTBREAK',
    severity: 'HIGH',
    region: 'Somali Region',
    zone: 'Jijiga',
    time: '6 hours ago',
    isActive: true
  },
  {
    id: 4,
    title: 'Extreme Heat Advisory',
    description: 'Temperatures exceeding 42°C expected in Danan district over next 5 days. Ensure adequate shade and water for livestock.',
    type: 'WEATHER_EXTREME',
    severity: 'MEDIUM',
    region: 'Somali Region',
    zone: 'Nogob',
    time: '8 hours ago',
    isActive: true
  },
  {
    id: 5,
    title: 'Locust Infestation Risk',
    description: 'Favorable conditions for desert locust breeding detected in East Hararghe. Monitoring intensified.',
    type: 'PEST_INFESTATION',
    severity: 'MEDIUM',
    region: 'Oromia Region',
    zone: 'East Hararghe',
    time: '12 hours ago',
    isActive: true
  },
  {
    id: 6,
    title: 'Market Price Volatility',
    description: 'Cattle prices dropped 15% in Warder market due to distress selling. Market stabilization measures under review.',
    type: 'MARKET_CRISIS',
    severity: 'MEDIUM',
    region: 'Somali Region',
    zone: 'Dollo',
    time: '1 day ago',
    isActive: false
  },
  {
    id: 7,
    title: 'Flood Risk Assessment',
    description: 'Heavy rainfall forecasted for lower Shabelle. Prepositioning of emergency supplies recommended.',
    type: 'FLOOD',
    severity: 'LOW',
    region: 'Somali Region',
    zone: 'Shabelle',
    time: '1 day ago',
    isActive: false
  },
  {
    id: 8,
    title: 'NDVI Anomaly Detected',
    description: 'Significant vegetation decline (-18%) observed in Borena zone compared to historical average.',
    type: 'NDVI_ANOMALY',
    severity: 'HIGH',
    region: 'Oromia Region',
    zone: 'Borena',
    time: '2 days ago',
    isActive: true
  }
];

const severityConfig = {
  LOW: { icon: Info, color: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500' },
  MEDIUM: { icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-800 border-yellow-200', dot: 'bg-yellow-500' },
  HIGH: { icon: AlertCircle, color: 'bg-orange-100 text-orange-800 border-orange-200', dot: 'bg-orange-500' },
  CRITICAL: { icon: XCircle, color: 'bg-red-100 text-red-800 border-red-200', dot: 'bg-red-500' }
};

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  DROUGHT: CloudRain,
  FLOOD: CloudRain,
  DISEASE_OUTBREAK: Bug,
  PEST_INFESTATION: Bug,
  RESOURCE_CONFLICT: MapPin,
  MARKET_CRISIS: Info,
  NDVI_ANOMALY: AlertTriangle,
  WEATHER_EXTREME: Thermometer
};

export default function AlertsPanel() {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterType !== 'all' && alert.type !== filterType) return false;
    if (showActiveOnly && !alert.isActive) return false;
    return true;
  });

  const alertCounts = {
    total: alerts.length,
    active: alerts.filter(a => a.isActive).length,
    critical: alerts.filter(a => a.severity === 'CRITICAL').length,
    high: alerts.filter(a => a.severity === 'HIGH').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Bell className="w-6 h-6 text-red-500" />
            Alerts & Early Warnings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Real-time alerts for drought, disease, weather, and other threats to pastoral livelihoods
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Alerts</p>
          <p className="text-2xl font-bold text-gray-800">{alertCounts.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
          <p className="text-sm text-red-600">Active</p>
          <p className="text-2xl font-bold text-red-600">{alertCounts.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
          <p className="text-sm text-orange-600">High Priority</p>
          <p className="text-2xl font-bold text-orange-600">{alertCounts.high}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
          <p className="text-sm text-red-700">Critical</p>
          <p className="text-2xl font-bold text-red-700">{alertCounts.critical}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <Filter className="w-4 h-4 text-gray-400" />
          
          <select 
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="all">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="all">All Types</option>
            <option value="DROUGHT">Drought</option>
            <option value="DISEASE_OUTBREAK">Disease</option>
            <option value="WEATHER_EXTREME">Weather</option>
            <option value="RESOURCE_CONFLICT">Resource</option>
            <option value="NDVI_ANOMALY">NDVI Anomaly</option>
          </select>

          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-600">Active only</span>
          </label>

          <span className="ml-auto text-sm text-gray-500">
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const SeverityIcon = config.icon;
          const TypeIcon = typeIcons[alert.type] || AlertTriangle;

          return (
            <div 
              key={alert.id}
              className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${
                alert.severity === 'CRITICAL' ? 'border-l-red-500' :
                alert.severity === 'HIGH' ? 'border-l-orange-500' :
                alert.severity === 'MEDIUM' ? 'border-l-yellow-500' : 'border-l-blue-500'
              } ${!alert.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Icon & Status */}
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-lg ${config.color.split(' ')[0]}`}>
                    <TypeIcon className={`w-5 h-5 ${config.color.split(' ')[1]?.replace('text-', '') || ''}`} />
                  </div>
                  {!alert.isActive && (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800">{alert.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {alert.region}{alert.zone ? ` / ${alert.zone}` : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {alert.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No alerts match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

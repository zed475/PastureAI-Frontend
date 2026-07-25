'use client';

import { MapPin, AlertTriangle, CheckCircle, MinusCircle } from 'lucide-react';

interface RegionData {
  name: string;
  ndvi: string;
  status: 'critical' | 'warning' | 'normal';
  alerts: number;
  livestockCondition: string;
}

const regionsData: RegionData[] = [
  {
    name: 'Somali Region',
    ndvi: '0.38',
    status: 'warning',
    alerts: 8,
    livestockCondition: 'Fair to Poor'
  },
  {
    name: 'Oromia Pastoral Areas',
    ndvi: '0.48',
    status: 'normal',
    alerts: 4,
    livestockCondition: 'Fair'
  },
  {
    name: 'Afar Region',
    ndvi: '0.32',
    status: 'critical',
    alerts: 6,
    livestockCondition: 'Poor'
  }
];

const statusConfig = {
  critical: { 
    icon: AlertTriangle, 
    color: 'text-red-600', 
    bg: 'bg-red-50', 
    border: 'border-l-red-500',
    dot: 'bg-red-500' 
  },
  warning: { 
    icon: MinusCircle, 
    color: 'text-yellow-600', 
    bg: 'bg-yellow-50', 
    border: 'border-l-yellow-500',
    dot: 'bg-yellow-500' 
  },
  normal: { 
    icon: CheckCircle, 
    color: 'text-green-600', 
    bg: 'bg-green-50', 
    border: 'border-l-green-500',
    dot: 'bg-green-500' 
  }
};

export default function RegionStatus() {
  return (
    <div className="space-y-3">
      {regionsData.map((region) => {
        const config = statusConfig[region.status];
        const Icon = config.icon;

        return (
          <div 
            key={region.name}
            className={`flex items-center gap-4 p-4 rounded-lg border-l-4 ${config.bg} ${config.border}`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
              <MapPin className={`w-5 h-5 ${config.color}`} />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800">{region.name}</h4>
              <p className="text-sm text-gray-600">Livestock: {region.livestockCondition}</p>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="text-right">
                <p className="font-medium text-gray-800">NDVI</p>
                <p className={config.color}>{region.ndvi}</p>
              </div>
              
              <div className="text-right">
                <p className="font-medium text-gray-800">Alerts</p>
                <p className={`${region.alerts > 5 ? 'text-red-600' : 'text-gray-600'}`}>
                  {region.alerts} active
                </p>
              </div>

              <div className={`p-2 rounded-full ${config.bg}`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 mt-4 border-t border-gray-200 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Normal
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Warning
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical
        </span>
      </div>
    </div>
  );
}

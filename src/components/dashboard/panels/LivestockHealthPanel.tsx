'use client';

import { useState } from 'react';
import { Heart, TrendingUp, TrendingDown, AlertCircle, Activity, Scale, Bone, Droplets } from 'lucide-react';
import LivestockChart from '../charts/LivestockChart';
import BodyConditionChart from '../charts/BodyConditionChart';

export default function LivestockHealthPanel() {
  const [selectedType, setSelectedType] = useState('all');

  const healthMetrics = [
    { 
      title: 'Overall Health Index', 
      value: '72%', 
      change: '-5%', 
      trend: 'down' as const,
      icon: Heart,
      color: 'bg-red-500',
      description: 'Below optimal level'
    },
    { 
      title: 'Avg Body Condition', 
      value: '2.8/5', 
      change: '-0.3', 
      trend: 'down' as const,
      icon: Scale,
      color: 'bg-orange-500',
      description: 'Slight decline'
    },
    { 
      title: 'Disease Incidents', 
      value: '234', 
      change: '+18%', 
      trend: 'up' as const,
      icon: AlertCircle,
      color: 'bg-yellow-500',
      description: 'Above normal range'
    },
    { 
      title: 'Water Access Score', 
      value: '58%', 
      change: '+2%', 
      trend: 'up' as const,
      icon: Droplets,
      color: 'bg-blue-500',
      description: 'Improving slowly'
    }
  ];

  const livestockTypes = [
    { type: 'Cattle', population: '65M', condition: 'Fair', score: 2.9, color: 'bg-amber-100 text-amber-800' },
    { type: 'Camel', population: '7.2M', condition: 'Good', score: 3.4, color: 'bg-green-100 text-green-800' },
    { type: 'Goat', population: '42M', condition: 'Fair', score: 2.7, color: 'bg-yellow-100 text-yellow-800' },
    { type: 'Sheep', population: '38M', condition: 'Poor', score: 2.4, color: 'bg-red-100 text-red-800' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Activity className="w-6 h-6 text-green-600" />
          Livestock Health Monitor
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Track livestock conditions, body scores, and health indicators across pastoral regions
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${metric.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`flex items-center text-sm font-medium ${
                  metric.trend === 'up' ? (metric.title === 'Water Access Score' ? 'text-green-600' : 'text-red-600') : 'text-red-600'
                }`}>
                  {metric.trend === 'up' && metric.title !== 'Water Access Score' ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  )}
                  {metric.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{metric.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{metric.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{metric.description}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Population Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Livestock Population Trends</h3>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="all">All Types</option>
              <option value="cattle">Cattle</option>
              <option value="camel">Camel</option>
              <option value="goat">Goat</option>
              <option value="sheep">Sheep</option>
            </select>
          </div>
          <LivestockChart />
        </div>

        {/* Body Condition Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Body Condition Score Distribution</h3>
          <BodyConditionChart />
        </div>
      </div>

      {/* Livestock Type Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Bone className="w-5 h-5 text-gray-400" />
            Condition by Livestock Type
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Population</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BCS Avg</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {livestockTypes.map((item) => (
                <tr key={item.type} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-800">{item.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.population}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.color}`}>
                      {item.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.score}/5</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`flex items-center gap-1 text-sm ${
                      item.score >= 3 ? 'text-green-600' : item.score >= 2.5 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {item.score >= 3 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {item.score >= 3 ? 'Stable' : 'Declining'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regional Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Regional Health Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { region: 'Somali Region', cattle: 2.7, camel: 3.5, goat: 2.5, sheep: 2.2, overall: 'Poor' },
            { region: 'Oromia Pastoral', cattle: 3.2, camel: 3.3, goat: 3.0, sheep: 2.8, overall: 'Fair' },
            { region: 'Afar Region', cattle: 2.5, camel: 3.4, goat: 2.6, sheep: 2.3, overall: 'Poor' }
          ].map((region) => (
            <div key={region.region} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-3">{region.region}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cattle BCS</span>
                  <span className="font-medium">{region.cattle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Camel BCS</span>
                  <span className="font-medium">{region.camel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Goat BCS</span>
                  <span className="font-medium">{region.goat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sheep BCS</span>
                  <span className="font-medium">{region.sheep}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    region.overall === 'Good' ? 'bg-green-100 text-green-800' :
                    region.overall === 'Fair' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    Overall: {region.overall}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

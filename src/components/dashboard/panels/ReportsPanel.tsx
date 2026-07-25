'use client';

import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  Filter,
  Plus,
  Search,
  FileBarChart,
  FileWarning,
  ClipboardList
} from 'lucide-react';

interface Report {
  id: number;
  title: string;
  type: string;
  region: string;
  period: string;
  date: string;
  author: string;
  size: string;
}

const reports: Report[] = [
  {
    id: 1,
    title: 'Monthly Situation Analysis - Somali Region',
    type: 'SITUATION_ANALYSIS',
    region: 'Somali Region',
    period: 'Monthly',
    date: '2024-01-15',
    author: 'Early Warning Unit',
    size: '2.4 MB'
  },
  {
    id: 2,
    title: 'Drought Early Warning Bulletin - Q4 2023',
    type: 'EARLY_WARNING',
    region: 'All Regions',
    period: 'Quarterly',
    date: '2024-01-10',
    author: 'NDRMC',
    size: '5.8 MB'
  },
  {
    id: 3,
    title: 'Livestock Impact Assessment - Afar Floods',
    type: 'IMPACT_ASSESSMENT',
    region: 'Afar Region',
    period: 'Special',
    date: '2024-01-08',
    author: 'Livestock Agency',
    size: '3.2 MB'
  },
  {
    id: 4,
    title: 'Response Plan - Shabelle Zone Intervention',
    type: 'RESPONSE_PLAN',
    region: 'Somali Region',
    period: 'Monthly',
    date: '2024-01-05',
    author: 'Humanitarian Cluster',
    size: '1.9 MB'
  },
  {
    id: 5,
    title: 'NDVI Trend Analysis - Annual Report 2023',
    type: 'TREND_ANALYSIS',
    region: 'All Regions',
    period: 'Annual',
    date: '2023-12-31',
    author: 'Remote Sensing Unit',
    size: '12.4 MB'
  },
  {
    id: 6,
    title: 'Weekly Flash Update - Week 02',
    type: 'SITUATION_ANALYSIS',
    region: 'Oromia Pastoral',
    period: 'Weekly',
    date: '2024-01-12',
    author: 'Field Operations',
    size: '0.8 MB'
  }
];

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  SITUATION_ANALYSIS: { icon: FileBarChart, color: 'bg-blue-100 text-blue-700', label: 'Situation Analysis' },
  EARLY_WARNING: { icon: FileWarning, color: 'bg-red-100 text-red-700', label: 'Early Warning' },
  IMPACT_ASSESSMENT: { icon: FileText, color: 'bg-orange-100 text-orange-700', label: 'Impact Assessment' },
  RESPONSE_PLAN: { icon: ClipboardList, color: 'bg-green-100 text-green-700', label: 'Response Plan' },
  TREND_ANALYSIS: { icon: FileBarChart, color: 'bg-purple-100 text-purple-700', label: 'Trend Analysis' }
};

export default function ReportsPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');

  const filteredReports = reports.filter(report => {
    if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterType !== 'all' && report.type !== filterType) return false;
    if (filterRegion !== 'all' && report.region !== filterRegion) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-green-600" />
            Reports & Documents
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Access situation analyses, early warnings, impact assessments, and response plans
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Filters */}
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="all">All Types</option>
            <option value="SITUATION_ANALYSIS">Situation Analysis</option>
            <option value="EARLY_WARNING">Early Warning</option>
            <option value="IMPACT_ASSESSMENT">Impact Assessment</option>
            <option value="RESPONSE_PLAN">Response Plan</option>
            <option value="TREND_ANALYSIS">Trend Analysis</option>
          </select>

          <select 
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="all">All Regions</option>
            <option value="Somali Region">Somali Region</option>
            <option value="Oromia Region">Oromia Region</option>
            <option value="Afar Region">Afar Region</option>
            <option value="All Regions">All Regions</option>
          </select>
        </div>
      </div>

      {/* Reports Grid/List */}
      <div className="grid gap-4">
        {filteredReports.map((report) => {
          const config = typeConfig[report.type];
          const Icon = config?.icon || FileText;

          return (
            <div key={report.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-xl ${config?.color || 'bg-gray-100'}`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 mb-1">{report.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className={`px-2 py-0.5 rounded-full ${config?.color || 'bg-gray-100'}`}>
                      {config?.label || report.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.date).toLocaleDateString()}
                    </span>
                    <span>{report.region}</span>
                    <span>{report.period}</span>
                    <span>{report.size}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Download">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredReports.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No reports match your search criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-100">
        <p className="text-sm text-gray-500">
          Showing {filteredReports.length} of {reports.length} reports
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg">
            1
          </button>
          <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

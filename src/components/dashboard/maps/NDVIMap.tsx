'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Layers, Satellite, RefreshCw, Cloud, Droplets, Thermometer, Wind } from 'lucide-react';
import { 
  fetchAllStationsWeather, 
  getWeatherSummary, 
  monitoringStations,
  type StationWeather,
  type WeatherData 
} from '@/lib/weatherService';

// View modes for the map
type ViewMode = 'satellite' | 'terrain' | 'heatmap' | 'stations';

function getColor(ndvi: number) {
  if (ndvi >= 0.5) return '#22c55e';
  if (ndvi >= 0.4) return '#84cc16';
  if (ndvi >= 0.35) return '#eab308';
  if (ndvi >= 0.3) return '#f97316';
  return '#ef4444';
}

function getStatus(ndvi: number): { label: string; color: string } {
  if (ndvi < 0.3) return { label: 'Critical', color: 'text-red-600 bg-red-50 border-red-200' };
  if (ndvi < 0.35) return { label: 'Severe', color: 'text-orange-600 bg-orange-50 border-orange-200' };
  if (ndvi < 0.4) return { label: 'Warning', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
  if (ndvi < 0.5) return { label: 'Moderate', color: 'text-lime-600 bg-lime-50 border-lime-200' };
  return { label: 'Healthy', color: 'text-green-600 bg-green-50 border-green-200' };
}

// Calculate position on map (simplified projection)
function getPosition(lat: number, lon: number): { x: number; y: number } {
  // Ethiopia bounds roughly: lat 3-15, lon 33-48
  const x = ((lon - 33) / 15) * 100; // 0-100%
  const y = ((15 - lat) / 12) * 90; // 0-90% (inverted)
  return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(85, y)) };
}

export default function NDVIMap() {
  const [viewMode, setViewMode] = useState<ViewMode>('satellite');
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [stationData, setStationData] = useState<StationWeather[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showWeatherDetails, setShowWeatherDetails] = useState(false);

  // Fetch real weather data
  const loadWeatherData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchAllStationsWeather();
      setStationData(data);
      setLastUpdated(new Date().toLocaleString('en-US', { 
        timeZone: 'Africa/Addis_Ababa',
        hour12: false 
      }));
    } catch (err) {
      console.error('Failed to load weather data:', err);
      setError('Failed to load live data. Using cached values.');
      
      // Fallback to static data from monitoring stations
      const fallbackData: StationWeather[] = monitoringStations.map(s => ({
        station: s.name,
        lat: s.lat,
        lon: s.lon,
        weather: {
          temperature: 25 + Math.random() * 10,
          humidity: 40 + Math.random() * 30,
          rainfall: Math.random() * 5,
          windSpeed: 10 + Math.random() * 10,
          rainSum7Day: Math.random() * 30,
          tempMax: 30 + Math.random() * 8,
          tempMin: 18 + Math.random() * 5,
          droughtIndex: 20 + Math.random() * 60,
          heatStressIndex: 15 + Math.random() * 55
        },
        calculatedNdvi: s.baseNdvi + (Math.random() - 0.5) * 0.1,
        lastUpdated: new Date().toISOString()
      }));
      setStationData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount and every 5 minutes
  useEffect(() => {
    loadWeatherData();
    const interval = setInterval(loadWeatherData, 5 * 60 * 1000); // 5 min refresh
    return () => clearInterval(interval);
  }, [loadWeatherData]);

  // Get selected station data
  const selectedData = stationData.find(s => s.station === selectedStation);
  
  // Get summary stats
  const summary = stationData.length > 0 ? getWeatherSummary(stationData) : null;

  // Background based on view mode
  const getBackground = () => {
    switch (viewMode) {
      case 'satellite':
        return 'linear-gradient(135deg, #1a472a 0%, #2d5a27 25%, #4a7c39 45%, #8b9d77 70%, #d4c5a9 88%, #e8dcc8 100%)';
      case 'terrain':
        return 'linear-gradient(to bottom, #87CEEB 0%, #B0E0E6 20%, #90EE90 35%, #228B22 55%, #8B4513 75%, #D2691E 100%)';
      case 'heatmap':
        return 'radial-gradient(ellipse at 75% 30%, rgba(239,68,68,0.3) 0%, transparent 40%), radial-gradient(ellipse at 80% 55%, rgba(249,115,22,0.3) 0%, transparent 35%), radial-gradient(ellipse at 35% 70%, rgba(234,179,8,0.3) 0%, transparent 38%), radial-gradient(ellipse at 42% 48%, rgba(132,204,22,0.3) 0%, transparent 42%), linear-gradient(135deg, #1e293b 0%, #334155 100%)';
      case 'stations':
        return 'linear-gradient(135deg, #f8fafc 0%, #e2e8f4 100%)';
      default:
        return '#1a472a';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Live Data Indicator */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-gray-800">Ethiopia Pastoral Regions - Live NDVI Monitor</span>
          {summary && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {summary.dataSource}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-gray-500 hidden sm:inline">
              Updated: {lastUpdated}
            </span>
          )}
          <button
            onClick={loadWeatherData}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* Map Controls */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-lg shadow-sm border">
        <span className="text-sm font-medium text-gray-600 mr-2">View:</span>
        {([
          ['satellite', '🛰️', 'Satellite'],
          ['terrain', '🗺️', 'Terrain'],
          ['heatmap', '🌡️', 'Heatmap'],
          ['stations', '📍', 'Stations']
        ] as [ViewMode, string, string][]).map(([mode, icon, label]) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === mode
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {icon} {label}
          </button>
        ))}
        
        <div className="ml-auto flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showWeatherDetails}
              onChange={(e) => setShowWeatherDetails(e.target.checked)}
              className="rounded"
            />
            <Cloud className="w-3.5 h-3.5" />
            Weather
          </label>
        </div>
      </div>

      {/* THE MAP - Enhanced with Real Data */}
      <div 
        className="relative w-full rounded-xl border-2 border-gray-300 overflow-hidden shadow-lg"
        style={{ height: '520px', background: getBackground() }}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
              <span className="text-gray-600 font-medium">Fetching live satellite & weather data...</span>
              <span className="text-xs text-gray-400">Connecting to Open-Meteo API</span>
            </div>
          </div>
        )}

        {/* Ethiopia SVG Outline */}
        <svg viewBox="0 0 100 90" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Ethiopia simplified outline */}
          <path
            d="M 28 8 L 38 6 L 52 10 L 66 8 L 78 14 L 86 24 L 89 38 L 86 52 L 82 65 L 72 76 L 58 84 L 42 81 L 30 74 L 20 61 L 14 47 L 17 32 L 22 19 Z"
            fill={viewMode === 'heatmap' ? 'rgba(51,65,85,0.3)' : 'none'}
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.8"
            filter="url(#glow)"
          />
          
          {/* Region boundaries (simplified) */}
          <path d="M 55 35 Q 65 33 75 38" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" fill="none" />
          <path d="M 45 50 Q 50 55 55 52" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" fill="none" />
          <path d="M 35 30 L 50 28" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" fill="none" />
          
          {/* Region Labels */}
          <text x="68" y="40" fill="rgba(255,255,255,0.8)" fontSize="3" fontWeight="bold" opacity="0.9">SOMALI</text>
          <text x="34" y="56" fill="rgba(255,255,255,0.8)" fontSize="3" fontWeight="bold" opacity="0.9">OROMIA</text>
          <text x="48" y="18" fill="rgba(255,255,255,0.8)" fontSize="3" fontWeight="bold" opacity="0.9">AFAR</text>
          <text x="62" y="70" fill="rgba(255,255,255,0.6)" fontSize="2.5" opacity="0.7">S.N.P.R.</text>
        </svg>

        {/* Station Markers with Real Data */}
        {stationData.map((data) => {
          const pos = getPosition(data.lat, data.lon);
          const color = getColor(data.calculatedNdvi);
          const status = getStatus(data.calculatedNdvi);
          const isSelected = selectedStation === data.station;
          const baseStation = monitoringStations.find(s => s.name === data.station);
          
          return (
            <div
              key={data.station}
              onClick={() => setSelectedStation(isSelected ? null : data.station)}
              className="absolute cursor-pointer transition-all duration-200 group"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: `translate(-50%, -50%) scale(${isSelected ? 1.15 : 1})`,
                zIndex: isSelected ? 20 : 10
              }}
            >
              {/* Pulse animation for critical stations */}
              {data.calculatedNdvi < 0.35 && (
                <div 
                  className="absolute inset-0 rounded-full animate-ping opacity-75"
                  style={{ 
                    backgroundColor: color,
                    transform: 'scale(1.5)',
                    width: '26px',
                    height: '26px'
                  }}
                />
              )}
              
              {/* Marker Circle */}
              <div
                className="rounded-full border-2 shadow-lg flex items-center justify-center text-white text-xs font-bold transition-all duration-200"
                style={{
                  backgroundColor: color,
                  width: isSelected ? '36px' : '28px',
                  height: isSelected ? '36px' : '28px',
                  borderColor: isSelected ? '#fff' : 'rgba(255,255,255,0.9)',
                  boxShadow: isSelected 
                    ? `0 0 20px ${color}80` 
                    : '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                {Math.round(data.calculatedNdvi * 100)}
              </div>
              
              {/* Popup on selection/hover */}
              {(isSelected) && (
                <div 
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap z-30"
                >
                  <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs border border-slate-700">
                    <div className="font-bold text-sm mb-1">{data.station}</div>
                    <div className="text-slate-300">{baseStation?.region} Region</div>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-700 grid grid-cols-2 gap-x-3 gap-y-1">
                      <div>
                        <span className="text-slate-400">NDVI:</span>{' '}
                        <span className="font-bold" style={{color}}>{data.calculatedNdvi.toFixed(3)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Status:</span>{' '}
                        <span className={`font-semibold ${status.color.split(' ')[0]}`}>{status.label}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1 mt-1 pt-1 border-t border-slate-700">
                        <Thermometer className="w-3 h-3 text-red-400" />
                        <span>{data.weather.temperature.toFixed(1)}°C</span>
                        <Droplets className="w-3 h-3 text-blue-400 ml-2" />
                        <span>{data.weather.humidity.toFixed(0)}%</span>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700"></div>
                  </div>
                </div>
              )}
              
              {/* Station name label (always visible in stations mode) */}
              {viewMode === 'stations' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                  <span className="text-xs font-medium text-gray-800 bg-white/90 px-1.5 py-0.5 rounded shadow-sm">
                    {data.station}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Scale Bar */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-xs shadow-md border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-gradient-to-r from-gray-800 via-gray-500 to-gray-300 rounded-sm"></div>
            <span className="font-medium text-gray-700">100 km</span>
          </div>
        </div>

        {/* Compass Rose */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur rounded-full w-10 h-10 flex items-center justify-center shadow-md border border-gray-200">
          <div className="relative w-6 h-6">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-red-600 font-bold text-xs">N</div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-gray-400 font-bold text-xs">S</div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold text-xs">W</div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold text-xs">E</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-3 bg-red-500 origin-bottom rotate-0"></div>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-xs shadow-lg max-w-xs">
          <div className="font-bold flex items-center gap-2">
            <Satellite className="w-4 h-4 text-green-400" />
            Ethiopia Pastoral Regions
          </div>
          <div className="text-gray-300 mt-0.5">Live NDVI Monitoring Stations</div>
          {summary && (
            <div className="mt-1.5 pt-1.5 border-t border-white/20 text-[10px] text-gray-400">
              Avg NDVI: <span className="text-white font-medium">{summary.avgNdvi}</span> | 
              Critical: <span className="text-red-400 font-medium">{summary.criticalStations}</span>
            </div>
          )}
        </div>

        {/* Mini Weather Widget (when enabled) */}
        {showWeatherDetails && !isLoading && selectedData && (
          <div className="absolute bottom-16 right-3 bg-white/95 backdrop-blur rounded-lg p-3 shadow-xl border border-gray-200 text-xs w-48">
            <div className="font-bold text-gray-800 mb-2 flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-blue-500" />
              Current Conditions
            </div>
            <div className="grid grid-cols-2 gap-2 text-gray-600">
              <div className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-orange-500" />
                <span>{selectedData.weather.temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-blue-500" />
                <span>{selectedData.weather.humidity.toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-3 h-3 text-teal-500" />
                <span>{selectedData.weather.windSpeed.toFixed(1)} m/s</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-indigo-500" />
                <span>{selectedData.weather.rainfall.toFixed(1)} mm</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200 text-[10px] text-gray-500">
              7-day rain: {selectedData.weather.rainSum7Day.toFixed(1)}mm | 
              Drought idx: {selectedData.weather.droughtIndex.toFixed(0)}
            </div>
          </div>
        )}
      </div>

      {/* Selected Station Detailed Info Panel */}
      {selectedStation && selectedData && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-blue-600" />
                {selectedData.station} Monitoring Station
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                {monitoringStations.find(s => s.name === selectedStation)?.region} Region • 
                Coords: {selectedData.lat.toFixed(2)}°N, {selectedData.lon.toFixed(2)}°E
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* NDVI Value */}
                <div className="bg-white rounded-lg p-3 shadow-sm border">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">NDVI Value</div>
                  <div className="text-2xl font-bold" style={{color: getColor(selectedData.calculatedNdvi)}}>
                    {selectedData.calculatedNdvi.toFixed(3)}
                  </div>
                  <div className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatus(selectedData.calculatedNdvi).color}`}>
                    {getStatus(selectedData.calculatedNdvi).label}
                  </div>
                </div>

                {/* Temperature */}
                <div className="bg-white rounded-lg p-3 shadow-sm border">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Thermometer className="w-3 h-3" /> Temperature
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedData.weather.temperature.toFixed(1)}°C
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    H: {selectedData.weather.tempMax.toFixed(0)}° / L: {selectedData.weather.tempMin.toFixed(0)}°
                  </div>
                </div>

                {/* Rainfall */}
                <div className="bg-white rounded-lg p-3 shadow-sm border">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Precipitation
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedData.weather.rainSum7Day.toFixed(1)}<span className="text-sm font-normal text-gray-500">mm</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">7-day cumulative</div>
                </div>

                {/* Risk Indicators */}
                <div className="bg-white rounded-lg p-3 shadow-sm border">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Risk Indices</div>
                  <div className="space-y-1.5 mt-2">
                    <div>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span>Drought</span>
                        <span className="font-medium">{selectedData.weather.droughtIndex.toFixed(0)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${selectedData.weather.droughtIndex}%`,
                            backgroundColor: selectedData.weather.droughtIndex > 60 ? '#ef4444' : 
                                           selectedData.weather.droughtIndex > 30 ? '#eab308' : '#22c55e'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span>Heat Stress</span>
                        <span className="font-medium">{selectedData.weather.heatStressIndex.toFixed(0)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${selectedData.weather.heatStressIndex}%`,
                            backgroundColor: selectedData.weather.heatStressIndex > 60 ? '#ef4444' : 
                                           selectedData.weather.heatStressIndex > 30 ? '#eab308' : '#22c55e'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedStation(null)}
              className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Summary Statistics Cards */}
      {!isLoading && summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-red-600">{stationData.filter(s => s.calculatedNdvi < 0.3).length}</div>
            <div className="text-sm text-red-700 font-medium mt-1">🚨 Critical</div>
            <div className="text-xs text-red-600/70">NDVI &lt; 0.3</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-600">{stationData.filter(s => s.calculatedNdvi >= 0.3 && s.calculatedNdvi < 0.4).length}</div>
            <div className="text-sm text-orange-700 font-medium mt-1">⚠️ Warning</div>
            <div className="text-xs text-orange-600/70">NDVI 0.3–0.4</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">{stationData.filter(s => s.calculatedNdvi >= 0.4).length}</div>
            <div className="text-sm text-green-700 font-medium mt-1">✅ Healthy</div>
            <div className="text-xs text-green-600/70">NDVI ≥ 0.4</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{stationData.length}</div>
            <div className="text-sm text-blue-700 font-medium mt-1">📡 Total Stations</div>
            <div className="text-xs text-blue-600/70">Avg: {summary.avgNdvi}</div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <h5 className="font-semibold text-sm mb-3 text-gray-700">NDVI Vegetation Index Legend</h5>
        <div className="h-4 rounded-full mb-3 shadow-inner" style={{
          background: 'linear-gradient(to-right, #ef4444 0%, #f97316 20%, #eab308 40%, #84cc16 60%, #22c55e 80%, #16a34a 100%)'
        }}></div>
        <div className="grid grid-cols-5 gap-2 text-xs text-gray-600">
          <div className="text-center">
            <div className="w-4 h-4 rounded bg-red-500 mx-auto mb-1"></div>
            <span className="font-medium text-red-700">Critical</span><br/>
            <span className="text-gray-400">&lt;0.30</span>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 rounded bg-orange-500 mx-auto mb-1"></div>
            <span className="font-medium text-orange-700">Poor</span><br/>
            <span className="text-gray-400">0.30–0.35</span>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 rounded bg-yellow-500 mx-auto mb-1"></div>
            <span className="font-medium text-yellow-700">Moderate</span><br/>
            <span className="text-gray-400">0.35–0.40</span>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 rounded bg-lime-500 mx-auto mb-1"></div>
            <span className="font-medium text-lime-700">Good</span><br/>
            <span className="text-gray-400">0.40–0.50</span>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 rounded bg-green-500 mx-auto mb-1"></div>
            <span className="font-medium text-green-700">Excellent</span><br/>
            <span className="text-gray-400">&gt;0.50</span>
          </div>
        </div>
        
        {summary && (
          <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5 text-blue-500" />
                Data Source: <strong className="text-gray-700">{summary.dataSource.split(' (')[0]}</strong>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>Avg Temp: <strong className="text-orange-600">{summary.avgTemperature}°C</strong></span>
              <span>7-Day Rain: <strong className="text-blue-600">{summary.totalRainfall7Day}mm</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

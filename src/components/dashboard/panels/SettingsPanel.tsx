'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Smartphone,
  Save,
  Key,
  Mail,
  MapPin,
  Building
} from 'lucide-react';

export default function SettingsPanel() {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Shield className="w-6 h-6 text-green-600" />
          Settings
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account preferences and notification settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security', icon: Key },
              { id: 'preferences', label: 'Preferences', icon: Palette }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  activeSection === item.id 
                    ? 'bg-green-50 text-green-700 border-l-4 border-green-500' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeSection === 'profile' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Profile Information</h3>
              
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                    Change Photo
                  </button>
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB</p>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.name || ''}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Mail className="w-4 h-4" /> Email
                  </label>
                  <input 
                    type="email" 
                    defaultValue={user?.email || ''}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Smartphone className="w-4 h-4" /> Phone
                  </label>
                  <input 
                    type="tel" 
                    placeholder="+251 9XX XXX XXX"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Building className="w-4 h-4" /> Organization
                  </label>
                  <input 
                    type="text" 
                    defaultValue={user?.organization || ''}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Region
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                    <option value="">Select Region</option>
                    <option value="somali" selected={user?.region === 'Somali'}>Somali Region</option>
                    <option value="oromia" selected={user?.region === 'Oromia'}>Oromia Region</option>
                    <option value="afar" selected={user?.region === 'Afar'}>Afar Region</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zone / Woreda</label>
                  <input 
                    type="text" 
                    defaultValue={`${user?.zone || ''} / ${user?.woreda || ''}`}
                    placeholder="Zone / Woreda"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <button 
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Notification Preferences</h3>
              
              <div className="space-y-4">
                {[
                  { title: 'Drought Alerts', description: 'Receive notifications when NDVI drops below threshold in your region', defaultChecked: true },
                  { title: 'Disease Outbreaks', description: 'Get alerts about livestock disease reports in nearby areas', defaultChecked: true },
                  { title: 'Weather Warnings', description: 'Extreme weather advisories for your location', defaultChecked: true },
                  { title: 'Market Updates', description: 'Weekly livestock market price summaries', defaultChecked: false },
                  { title: 'Community Posts', description: 'New posts in your community feed', defaultChecked: true },
                  { title: 'System Updates', description: 'New features and maintenance notices', defaultChecked: true },
                  { title: 'Report Generation', description: 'When new reports are available for download', defaultChecked: true }
                ].map((notification, index) => (
                  <div key={index} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-800">{notification.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{notification.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input type="checkbox" defaultChecked={notification.defaultChecked} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <button 
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {saved ? 'Saved!' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <button className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Sessions</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-800">Current Session</p>
                        <p className="text-xs text-gray-500">Addis Ababa, Ethiopia • Now</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Mobile App</p>
                        <p className="text-xs text-gray-500">Jijiga, Ethiopia • 2 hours ago</p>
                      </div>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-700">Revoke</button>
                  </div>
                </div>

                <button className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium">
                  Revoke All Other Sessions
                </button>
              </div>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Application Preferences</h3>
              
              <div className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                    <option>English</option>
                    <option>Amharic (አማርኛ)</option>
                    <option>Somali (Soomaali)</option>
                    <option>Afar (Qafar)</option>
                    <option>Oromo (Afaan Oromo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Dashboard View</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                    <option>Overview</option>
                    <option>NDVI Monitor</option>
                    <option>Livestock Health</option>
                    <option>Alerts & Warnings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Map Default Layer</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                    <option>NDVI Vegetation</option>
                    <option>Rainfall</option>
                    <option>Temperature</option>
                    <option>Livestock Density</option>
                    <option>Water Points</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                    <option>DD-MMM-YYYY</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button 
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {saved ? 'Saved!' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

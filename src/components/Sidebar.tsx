import React from 'react';
import { 
  Squares2X2Icon, 
  MapPinIcon, 
  BookmarkIcon, 
  CalendarIcon, 
  CogIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Squares2X2Icon, section: 'GENERAL' },
    { id: 'map', label: 'Map', icon: MapPinIcon, section: 'GENERAL' },
    { id: 'saved', label: 'Saved Location', icon: BookmarkIcon, section: 'GENERAL' },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon, section: 'GENERAL' },
    { id: 'settings', label: 'Settings', icon: CogIcon, section: 'SYSTEM' },
    { id: 'logout', label: 'Log Out', icon: ArrowRightOnRectangleIcon, section: 'SYSTEM' }
  ];

  const generalItems = menuItems.filter(item => item.section === 'GENERAL');
  const systemItems = menuItems.filter(item => item.section === 'SYSTEM');

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 h-screen shadow-2xl border-r border-slate-700">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <div className="w-5 h-5 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold text-white">Infomase</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-6">
          {/* General Section */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              GENERAL
            </h3>
            <div className="space-y-2">
              {generalItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-600"></div>

          {/* System Section */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              SYSTEM
            </h3>
            <div className="space-y-2">
              {systemItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                const isLogout = item.id === 'logout';
                return (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 ${
                      isLogout
                        ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300'
                        : isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isLogout ? 'text-red-400' : isActive ? 'text-white' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

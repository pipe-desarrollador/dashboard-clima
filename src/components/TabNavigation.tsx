import React from 'react';
import { 
  Squares2X2Icon, 
  MapPinIcon, 
  BookmarkIcon, 
  CalendarIcon, 
  CogIcon
} from '@heroicons/react/24/outline';

interface TabNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeSection, onSectionChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Squares2X2Icon },
    { id: 'map', label: 'Map', icon: MapPinIcon },
    { id: 'saved', label: 'Saved Locations', icon: BookmarkIcon },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon }
  ];

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onSectionChange(tab.id)}
                className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                  isActive
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 mr-2 ${
                  isActive ? 'text-indigo-600' : 'text-slate-400'
                }`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

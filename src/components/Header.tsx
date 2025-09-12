import React from 'react';
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, searchQuery, onSearchChange }) => {
  const currentDate = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  const dayName = dayNames[currentDate.getDay()];
  const day = currentDate.getDate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-gradient-to-r from-white to-slate-50 border-b border-slate-200 px-6 py-5 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <div className="w-5 h-5 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold text-slate-800">Infomase</span>
        </div>

        {/* Date */}
        <div className="text-center bg-gradient-to-r from-slate-100 to-blue-50 px-6 py-3 rounded-2xl border border-slate-200">
          <div className="text-2xl font-bold text-slate-800">{month} {year}</div>
          <div className="text-sm text-slate-600 font-medium">{dayName}, {day.toString().padStart(2, '0')}</div>
        </div>

        {/* Search and Notifications */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search location.."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-72 bg-white shadow-sm hover:shadow-md transition-all duration-200"
              />
            </div>
          </form>

          {/* Notification Bell */}
          <button className="p-3 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 transform hover:scale-110">
            <BellIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';

interface WeatherIconProps {
  iconCode: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ iconCode, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const getIcon = (code: string) => {
    switch (code) {
      case '01d': // clear sky day
        return (
          <svg className={`${sizeClasses[size]} ${className}`} fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" fill="#FCD34D"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#F59E0B" strokeWidth="2" fill="none"/>
          </svg>
        );
      
      case '01n': // clear sky night
        return (
          <svg className={`${sizeClasses[size]} ${className}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#6366F1"/>
            <circle cx="12" cy="12" r="3" fill="#FCD34D" opacity="0.8"/>
          </svg>
        );

      case '02d': // few clouds day
      case '02n': // few clouds night
        return (
          <svg className={`${sizeClasses[size]} ${className}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#94A3B8"/>
            <circle cx="12" cy="8" r="3" fill="#FCD34D" opacity="0.7"/>
          </svg>
        );

      case '03d': // scattered clouds
      case '03n': // scattered clouds
      case '04d': // broken clouds
      case '04n': // broken clouds
        return (
          <svg className={`${sizeClasses[size]} ${className}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#64748B"/>
            <path d="M6 16h-.26A6 6 0 1 1 9 4h.26A4 4 0 0 1 6 16z" fill="#94A3B8"/>
          </svg>
        );

      case '09d': // shower rain
      case '09n': // shower rain
        return (
          <svg className={`${sizeClasses[size]} ${className}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#64748B"/>
            <path d="M8 19l2-4M12 19l2-4M16 19l2-4" stroke="#3B82F6" strokeWidth="2" fill="none"/>
          </svg>
        );

      case '10d': // rain day
      case '10n': // rain night
        return (
          <svg className={`${sizeClasses[size]} ${className}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#64748B"/>
            <circle cx="12" cy="8" r="3" fill="#FCD34D" opacity="0.5"/>
            <path d="M8 19l2-4M12 19l2-4M16 19l2-4" stroke="#3B82F6" strokeWidth="2" fill="none"/>
          </svg>
        );

      case '11d': // thunderstorm
      case '11n': // thunderstorm
        return (
          <svg className={`${sizeClasses[size]} ${className}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#4C1D95"/>
            <path d="M13 2L9 10h3l-2 8" stroke="#FCD34D" strokeWidth="2" fill="none"/>
          </svg>
        );

      case '13d': // snow
      case '13n': // snow
        return (
          <svg className={`${sizeClasses[size]} ${className}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#E0E7FF"/>
            <path d="M8 16l1-1M12 16l1-1M16 16l1-1M8 20l1-1M12 20l1-1M16 20l1-1" stroke="#3B82F6" strokeWidth="1.5" fill="none"/>
          </svg>
        );

      case '50d': // mist
      case '50n': // mist
        return (
          <svg className={`${sizeClasses[size]} ${className}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#9CA3AF"/>
            <path d="M6 12h12M6 16h12M6 8h12" stroke="#6B7280" strokeWidth="1" fill="none"/>
          </svg>
        );

      default:
        return (
          <svg className={`${sizeClasses[size]} ${className}`} fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" fill="#FCD34D"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#F59E0B" strokeWidth="2" fill="none"/>
          </svg>
        );
    }
  };

  return getIcon(iconCode);
};

import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { WeatherData } from '../types/weather';
import { useWeatherTheme } from '../hooks/useWeatherTheme';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather, isFavorite, onToggleFavorite }) => {
  const theme = useWeatherTheme(weather);

  const getWeatherDescription = (description: string) => {
    const descMap: { [key: string]: string } = {
      'clear sky': 'Clear Sky',
      'few clouds': 'Few Clouds',
      'scattered clouds': 'Scattered Clouds',
      'broken clouds': 'Broken Clouds',
      'shower rain': 'Shower Rain',
      'rain': 'Rain',
      'thunderstorm': 'Thunderstorm',
      'snow': 'Snow',
      'mist': 'Mist',
      'fog': 'Fog',
      'haze': 'Haze'
    };
    return descMap[description.toLowerCase()] || description;
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className={`bg-gradient-to-br ${theme.gradient} rounded-3xl p-8 text-white relative overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/20`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-6 right-6 w-40 h-40 bg-white rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-6 left-6 w-20 h-20 bg-white rounded-full opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white rounded-full opacity-5"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <MapPinIcon className="w-4 h-4" />
            </div>
            <span className="text-lg font-semibold">{weather.name}</span>
            {onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                className="ml-3 p-2 hover:bg-white/20 rounded-full transition-all duration-200 transform hover:scale-110"
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite ? (
                  <StarIcon className="w-5 h-5 text-amber-300" />
                ) : (
                  <StarOutlineIcon className="w-5 h-5 text-white/80" />
                )}
              </button>
            )}
          </div>
          <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">{currentTime}</div>
        </div>

        {/* Main Temperature */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-7xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent animate-pulse">
            {Math.round(weather.main.temp)}°C
          </div>
          <div className="animate-bounce">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <WeatherIcon iconCode={weather.weather[0].icon} size="xl" className="text-white" />
            </div>
          </div>
        </div>

        {/* Weather Description */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/30">
          <div className="text-xl font-bold">{getWeatherDescription(weather.weather[0].description)}</div>
          <div className="text-sm opacity-90 mt-1">Feels like {Math.round(weather.main.feels_like)}°C</div>
        </div>

        {/* Weather Metrics */}
        <div className="grid grid-cols-5 gap-3">
          <div className="text-center bg-white/10 rounded-xl p-3 border border-white/20">
            <div className="text-xs opacity-80 mb-1 font-medium">PRESSURE</div>
            <div className="text-sm font-bold">{weather.main.pressure} mb</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-3 border border-white/20">
            <div className="text-xs opacity-80 mb-1 font-medium">WIND</div>
            <div className="text-sm font-bold">{Math.round(weather.wind.speed * 3.6)} km/hr</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-3 border border-white/20">
            <div className="text-xs opacity-80 mb-1 font-medium">VISIBILITY</div>
            <div className="text-sm font-bold">10km</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-3 border border-white/20">
            <div className="text-xs opacity-80 mb-1 font-medium">DEW POINT</div>
            <div className="text-sm font-bold">{Math.round(weather.main.temp - 5)}°c</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-3 border border-white/20">
            <div className="text-xs opacity-80 mb-1 font-medium">MOISTURE</div>
            <div className="text-sm font-bold">{weather.main.humidity}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

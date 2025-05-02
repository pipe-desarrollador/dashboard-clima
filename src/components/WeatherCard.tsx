import React from 'react';
import { WeatherData } from '../types/weather';
import { StarIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface WeatherCardProps {
  weather: WeatherData;
  onFavorite?: () => void;
  onRemoveFavorite?: () => void;
  isFavorite?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, onFavorite, onRemoveFavorite, isFavorite }) => {
  return (
    <div className="card relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {weather.name}, {weather.sys.country}
            {typeof isFavorite !== 'undefined' && (
              isFavorite ? (
                <button
                  title="Quitar de favoritos"
                  onClick={onRemoveFavorite}
                  className="ml-2 p-1 rounded-full bg-yellow-300 transition-colors"
                >
                  <StarIcon className="w-5 h-5 text-yellow-600 inline" />
                  <XMarkIcon className="w-4 h-4 text-red-500 inline ml-1" />
                </button>
              ) : (
                <button
                  title="Marcar como favorita"
                  onClick={onFavorite}
                  className="ml-2 p-1 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
                >
                  <StarIcon className="w-5 h-5 text-gray-400" />
                </button>
              )
            )}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{weather.weather[0].description}</p>
        </div>
        <img 
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
          className="w-20 h-20"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</p>
          <p className="text-gray-600 dark:text-gray-400">Sensación: {Math.round(weather.main.feels_like)}°C</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Humedad</p>
            <p className="font-semibold">{weather.main.humidity}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Viento</p>
            <p className="font-semibold">{Math.round(weather.wind.speed)} m/s</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Presión</p>
            <p className="font-semibold">{weather.main.pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 
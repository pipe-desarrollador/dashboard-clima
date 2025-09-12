import React from 'react';
import { StarIcon, XMarkIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { WeatherIcon } from './WeatherIcon';

interface FavoritesPanelProps {
  favorites: string[];
  onRemoveFavorite: (city: string) => void;
  onSelectFavorite: (city: string) => void;
  onAddFavorite: (city: string) => void;
  currentCity?: string;
}

interface FavoriteCityData {
  name: string;
  temp: number;
  weather: string;
  icon: string;
}

export const FavoritesPanel: React.FC<FavoritesPanelProps> = ({
  favorites,
  onRemoveFavorite,
  onSelectFavorite,
  onAddFavorite,
  currentCity
}) => {
  const isCurrentCityFavorite = currentCity && favorites.includes(currentCity);

  // Mock data for favorite cities (in a real app, this would come from API)
  const getFavoriteCityData = (cityName: string): FavoriteCityData => {
    const mockData: { [key: string]: FavoriteCityData } = {
      'New York': { name: 'New York', temp: 22, weather: 'Clear', icon: '01d' },
      'London': { name: 'London', temp: 18, weather: 'Clouds', icon: '02d' },
      'Tokyo': { name: 'Tokyo', temp: 25, weather: 'Rain', icon: '10d' },
      'São Paulo': { name: 'São Paulo', temp: 28, weather: 'Clear', icon: '01d' },
      'Sydney': { name: 'Sydney', temp: 20, weather: 'Clouds', icon: '02d' },
      'Lima': { name: 'Lima', temp: 24, weather: 'Clear', icon: '01d' }
    };
    return mockData[cityName] || { name: cityName, temp: 20, weather: 'Clear', icon: '01d' };
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 shadow-lg border border-slate-600">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <StarIcon className="w-6 h-6 text-amber-300 mr-3" />
          Saved Locations
        </h3>
        {currentCity && !isCurrentCityFavorite && (
          <button
            onClick={() => onAddFavorite(currentCity)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <StarOutlineIcon className="w-4 h-4 mr-2" />
            Add Current
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12 text-white">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
            <StarOutlineIcon className="w-10 h-10 text-amber-400" />
          </div>
          <p className="text-lg font-medium text-white">No saved locations yet</p>
          <p className="text-sm text-white/80 mt-1">Search for a city and add it to favorites</p>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((city) => {
            const cityData = getFavoriteCityData(city);
            return (
              <div
                key={city}
                className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
                  currentCity === city
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400 shadow-lg'
                    : 'bg-gradient-to-r from-slate-600 to-slate-500 border-slate-500 hover:border-blue-400 hover:bg-gradient-to-r hover:from-slate-500 hover:to-slate-400'
                }`}
              >
                <button
                  onClick={() => onSelectFavorite(city)}
                  className="flex items-center flex-1 text-left hover:text-blue-200 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-sky-200 to-blue-200 rounded-full flex items-center justify-center border border-sky-300">
                        <WeatherIcon iconCode={cityData.icon} size="md" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-2 text-white/70" />
                        <span className="font-semibold text-white">{city}</span>
                        {currentCity === city && (
                          <span className="ml-3 text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full font-medium shadow-sm">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-white/80 mt-1 font-medium">
                        {cityData.temp}°C • {cityData.weather}
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => onRemoveFavorite(city)}
                  className="p-3 text-white/60 hover:text-red-300 hover:bg-gradient-to-br hover:from-red-500/20 hover:to-pink-500/20 rounded-xl transition-all duration-200 transform hover:scale-110 border border-transparent hover:border-red-400"
                  title="Remove from favorites"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

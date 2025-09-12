import React, { useState } from 'react';
import { PlusIcon, MinusIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { weatherService } from '../services/weatherService';
import { WeatherData } from '../types/weather';

interface MapLocation {
  id: number;
  x: number;
  y: number;
  city: string;
  country: string;
  temp: number;
  weather: string;
  icon: string;
  weatherData?: WeatherData;
  lat?: number;
  lng?: number;
}

interface SurroundingCity {
  city: string;
  country: string;
  temp: number;
  weather: string;
  icon: string;
  distance: number;
  x: number;
  y: number;
}

export const WeatherMapCard: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timePosition, setTimePosition] = useState(50); // 0-100 for slider position
  const [surroundingCities, setSurroundingCities] = useState<SurroundingCity[]>([]);
  const [showSurroundings, setShowSurroundings] = useState(false);
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([
    { id: 1, x: 20, y: 30, city: 'New York', country: 'US', temp: 28, weather: 'Clear', icon: '☀️', lat: 40.7128, lng: -74.0060 },
    { id: 2, x: 60, y: 25, city: 'London', country: 'GB', temp: 22, weather: 'Clouds', icon: '☁️', lat: 51.5074, lng: -0.1278 },
    { id: 3, x: 80, y: 40, city: 'Tokyo', country: 'JP', temp: 18, weather: 'Rain', icon: '🌧️', lat: 35.6762, lng: 139.6503 },
    { id: 4, x: 30, y: 60, city: 'São Paulo', country: 'BR', temp: 25, weather: 'Clouds', icon: '⛅', lat: -23.5505, lng: -46.6333 },
    { id: 5, x: 70, y: 70, city: 'Sydney', country: 'AU', temp: 5, weather: 'Snow', icon: '❄️', lat: -33.8688, lng: 151.2093 },
    { id: 6, x: 15, y: 80, city: 'Lima', country: 'PE', temp: 20, weather: 'Rain', icon: '🌦️', lat: -12.0464, lng: -77.0428 }
  ]);

  // Define surrounding cities for each main city with better positioning
  const surroundingCitiesData: { [key: string]: SurroundingCity[] } = {
    'New York': [
      { city: 'Boston', country: 'US', temp: 15, weather: 'Clouds', icon: '☁️', distance: 306, x: 35, y: 15 },
      { city: 'Philadelphia', country: 'US', temp: 18, weather: 'Clear', icon: '☀️', distance: 95, x: 20, y: 45 },
      { city: 'Washington', country: 'US', temp: 20, weather: 'Rain', icon: '🌧️', distance: 225, x: 15, y: 50 },
      { city: 'Buffalo', country: 'US', temp: 12, weather: 'Snow', icon: '❄️', distance: 293, x: 30, y: 10 },
      { city: 'Hartford', country: 'US', temp: 16, weather: 'Clouds', icon: '☁️', distance: 116, x: 40, y: 25 }
    ],
    'London': [
      { city: 'Birmingham', country: 'GB', temp: 19, weather: 'Clouds', icon: '☁️', distance: 190, x: 55, y: 40 },
      { city: 'Manchester', country: 'GB', temp: 17, weather: 'Rain', icon: '🌧️', distance: 262, x: 50, y: 35 },
      { city: 'Bristol', country: 'GB', temp: 21, weather: 'Clear', icon: '☀️', distance: 189, x: 45, y: 45 },
      { city: 'Leeds', country: 'GB', temp: 16, weather: 'Clouds', icon: '☁️', distance: 310, x: 53, y: 30 },
      { city: 'Southampton', country: 'GB', temp: 20, weather: 'Clear', icon: '☀️', distance: 120, x: 40, y: 50 }
    ],
    'Tokyo': [
      { city: 'Yokohama', country: 'JP', temp: 19, weather: 'Rain', icon: '🌧️', distance: 30, x: 78, y: 48 },
      { city: 'Osaka', country: 'JP', temp: 22, weather: 'Clear', icon: '☀️', distance: 400, x: 72, y: 58 },
      { city: 'Nagoya', country: 'JP', temp: 21, weather: 'Clouds', icon: '☁️', distance: 270, x: 75, y: 53 },
      { city: 'Sapporo', country: 'JP', temp: 8, weather: 'Snow', icon: '❄️', distance: 830, x: 88, y: 25 },
      { city: 'Fukuoka', country: 'JP', temp: 25, weather: 'Clear', icon: '☀️', distance: 880, x: 62, y: 63 }
    ],
    'São Paulo': [
      { city: 'Rio de Janeiro', country: 'BR', temp: 28, weather: 'Clear', icon: '☀️', distance: 430, x: 45, y: 75 },
      { city: 'Belo Horizonte', country: 'BR', temp: 26, weather: 'Clouds', icon: '☁️', distance: 586, x: 40, y: 65 },
      { city: 'Campinas', country: 'BR', temp: 24, weather: 'Clear', icon: '☀️', distance: 99, x: 30, y: 65 },
      { city: 'Santos', country: 'BR', temp: 27, weather: 'Clear', icon: '☀️', distance: 72, x: 40, y: 70 },
      { city: 'Guarulhos', country: 'BR', temp: 25, weather: 'Clouds', icon: '☁️', distance: 20, x: 33, y: 67 }
    ],
    'Sydney': [
      { city: 'Melbourne', country: 'AU', temp: 18, weather: 'Clouds', icon: '☁️', distance: 877, x: 65, y: 85 },
      { city: 'Brisbane', country: 'AU', temp: 26, weather: 'Clear', icon: '☀️', distance: 917, x: 85, y: 75 },
      { city: 'Perth', country: 'AU', temp: 22, weather: 'Clear', icon: '☀️', distance: 3291, x: 50, y: 90 },
      { city: 'Adelaide', country: 'AU', temp: 20, weather: 'Clouds', icon: '☁️', distance: 1165, x: 60, y: 87 },
      { city: 'Newcastle', country: 'AU', temp: 19, weather: 'Rain', icon: '🌧️', distance: 162, x: 70, y: 77 }
    ],
    'Lima': [
      { city: 'Arequipa', country: 'PE', temp: 15, weather: 'Clear', icon: '☀️', distance: 1003, x: 25, y: 85 },
      { city: 'Trujillo', country: 'PE', temp: 22, weather: 'Clear', icon: '☀️', distance: 561, x: 20, y: 80 },
      { city: 'Chiclayo', country: 'PE', temp: 24, weather: 'Clear', icon: '☀️', distance: 770, x: 17, y: 77 },
      { city: 'Iquitos', country: 'PE', temp: 28, weather: 'Rain', icon: '🌧️', distance: 1013, x: 12, y: 70 },
      { city: 'Cusco', country: 'PE', temp: 12, weather: 'Clear', icon: '☀️', distance: 1100, x: 23, y: 90 }
    ]
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleLocationClick = async (location: MapLocation) => {
    setSelectedLocation(location);
    setIsLoading(true);
    setShowSurroundings(true);
    
    try {
      const weatherData = await weatherService.getCurrentWeather(location.city);
      setMapLocations(prev => prev.map(loc => 
        loc.id === location.id 
          ? { ...loc, weatherData, temp: Math.round(weatherData.main.temp), weather: weatherData.weather[0].main }
          : loc
      ));
      
      // Load surrounding cities data
      const surroundings = surroundingCitiesData[location.city] || [];
      setSurroundingCities(surroundings);
      
      // Zoom to the selected area
      setZoom(1.2);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWorld = () => {
    setSelectedLocation(null);
    setShowSurroundings(false);
    setSurroundingCities([]);
    setZoom(1);
  };

  const getWeatherIcon = (weather: string) => {
    const iconMap: { [key: string]: string } = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Snow': '❄️',
      'Thunderstorm': '⛈️',
      'Mist': '🌫️',
      'Fog': '🌫️'
    };
    return iconMap[weather] || '☀️';
  };

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setTimePosition(Math.max(0, Math.min(100, percentage)));
  };

  const getTimeFromPosition = (position: number) => {
    const hours = Math.round((position / 100) * 24);
    return `${hours.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 shadow-lg border border-slate-200 transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {showSurroundings && (
            <button
              onClick={handleBackToWorld}
              className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
              title="Back to World View"
            >
              ←
            </button>
          )}
          <h3 className="text-xl font-bold text-slate-800">
            {showSurroundings ? `Around ${selectedLocation?.city}` : 'The weather is around'}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleZoomOut}
            className="p-2 hover:bg-slate-200 rounded-xl transition-all duration-200 transform hover:scale-110"
            title="Zoom Out"
          >
            <MinusIcon className="w-4 h-4 text-slate-600" />
          </button>
          <span className="text-sm text-slate-600 font-semibold bg-slate-100 px-3 py-1 rounded-lg">{Math.round(zoom * 100)}%</span>
          <button 
            onClick={handleZoomIn}
            className="p-2 hover:bg-slate-200 rounded-xl transition-all duration-200 transform hover:scale-110"
            title="Zoom In"
          >
            <PlusIcon className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-gray-50 rounded-lg h-64 overflow-hidden">
        {/* Map Background */}
        <div 
          className="absolute inset-0 opacity-20 transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
        >
          {!showSurroundings ? (
            // World map for global view
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* North America */}
              <path d="M10 20 L25 15 L30 25 L20 35 Z" fill="#3B82F6" opacity="0.3" />
              {/* Europe */}
              <path d="M45 15 L55 12 L58 25 L50 30 Z" fill="#3B82F6" opacity="0.3" />
              {/* Asia */}
              <path d="M60 10 L85 8 L88 25 L75 30 Z" fill="#3B82F6" opacity="0.3" />
              {/* Africa */}
              <path d="M45 35 L55 32 L58 55 L50 60 Z" fill="#3B82F6" opacity="0.3" />
              {/* South America */}
              <path d="M25 50 L35 45 L40 70 L30 75 Z" fill="#3B82F6" opacity="0.3" />
              {/* Australia */}
              <path d="M75 60 L85 58 L88 75 L80 78 Z" fill="#3B82F6" opacity="0.3" />
            </svg>
          ) : (
            // Regional map for surrounding cities view
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Regional background shapes */}
              <circle cx="50" cy="50" r="40" fill="#E0F2FE" opacity="0.3" />
              <circle cx="30" cy="30" r="15" fill="#BAE6FD" opacity="0.2" />
              <circle cx="70" cy="30" r="12" fill="#BAE6FD" opacity="0.2" />
              <circle cx="30" cy="70" r="18" fill="#BAE6FD" opacity="0.2" />
              <circle cx="70" cy="70" r="14" fill="#BAE6FD" opacity="0.2" />
            </svg>
          )}
        </div>

        {/* Weather Locations */}
        {!showSurroundings ? (
          // Show world cities
          mapLocations.map((location) => (
            <div
              key={location.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110"
              style={{ left: `${location.x}%`, top: `${location.y}%` }}
              onClick={() => handleLocationClick(location)}
            >
              <div className={`bg-white rounded-full p-2 shadow-lg border-2 transition-all duration-300 ${
                selectedLocation?.id === location.id 
                  ? 'border-blue-500 shadow-blue-200' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}>
                <div className="text-lg">{getWeatherIcon(location.weather)}</div>
              </div>
              <div className="text-xs text-center mt-1 font-medium text-gray-700">
                {location.temp}°C
              </div>
              <div className="text-xs text-center text-gray-500 truncate max-w-16">
                {location.city}
              </div>
            </div>
          ))
        ) : (
          // Show surrounding cities
          <>
            {/* Selected city (highlighted) */}
            {selectedLocation && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${selectedLocation.x}%`, top: `${selectedLocation.y}%` }}
              >
                <div className="bg-blue-500 rounded-full p-3 shadow-lg border-4 border-white">
                  <div className="text-white text-lg">{getWeatherIcon(selectedLocation.weather)}</div>
                </div>
                <div className="text-xs text-center mt-1 font-bold text-blue-600">
                  {selectedLocation.temp}°C
                </div>
                <div className="text-xs text-center text-blue-500 font-medium">
                  {selectedLocation.city}
                </div>
              </div>
            )}
            
            {/* Surrounding cities */}
            {surroundingCities.map((city, index) => (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110"
                style={{ left: `${city.x}%`, top: `${city.y}%` }}
              >
                <div className="bg-white rounded-full p-2 shadow-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
                  <div className="text-lg">{getWeatherIcon(city.weather)}</div>
                </div>
                <div className="text-xs text-center mt-1 font-medium text-gray-700">
                  {city.temp}°C
                </div>
                <div className="text-xs text-center text-gray-500 truncate max-w-24">
                  {city.city}
                </div>
                <div className="text-xs text-center text-gray-400">
                  {city.distance}km
                </div>
              </div>
            ))}
          </>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Selected Location Details */}
      {selectedLocation && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <MapPinIcon className="w-4 h-4 mr-2" />
              {selectedLocation.city}, {selectedLocation.country}
            </h4>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {selectedLocation.weatherData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {selectedLocation.temp}°C
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedLocation.weatherData.weather[0].description}
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Feels like:</span>
                    <span className="font-medium">{Math.round(selectedLocation.weatherData.main.feels_like)}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Humidity:</span>
                    <span className="font-medium">{selectedLocation.weatherData.main.humidity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wind:</span>
                    <span className="font-medium">{Math.round(selectedLocation.weatherData.wind.speed * 3.6)} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pressure:</span>
                    <span className="font-medium">{selectedLocation.weatherData.main.pressure} hPa</span>
                  </div>
                </div>
              </div>
              
              {/* Surrounding Cities List */}
              {showSurroundings && surroundingCities.length > 0 && (
                <div className="border-t pt-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">Ciudades Cercanas</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {surroundingCities.map((city, index) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 text-sm border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{getWeatherIcon(city.weather)}</span>
                          <div>
                            <div className="font-medium text-gray-800">{city.city}</div>
                            <div className="text-gray-500 text-xs">{city.distance}km de distancia</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800 text-lg">{city.temp}°C</div>
                          <div className="text-gray-500 text-xs capitalize">{city.weather}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-gray-500">Click to load weather data</div>
            </div>
          )}
        </div>
      )}

      {/* Timeline Slider */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Time Range</span>
          <span className="text-xs text-gray-500 font-medium">{getTimeFromPosition(timePosition)}</span>
        </div>
        <div 
          className="bg-gray-200 h-2 rounded-full relative cursor-pointer hover:bg-gray-300 transition-colors"
          onClick={handleSliderClick}
        >
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-blue-500 hover:scale-110 transition-transform cursor-pointer"
            style={{ left: `${timePosition}%`, transform: 'translateX(-50%) translateY(-50%)' }}
          ></div>
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-200"
            style={{ width: `${timePosition}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>00:00</span>
          <span>12:00</span>
          <span>24:00</span>
        </div>
      </div>
    </div>
  );
};

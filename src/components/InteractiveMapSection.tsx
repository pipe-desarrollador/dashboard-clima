import React, { useState, useEffect } from 'react';
import { 
  MapPinIcon, 
  PlusIcon, 
  MinusIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { WeatherIcon } from './WeatherIcon';
import { weatherService } from '../services/weatherService';
import { WeatherData } from '../types/weather';

interface MapCity {
  id: number;
  name: string;
  country: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
  temp: number;
  weather: string;
  icon: string;
  weatherData?: WeatherData;
}

interface CurrentLocation {
  lat: number;
  lng: number;
  city: string;
  country: string;
}

export const InteractiveMapSection: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation | null>(null);
  const [selectedCity, setSelectedCity] = useState<MapCity | null>(null);
  const [mapCities, setMapCities] = useState<MapCity[]>([]);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable' | 'error'>('idle');
  const [locationError, setLocationError] = useState<string | null>(null);

  // Major world cities with their coordinates
  const worldCities: MapCity[] = [
    { id: 1, name: 'New York', country: 'US', lat: 40.7128, lng: -74.0060, x: 25, y: 35, temp: 22, weather: 'Clear', icon: '01d' },
    { id: 2, name: 'London', country: 'GB', lat: 51.5074, lng: -0.1278, x: 50, y: 30, temp: 18, weather: 'Clouds', icon: '02d' },
    { id: 3, name: 'Tokyo', country: 'JP', lat: 35.6762, lng: 139.6503, x: 85, y: 40, temp: 25, weather: 'Rain', icon: '10d' },
    { id: 4, name: 'São Paulo', country: 'BR', lat: -23.5505, lng: -46.6333, x: 30, y: 70, temp: 28, weather: 'Clear', icon: '01d' },
    { id: 5, name: 'Sydney', country: 'AU', lat: -33.8688, lng: 151.2093, x: 90, y: 75, temp: 20, weather: 'Clouds', icon: '02d' },
    { id: 6, name: 'Lima', country: 'PE', lat: -12.0464, lng: -77.0428, x: 20, y: 65, temp: 24, weather: 'Clear', icon: '01d' },
    { id: 7, name: 'Paris', country: 'FR', lat: 48.8566, lng: 2.3522, x: 52, y: 32, temp: 16, weather: 'Clouds', icon: '02d' },
    { id: 8, name: 'Moscow', country: 'RU', lat: 55.7558, lng: 37.6176, x: 60, y: 25, temp: 5, weather: 'Snow', icon: '13d' },
    { id: 9, name: 'Cairo', country: 'EG', lat: 30.0444, lng: 31.2357, x: 55, y: 45, temp: 32, weather: 'Clear', icon: '01d' },
    { id: 10, name: 'Mumbai', country: 'IN', lat: 19.0760, lng: 72.8777, x: 70, y: 50, temp: 30, weather: 'Clouds', icon: '02d' },
    { id: 11, name: 'Beijing', country: 'CN', lat: 39.9042, lng: 116.4074, x: 80, y: 35, temp: 12, weather: 'Clouds', icon: '02d' },
    { id: 12, name: 'Los Angeles', country: 'US', lat: 34.0522, lng: -118.2437, x: 15, y: 40, temp: 26, weather: 'Clear', icon: '01d' }
  ];

  const requestCurrentLocation = () => {
    // Get user's current location
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      setLocationError('La geolocalización no está disponible en este navegador.');
      return;
    }

    setLocationStatus('requesting');
    setLocationError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const apiKey = weatherService.getEffectiveApiKey();
            if (!apiKey) throw new Error('MISSING_OPENWEATHER_API_KEY');
            // Reverse geocoding to get city name
            const response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
            );
            const data = await response.json();
            if (data && data.length > 0) {
              setCurrentLocation({
                lat: latitude,
                lng: longitude,
                city: data[0].name,
                country: data[0].country
              });
              setLocationStatus('granted');
            }
          } catch (error) {
            console.error('Error getting location name:', error);
            setLocationStatus('error');
            setLocationError('No se pudo obtener el nombre de la ubicación.');
            setCurrentLocation({
              lat: latitude,
              lng: longitude,
              city: 'Current Location',
              country: 'Unknown'
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          if (error.code === error.PERMISSION_DENIED) {
            setLocationStatus('denied');
            setLocationError('Permiso de ubicación denegado. Habilita el acceso en tu navegador y vuelve a intentarlo.');
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            setLocationStatus('error');
            setLocationError('La ubicación no está disponible actualmente.');
          } else if (error.code === error.TIMEOUT) {
            setLocationStatus('error');
            setLocationError('La solicitud de ubicación expiró. Intenta nuevamente.');
          } else {
            setLocationStatus('error');
            setLocationError('Ocurrió un error al obtener la ubicación.');
          }
          // Fallback to a default location
          setCurrentLocation({
            lat: 40.7128,
            lng: -74.0060,
            city: 'New York',
            country: 'US'
          });
        }
      );
    }
  };

  useEffect(() => {
    requestCurrentLocation();
  }, []);

  useEffect(() => {
    setMapCities(worldCities);
  }, []);

  const handleCityClick = async (city: MapCity) => {
    setIsLoading(true);
    try {
      const weatherData = await weatherService.getCurrentWeather(city.name);
      setSelectedCity({ ...city, weatherData });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      setIsLoading(true);
      try {
        const weatherData = await weatherService.getCurrentWeather(query);
        // Add searched city to map
        const newCity: MapCity = {
          id: Date.now(),
          name: weatherData.name,
          country: weatherData.sys.country,
          lat: weatherData.coord.lat,
          lng: weatherData.coord.lon,
          x: 50, // Center on map
          y: 50,
          temp: Math.round(weatherData.main.temp),
          weather: weatherData.weather[0].main,
          icon: weatherData.weather[0].icon,
          weatherData
        };
        setSelectedCity(newCity);
        setSearchQuery('');
      } catch (error) {
        console.error('Error searching city:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handlePan = (direction: 'up' | 'down' | 'left' | 'right') => {
    const panAmount = 10;
    switch (direction) {
      case 'up':
        setPanY(prev => prev - panAmount);
        break;
      case 'down':
        setPanY(prev => prev + panAmount);
        break;
      case 'left':
        setPanX(prev => prev - panAmount);
        break;
      case 'right':
        setPanX(prev => prev + panAmount);
        break;
    }
  };

  const resetMap = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setSelectedCity(null);
  };

  const latLngToXY = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 shadow-lg border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <GlobeAltIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Interactive World Map</h3>
            <p className="text-sm text-slate-600">Explore weather around the globe</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {locationStatus === 'requesting' && (
            <span className="text-xs text-slate-500">Detectando ubicación...</span>
          )}
          {locationStatus === 'granted' && (
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
              Ubicación activada
            </span>
          )}
          <button
            onClick={requestCurrentLocation}
            className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 text-sm"
          >
            Usar mi ubicación
          </button>
          <button
            onClick={resetMap}
            className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 transform hover:scale-105 text-sm"
          >
            Reset View
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
          />
          <button
            onClick={() => handleSearch(searchQuery)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Location error / help */}
      {locationError && (
        <div className="mt-2 mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl px-3 py-2 flex items-start justify-between">
          <span>{locationError}</span>
          <button
            onClick={requestCurrentLocation}
            className="ml-3 px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-medium"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl h-96 overflow-hidden border-2 border-slate-200">
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Current Location Marker */}
        {currentLocation && (
          (() => {
            const { x, y } = latLngToXY(currentLocation.lat, currentLocation.lng);
            return (
              <div
                className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${x + panX}%`,
                  top: `${y + panY}%`,
                  transform: `translate(-50%, -50%) scale(${zoom})`
                }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
                  <MapPinIcon className="w-4 h-4 text-white" />
                </div>
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-md text-xs font-medium text-slate-700 whitespace-nowrap">
                  You are here
                </div>
              </div>
            );
          })()
        )}

        {/* City Markers */}
        {mapCities.map((city) => (
          <div
            key={city.id}
            onClick={() => handleCityClick(city)}
            className="absolute z-10 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
            style={{
              left: `${city.x + panX}%`,
              top: `${city.y + panY}%`,
              transform: `translate(-50%, -50%) scale(${zoom})`
            }}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-200 ${
              selectedCity?.id === city.id 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-white scale-110' 
                : 'bg-white border-slate-300 hover:border-indigo-400'
            }`}>
              <WeatherIcon iconCode={city.icon} size="sm" />
            </div>
            <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-md text-xs font-medium text-slate-700 whitespace-nowrap">
              {city.name}
            </div>
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-slate-100 px-2 py-1 rounded-lg shadow-md text-xs text-slate-600 whitespace-nowrap">
              {city.temp}°C
            </div>
          </div>
        ))}

        {/* Selected City Marker */}
        {selectedCity && (
          <div
            className="absolute z-30 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${selectedCity.x + panX}%`,
              top: `${selectedCity.y + panY}%`,
              transform: `translate(-50%, -50%) scale(${zoom})`
            }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white animate-bounce">
              <WeatherIcon iconCode={selectedCity.icon} size="md" />
            </div>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          {/* Zoom Controls */}
          <div className="bg-white rounded-lg shadow-lg p-1">
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom In"
            >
              <PlusIcon className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <MinusIcon className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Pan Controls */}
          <div className="bg-white rounded-lg shadow-lg p-1">
            <button
              onClick={() => handlePan('up')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Pan Up"
            >
              <ArrowUpIcon className="w-4 h-4 text-slate-600" />
            </button>
            <div className="flex">
              <button
                onClick={() => handlePan('left')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Pan Left"
              >
                <ArrowLeftIcon className="w-4 h-4 text-slate-600" />
              </button>
              <button
                onClick={() => handlePan('right')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Pan Right"
              >
                <ArrowRightIcon className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            <button
              onClick={() => handlePan('down')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Pan Down"
            >
              <ArrowDownIcon className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
          </div>
        )}
      </div>

      {/* Selected City Info */}
      {selectedCity && selectedCity.weatherData && (
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center">
                <WeatherIcon iconCode={selectedCity.weatherData.weather[0].icon} size="md" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800">{selectedCity.name}, {selectedCity.country}</h4>
                <p className="text-sm text-slate-600">{selectedCity.weatherData.weather[0].description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-800">{Math.round(selectedCity.weatherData.main.temp)}°C</div>
              <div className="text-sm text-slate-600">Feels like {Math.round(selectedCity.weatherData.main.feels_like)}°C</div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center bg-slate-50 rounded-lg p-3">
              <div className="text-sm text-slate-600">Humidity</div>
              <div className="text-lg font-bold text-slate-800">{selectedCity.weatherData.main.humidity}%</div>
            </div>
            <div className="text-center bg-slate-50 rounded-lg p-3">
              <div className="text-sm text-slate-600">Wind</div>
              <div className="text-lg font-bold text-slate-800">{selectedCity.weatherData.wind.speed} m/s</div>
            </div>
            <div className="text-center bg-slate-50 rounded-lg p-3">
              <div className="text-sm text-slate-600">Pressure</div>
              <div className="text-lg font-bold text-slate-800">{selectedCity.weatherData.main.pressure} hPa</div>
            </div>
            <div className="text-center bg-slate-50 rounded-lg p-3">
              <div className="text-sm text-slate-600">Visibility</div>
              <div className="text-lg font-bold text-slate-800">{selectedCity.weatherData.visibility ? (selectedCity.weatherData.visibility / 1000).toFixed(1) : 'N/A'} km</div>
            </div>
          </div>
        </div>
      )}

      {/* Current Location Info */}
      {currentLocation && (
        <div className="mt-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <MapPinIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">Your Current Location</div>
              <div className="text-sm text-slate-600">{currentLocation.city}, {currentLocation.country}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

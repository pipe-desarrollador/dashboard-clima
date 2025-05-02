import { useState, useEffect } from 'react';
import { WeatherCard } from './components/WeatherCard';
import { WeatherChart } from './components/WeatherChart';
import { SearchBar } from './components/SearchBar';
import { weatherService } from './services/weatherService';
import { WeatherData, ForecastData } from './types/weather';
import { SunIcon, MoonIcon, StarIcon, XMarkIcon } from '@heroicons/react/24/outline';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    const favs = localStorage.getItem('favoriteCities');
    return favs ? JSON.parse(favs) : [];
  });
  const [selectedFavorite, setSelectedFavorite] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    if (selectedFavorite && !weather) {
      handleSearch(selectedFavorite);
      return;
    }
    if (navigator.geolocation && favorites.length === 0) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setIsLoading(true);
            const weatherData = await weatherService.getWeatherByCoords(
              position.coords.latitude,
              position.coords.longitude
            );
            setWeather(weatherData);
            const forecastData = await weatherService.getForecast(weatherData.name);
            setForecast(forecastData);
          } catch (err) {
            setError('Error al obtener los datos del clima');
            console.error(err);
          } finally {
            setIsLoading(false);
          }
        },
        () => {
          handleSearch('London');
        }
      );
    } else if (!weather && favorites.length === 0) {
      handleSearch('London');
    }
  }, []);

  const handleSearch = async (city: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(city),
        weatherService.getForecast(city)
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
      setSelectedFavorite(null);
    } catch (err) {
      setError('Ciudad no encontrada o error al obtener datos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFavorite = () => {
    if (weather && !favorites.includes(weather.name)) {
      const newFavs = [...favorites, weather.name];
      setFavorites(newFavs);
      localStorage.setItem('favoriteCities', JSON.stringify(newFavs));
    }
  };

  const handleRemoveFavorite = (city: string) => {
    const newFavs = favorites.filter(fav => fav !== city);
    setFavorites(newFavs);
    localStorage.setItem('favoriteCities', JSON.stringify(newFavs));
    if (selectedFavorite === city) {
      setSelectedFavorite(null);
      setWeather(null);
      setForecast(null);
    }
  };

  const handleSelectFavorite = (city: string) => {
    setSelectedFavorite(city);
    handleSearch(city);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-8 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Panel del Clima</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <SunIcon className="w-6 h-6" />
            ) : (
              <MoonIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        {favorites.length > 0 && (
          <div className="w-full max-w-md mb-4">
            <div className="flex items-center gap-2 mb-1">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">Ciudades favoritas:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {favorites.map((city) => (
                <div key={city} className="flex items-center bg-gray-200 dark:bg-gray-700 rounded px-2 py-1">
                  <button
                    className="text-blue-600 dark:text-blue-300 underline mr-1"
                    onClick={() => handleSelectFavorite(city)}
                  >
                    {city}
                  </button>
                  <button
                    className="ml-1 text-red-500 hover:text-red-700"
                    title="Quitar de favoritos"
                    onClick={() => handleRemoveFavorite(city)}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full max-w-md">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-6 w-full max-w-md">
            {error}
          </div>
        )}

        <div className="w-full flex flex-col md:flex-row gap-8 items-start justify-center mt-4">
          <div className="flex flex-col gap-6 w-full max-w-md">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              weather && (
                <WeatherCard
                  weather={weather}
                  onFavorite={favorites.includes(weather.name) ? undefined : handleAddFavorite}
                  onRemoveFavorite={favorites.includes(weather.name) ? () => handleRemoveFavorite(weather.name) : undefined}
                  isFavorite={favorites.includes(weather.name)}
                />
              )
            )}
            {forecast && <WeatherChart forecast={forecast} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { TabNavigation } from './components/TabNavigation';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherMapCard } from './components/WeatherMapCard';
import { InteractiveMapSection } from './components/InteractiveMapSection';
import { ForecastCard } from './components/ForecastCard';
import { FavoritesPanel } from './components/FavoritesPanel';
import { WeatherCharts } from './components/WeatherCharts';
import { ColombiaCalendar } from './components/ColombiaCalendar';
import { SettingsPanel } from './components/SettingsPanel';
import { weatherService } from './services/weatherService';
import { WeatherData, ForecastData } from './types/weather';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('weatherFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoriteNotification, setShowFavoriteNotification] = useState(false);

  useEffect(() => {
    // Try to get user's location first, fallback to London
    if (!weather) {
      setIsLoading(true);
      
      // Set a timeout to ensure we don't stay loading forever
      const loadingTimeout = setTimeout(() => {
        if (!weather) {
          console.log('Loading timeout, falling back to London');
          handleSearch('London');
        }
      }, 15000);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              clearTimeout(loadingTimeout);
              const weatherData = await weatherService.getWeatherByCoords(
                position.coords.latitude,
                position.coords.longitude
              );
              setWeather(weatherData);
              const forecastData = await weatherService.getForecast(weatherData.name);
              setForecast(forecastData);
            } catch (err) {
              console.error('Error getting weather by coordinates:', err);
              clearTimeout(loadingTimeout);
              handleSearch('London');
            } finally {
              setIsLoading(false);
            }
          },
          (error) => {
            console.log('Geolocation error:', error);
            clearTimeout(loadingTimeout);
            handleSearch('London');
          },
          {
            timeout: 5000,
            enableHighAccuracy: false
          }
        );
      } else {
        clearTimeout(loadingTimeout);
        handleSearch('London');
      }
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
    } catch (err) {
      setError('Ciudad no encontrada o error al obtener datos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleAddFavorite = (city: string) => {
    if (!favorites.includes(city)) {
      const newFavorites = [...favorites, city];
      setFavorites(newFavorites);
      localStorage.setItem('weatherFavorites', JSON.stringify(newFavorites));
      
      // Show notification
      setShowFavoriteNotification(true);
      setTimeout(() => setShowFavoriteNotification(false), 3000);
    }
  };

  const handleRemoveFavorite = (city: string) => {
    const newFavorites = favorites.filter(fav => fav !== city);
    setFavorites(newFavorites);
    localStorage.setItem('weatherFavorites', JSON.stringify(newFavorites));
  };

  const handleSelectFavorite = (city: string) => {
    handleSearch(city);
  };

  const handleToggleFavorite = () => {
    if (weather) {
      if (favorites.includes(weather.name)) {
        handleRemoveFavorite(weather.name);
      } else {
        handleAddFavorite(weather.name);
        // Auto-navigate to saved section when adding favorite
        setActiveSection('saved');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" style={{minHeight: '100vh'}}>
      {/* Header */}
      <Header 
        onSearch={handleSearch} 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
      {/* Tab Navigation */}
      <TabNavigation activeSection={activeSection} onSectionChange={handleSectionChange} />
      
      {/* Main Content */}
      <div className="flex-1">
        
        {/* Main Content Area */}
        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          {/* Favorite Notification */}
          {showFavoriteNotification && (
            <div className="fixed top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fadeIn transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-3">
                  <span className="text-emerald-500 text-sm font-bold">✓</span>
                </div>
                <span className="font-medium">Ciudad agregada a favoritos</span>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-transparent"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-indigo-500 absolute top-0 left-0" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
              </div>
            </div>
          ) : (
            <div>
              {/* Dashboard Tab */}
              {activeSection === 'dashboard' && (
                <div className="space-y-6">
                  {/* Top Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Current Weather Card */}
                    {weather && (
                      <div className="lg:col-span-1">
                        <CurrentWeatherCard 
                          weather={weather} 
                          isFavorite={favorites.includes(weather.name)}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      </div>
                    )}
                    
                    {/* Weather Map Card */}
                    <div className="lg:col-span-1">
                      <WeatherMapCard />
                    </div>
                  </div>
                  
                  {/* Forecast Card */}
                  {forecast && (
                    <div>
                      <ForecastCard forecast={forecast} />
                    </div>
                  )}

                  {/* Weather Charts */}
                  {forecast && (
                    <div>
                      <WeatherCharts forecast={forecast} />
                    </div>
                  )}
                </div>
              )}

              {/* Map Tab */}
              {activeSection === 'map' && (
                <div>
                  <InteractiveMapSection />
                </div>
              )}

              {/* Saved Locations Tab */}
              {activeSection === 'saved' && (
                <div>
                  <FavoritesPanel
                    favorites={favorites}
                    onRemoveFavorite={handleRemoveFavorite}
                    onSelectFavorite={handleSelectFavorite}
                    onAddFavorite={handleAddFavorite}
                    currentCity={weather?.name}
                  />
                </div>
              )}

              {/* Calendar Tab */}
              {activeSection === 'calendar' && (
                <div>
                  <ColombiaCalendar />
                </div>
              )}

              {/* Settings Tab */}
              {activeSection === 'settings' && (
                <div>
                  <SettingsPanel />
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

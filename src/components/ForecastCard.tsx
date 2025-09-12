import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ForecastData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface ForecastCardProps {
  forecast: ForecastData;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${dayName}, ${day} ${month}`;
  };

  // Group forecast by days and get daily averages
  const getDailyForecast = () => {
    const dailyData: { [key: string]: any[] } = {};
    
    forecast.list.forEach(item => {
      const date = new Date(item.dt_txt).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(item);
    });

    // Get next 5 days (excluding today)
    const today = new Date().toDateString();
    const nextDays = Object.keys(dailyData)
      .filter(date => date !== today)
      .slice(0, 5);

    return nextDays.map(date => {
      const dayData = dailyData[date];
      const avgTemp = Math.round(
        dayData.reduce((sum, item) => sum + item.main.temp, 0) / dayData.length
      );
      const avgFeelsLike = Math.round(
        dayData.reduce((sum, item) => sum + item.main.feels_like, 0) / dayData.length
      );
      const avgHumidity = Math.round(
        dayData.reduce((sum, item) => sum + item.main.humidity, 0) / dayData.length
      );
      
      // Get min and max temperatures for the day
      const temps = dayData.map(item => item.main.temp);
      const minTemp = Math.round(Math.min(...temps));
      const maxTemp = Math.round(Math.max(...temps));
      
      // Get the most common weather condition for the day
      const weatherCounts: { [key: string]: number } = {};
      dayData.forEach(item => {
        const condition = item.weather[0].main;
        weatherCounts[condition] = (weatherCounts[condition] || 0) + 1;
      });
      const mostCommonWeather = Object.keys(weatherCounts).reduce((a, b) => 
        weatherCounts[a] > weatherCounts[b] ? a : b
      );
      
      // Get icon from the first item of the day
      const icon = dayData[0].weather[0].icon;
      
      return {
        date: dayData[0].dt_txt,
        temp: avgTemp,
        minTemp,
        maxTemp,
        feelsLike: avgFeelsLike,
        humidity: avgHumidity,
        weather: { main: mostCommonWeather, icon },
        description: dayData[0].weather[0].description
      };
    });
  };

  const forecastItems = getDailyForecast();

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 shadow-lg border border-slate-200 transform transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-800">Próxima previsión meteorológica</h3>
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-slate-200 rounded-xl transition-all duration-200 transform hover:scale-110">
            <ChevronLeftIcon className="w-5 h-5 text-slate-600" />
          </button>
          <button className="p-2 hover:bg-slate-200 rounded-xl transition-all duration-200 transform hover:scale-110">
            <ChevronRightIcon className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Forecast Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecastItems.map((item, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-indigo-300 hover:bg-gradient-to-br hover:from-slate-50 hover:to-blue-50">
            {/* Date */}
            <div className="text-sm font-semibold text-slate-600 mb-3">
              {formatDate(item.date)}
            </div>

            {/* Temperature Range */}
            <div className="mb-3">
              <div className="text-xl font-bold text-slate-800">
                {item.maxTemp}°C
              </div>
              <div className="text-sm text-slate-600 font-medium">
                {item.minTemp}°C
              </div>
            </div>

            {/* Weather Icon */}
            <div className="mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
                <WeatherIcon iconCode={item.weather.icon} size="lg" />
              </div>
            </div>

            {/* Weather Description */}
            <div className="text-sm font-semibold text-slate-700 mb-3">
              {getWeatherDescription(item.description)}
            </div>

            {/* Temperature Range Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 font-medium">
                <span>{item.minTemp}°</span>
                <div className="flex-1 bg-slate-200 rounded-full h-2 mx-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-red-400 h-2 rounded-full"
                    style={{ 
                      width: `${Math.min(100, ((item.maxTemp - item.minTemp) / 20) * 100)}%` 
                    }}
                  ></div>
                </div>
                <span>{item.maxTemp}°</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-xs text-slate-500 space-y-1 font-medium">
              <div>Feels like {item.feelsLike}°C</div>
              <div>Humidity: {item.humidity}%</div>
            </div>

            {/* Progress Bar (for first item) */}
            {index === 0 && (
              <div className="mt-3">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

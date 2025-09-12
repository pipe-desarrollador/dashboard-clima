import { useMemo } from 'react';
import { WeatherData } from '../types/weather';

export interface WeatherTheme {
  primary: string;
  secondary: string;
  gradient: string;
  background: string;
  text: string;
  accent: string;
}

export const useWeatherTheme = (weather: WeatherData | null): WeatherTheme => {
  return useMemo(() => {
    if (!weather) {
      return {
        primary: 'from-blue-900 to-blue-800',
        secondary: 'blue-500',
        gradient: 'from-blue-900 to-blue-800',
        background: 'bg-gray-50',
        text: 'text-white',
        accent: 'blue-500'
      };
    }

    const condition = weather.weather[0].main.toLowerCase();
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 18;

    switch (condition) {
      case 'clear':
        return {
          primary: isNight ? 'from-indigo-900 to-purple-900' : 'from-yellow-400 to-orange-500',
          secondary: isNight ? 'indigo-500' : 'yellow-500',
          gradient: isNight ? 'from-indigo-900 to-purple-900' : 'from-yellow-400 to-orange-500',
          background: isNight ? 'bg-indigo-50' : 'bg-yellow-50',
          text: 'text-white',
          accent: isNight ? 'indigo-500' : 'yellow-500'
        };

      case 'clouds':
        return {
          primary: 'from-gray-600 to-gray-800',
          secondary: 'gray-500',
          gradient: 'from-gray-600 to-gray-800',
          background: 'bg-gray-50',
          text: 'text-white',
          accent: 'gray-500'
        };

      case 'rain':
      case 'drizzle':
        return {
          primary: 'from-blue-800 to-blue-900',
          secondary: 'blue-600',
          gradient: 'from-blue-800 to-blue-900',
          background: 'bg-blue-50',
          text: 'text-white',
          accent: 'blue-600'
        };

      case 'thunderstorm':
        return {
          primary: 'from-purple-900 to-indigo-900',
          secondary: 'purple-600',
          gradient: 'from-purple-900 to-indigo-900',
          background: 'bg-purple-50',
          text: 'text-white',
          accent: 'purple-600'
        };

      case 'snow':
        return {
          primary: 'from-cyan-400 to-blue-500',
          secondary: 'cyan-500',
          gradient: 'from-cyan-400 to-blue-500',
          background: 'bg-cyan-50',
          text: 'text-white',
          accent: 'cyan-500'
        };

      case 'mist':
      case 'fog':
      case 'haze':
        return {
          primary: 'from-gray-500 to-gray-700',
          secondary: 'gray-600',
          gradient: 'from-gray-500 to-gray-700',
          background: 'bg-gray-50',
          text: 'text-white',
          accent: 'gray-600'
        };

      default:
        return {
          primary: 'from-blue-900 to-blue-800',
          secondary: 'blue-500',
          gradient: 'from-blue-900 to-blue-800',
          background: 'bg-gray-50',
          text: 'text-white',
          accent: 'blue-500'
        };
    }
  }, [weather]);
};

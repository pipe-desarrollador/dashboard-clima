import axios from 'axios';
import { WeatherData, ForecastData } from '../types/weather';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function getApiKeyFromSettings(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('weatherAppSettings');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { apiKey?: unknown };
    const key = typeof parsed.apiKey === 'string' ? parsed.apiKey.trim() : '';
    return key.length > 0 ? key : null;
  } catch {
    return null;
  }
}

function getEffectiveApiKey(): string | null {
  return getApiKeyFromSettings() ?? (import.meta.env.VITE_OPENWEATHER_API_KEY?.trim() || null);
}

export const weatherService = {
  getEffectiveApiKey,

  async getCurrentWeather(city: string): Promise<WeatherData> {
    try {
      const apiKey = getEffectiveApiKey();
      if (!apiKey) {
        throw new Error('MISSING_OPENWEATHER_API_KEY');
      }
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: apiKey,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  },

  async getForecast(city: string): Promise<ForecastData> {
    try {
      const apiKey = getEffectiveApiKey();
      if (!apiKey) {
        throw new Error('MISSING_OPENWEATHER_API_KEY');
      }
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: apiKey,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  },

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
      const apiKey = getEffectiveApiKey();
      if (!apiKey) {
        throw new Error('MISSING_OPENWEATHER_API_KEY');
      }
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather by coordinates:', error);
      throw error;
    }
  }
}; 
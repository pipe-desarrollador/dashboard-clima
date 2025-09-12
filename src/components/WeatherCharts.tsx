import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { ForecastData } from '../types/weather';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeatherChartsProps {
  forecast: ForecastData;
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ forecast }) => {
  const temperatureData = {
    labels: forecast.list.slice(0, 8).map(item => {
      const date = new Date(item.dt_txt);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: forecast.list.slice(0, 8).map(item => Math.round(item.main.temp)),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
      {
        label: 'Feels Like (°C)',
        data: forecast.list.slice(0, 8).map(item => Math.round(item.main.feels_like)),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: false,
        pointBackgroundColor: 'rgb(168, 85, 247)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }
    ]
  };

  const humidityData = {
    labels: forecast.list.slice(0, 8).map(item => {
      const date = new Date(item.dt_txt);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }),
    datasets: [
      {
        label: 'Humidity (%)',
        data: forecast.list.slice(0, 8).map(item => item.main.humidity),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6B7280',
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8,
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Weather Analytics</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Chart */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-md font-medium text-gray-700 mb-4">Temperature Trend</h4>
          <div className="h-64">
            <Line data={temperatureData} options={chartOptions} />
          </div>
        </div>

        {/* Humidity Chart */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-md font-medium text-gray-700 mb-4">Humidity Trend</h4>
          <div className="h-64">
            <Line data={humidityData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

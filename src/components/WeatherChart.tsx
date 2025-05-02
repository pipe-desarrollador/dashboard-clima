import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ForecastData } from '../types/weather';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeatherChartProps {
  forecast: ForecastData;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({ forecast }) => {
  const data = {
    labels: forecast.list.slice(0, 8).map(item => 
      new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', hour12: false })
    ),
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: forecast.list.slice(0, 8).map(item => item.main.temp),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Sensación (°C)',
        data: forecast.list.slice(0, 8).map(item => item.main.feels_like),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Pronóstico 24 horas',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="card mt-6">
      <Line options={options} data={data} />
    </div>
  );
}; 
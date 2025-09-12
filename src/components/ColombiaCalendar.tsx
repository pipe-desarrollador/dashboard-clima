import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  MapPinIcon, 
  SunIcon, 
  CloudIcon, 
  CloudRainIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { WeatherIcon } from './WeatherIcon';
import { weatherService } from '../services/weatherService';
import { WeatherData } from '../types/weather';

interface ColombianHoliday {
  date: string;
  name: string;
  type: 'national' | 'religious' | 'regional';
  description: string;
}

interface ColombianCity {
  name: string;
  department: string;
  lat: number;
  lng: number;
  temp: number;
  weather: string;
  icon: string;
  weatherData?: WeatherData;
}

export const ColombiaCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [colombianCities, setColombianCities] = useState<ColombianCity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Colombian holidays and important dates
  const colombianHolidays: ColombianHoliday[] = [
    { date: '2024-01-01', name: 'Año Nuevo', type: 'national', description: 'Día de Año Nuevo' },
    { date: '2024-01-08', name: 'Día de los Reyes Magos', type: 'religious', description: 'Epifanía del Señor' },
    { date: '2024-03-25', name: 'Día de San José', type: 'religious', description: 'San José, esposo de la Virgen María' },
    { date: '2024-03-28', name: 'Jueves Santo', type: 'religious', description: 'Semana Santa' },
    { date: '2024-03-29', name: 'Viernes Santo', type: 'religious', description: 'Semana Santa' },
    { date: '2024-03-31', name: 'Domingo de Resurrección', type: 'religious', description: 'Semana Santa' },
    { date: '2024-05-01', name: 'Día del Trabajo', type: 'national', description: 'Día Internacional del Trabajador' },
    { date: '2024-05-13', name: 'Día de la Ascensión', type: 'religious', description: 'Ascensión del Señor' },
    { date: '2024-06-03', name: 'Corpus Christi', type: 'religious', description: 'Solemnidad del Cuerpo y Sangre de Cristo' },
    { date: '2024-06-10', name: 'Sagrado Corazón', type: 'religious', description: 'Sagrado Corazón de Jesús' },
    { date: '2024-07-20', name: 'Día de la Independencia', type: 'national', description: 'Grito de Independencia de Colombia' },
    { date: '2024-08-07', name: 'Batalla de Boyacá', type: 'national', description: 'Batalla de Boyacá' },
    { date: '2024-08-19', name: 'Asunción de la Virgen', type: 'religious', description: 'Asunción de la Virgen María' },
    { date: '2024-10-14', name: 'Día de la Raza', type: 'national', description: 'Día de la Raza' },
    { date: '2024-11-04', name: 'Todos los Santos', type: 'religious', description: 'Día de Todos los Santos' },
    { date: '2024-11-11', name: 'Independencia de Cartagena', type: 'regional', description: 'Independencia de Cartagena' },
    { date: '2024-12-08', name: 'Inmaculada Concepción', type: 'religious', description: 'Inmaculada Concepción de María' },
    { date: '2024-12-25', name: 'Navidad', type: 'religious', description: 'Nacimiento de Jesucristo' }
  ];

  // Major Colombian cities
  const colombianCitiesData: ColombianCity[] = [
    { name: 'Bogotá', department: 'Cundinamarca', lat: 4.6097, lng: -74.0817, temp: 18, weather: 'Clouds', icon: '02d' },
    { name: 'Medellín', department: 'Antioquia', lat: 6.2442, lng: -75.5812, temp: 24, weather: 'Clear', icon: '01d' },
    { name: 'Cali', department: 'Valle del Cauca', lat: 3.4516, lng: -76.5320, temp: 28, weather: 'Clear', icon: '01d' },
    { name: 'Barranquilla', department: 'Atlántico', lat: 10.9685, lng: -74.7813, temp: 32, weather: 'Clear', icon: '01d' },
    { name: 'Cartagena', department: 'Bolívar', lat: 10.3910, lng: -75.4794, temp: 30, weather: 'Clear', icon: '01d' },
    { name: 'Bucaramanga', department: 'Santander', lat: 7.1193, lng: -73.1227, temp: 26, weather: 'Clouds', icon: '02d' },
    { name: 'Pereira', department: 'Risaralda', lat: 4.8133, lng: -75.6961, temp: 22, weather: 'Clouds', icon: '02d' },
    { name: 'Santa Marta', department: 'Magdalena', lat: 11.2408, lng: -74.2110, temp: 29, weather: 'Clear', icon: '01d' }
  ];

  useEffect(() => {
    setColombianCities(colombianCitiesData);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getHolidayForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return colombianHolidays.find(holiday => holiday.date === dateStr);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getSeasonInfo = (month: number) => {
    const seasons = {
      0: { name: 'Verano', icon: '☀️', description: 'Temporada seca en la mayoría del país' },
      1: { name: 'Verano', icon: '☀️', description: 'Temporada seca en la mayoría del país' },
      2: { name: 'Verano', icon: '☀️', description: 'Temporada seca en la mayoría del país' },
      3: { name: 'Invierno', icon: '🌧️', description: 'Primera temporada de lluvias' },
      4: { name: 'Invierno', icon: '🌧️', description: 'Primera temporada de lluvias' },
      5: { name: 'Invierno', icon: '🌧️', description: 'Primera temporada de lluvias' },
      6: { name: 'Verano', icon: '☀️', description: 'Temporada seca intermedia' },
      7: { name: 'Verano', icon: '☀️', description: 'Temporada seca intermedia' },
      8: { name: 'Verano', icon: '☀️', description: 'Temporada seca intermedia' },
      9: { name: 'Invierno', icon: '🌧️', description: 'Segunda temporada de lluvias' },
      10: { name: 'Invierno', icon: '🌧️', description: 'Segunda temporada de lluvias' },
      11: { name: 'Invierno', icon: '🌧️', description: 'Segunda temporada de lluvias' }
    };
    return seasons[month as keyof typeof seasons];
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const days = getDaysInMonth(currentDate);
  const seasonInfo = getSeasonInfo(currentDate.getMonth());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-blue-500 to-red-500 rounded-3xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <FlagIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Calendario de Colombia</h2>
              <p className="text-white/90">Feriados, estaciones y ciudades principales</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{seasonInfo.icon} {seasonInfo.name}</div>
            <div className="text-sm text-white/80">{seasonInfo.description}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Calendario {currentDate.getFullYear()}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 text-slate-600" />
              </button>
              <span className="text-lg font-semibold text-slate-800 min-w-[120px] text-center">
                {monthNames[currentDate.getMonth()]}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center text-sm font-semibold text-slate-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-12"></div>;
              }

              const holiday = getHolidayForDate(day);
              const isCurrentDay = isToday(day);
              const isSelectedDay = isSelected(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  className={`h-12 text-sm rounded-lg transition-all duration-200 relative ${
                    isSelectedDay
                      ? 'bg-indigo-500 text-white'
                      : isCurrentDay
                      ? 'bg-blue-100 text-blue-800 font-bold'
                      : holiday
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span>{day.getDate()}</span>
                    {holiday && (
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Selected Date Info */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Información del Día</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="w-5 h-5 text-indigo-500" />
                <div>
                  <div className="font-semibold text-slate-800">
                    {selectedDate.toLocaleDateString('es-CO', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
              
              {getHolidayForDate(selectedDate) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-red-800">
                        {getHolidayForDate(selectedDate)?.name}
                      </div>
                      <div className="text-sm text-red-600">
                        {getHolidayForDate(selectedDate)?.description}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Colombian Cities Weather */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Ciudades Principales</h3>
            <div className="space-y-3">
              {colombianCities.map((city, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center">
                      <WeatherIcon iconCode={city.icon} size="sm" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{city.name}</div>
                      <div className="text-sm text-slate-600">{city.department}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800">{city.temp}°C</div>
                    <div className="text-sm text-slate-600">{city.weather}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Season Info */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Estación Actual</h3>
            <div className="text-center">
              <div className="text-4xl mb-2">{seasonInfo.icon}</div>
              <div className="text-xl font-bold text-slate-800 mb-2">{seasonInfo.name}</div>
              <div className="text-sm text-slate-600">{seasonInfo.description}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon,
  GlobeAltIcon,
  BellIcon,
  ShieldCheckIcon,
  CogIcon,
  TrashIcon,
  KeyIcon,
  MapPinIcon,
  ClockIcon,
  ChartBarIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SettingsState {
  // Appearance
  theme: 'light' | 'dark' | 'auto';
  colorScheme: 'blue' | 'green' | 'purple' | 'red';
  density: 'compact' | 'normal' | 'spacious';
  fontSize: 'small' | 'medium' | 'large';
  
  // Weather
  temperatureUnit: 'celsius' | 'fahrenheit';
  windSpeedUnit: 'kmh' | 'ms' | 'mph';
  pressureUnit: 'hpa' | 'mmhg' | 'inhg';
  locationMode: 'auto' | 'manual';
  updateFrequency: '5' | '10' | '15' | '30';
  
  // Notifications
  weatherAlerts: boolean;
  rainAlerts: boolean;
  stormAlerts: boolean;
  temperatureAlerts: boolean;
  soundEnabled: boolean;
  notificationFrequency: 'immediate' | 'hourly' | 'daily';
  
  // Regional
  language: 'es' | 'en' | 'pt';
  dateFormat: 'ddmmyyyy' | 'mmddyyyy';
  timeFormat: '12h' | '24h';
  timezone: 'auto' | 'manual';
  
  // Privacy & Data
  locationPermission: boolean;
  dataRetention: '7' | '30' | '90' | 'unlimited';
  clearHistory: boolean;
  apiKey: string;
  
  // Performance
  cacheEnabled: boolean;
  offlineMode: boolean;
  animationsEnabled: boolean;
  imageQuality: 'high' | 'medium' | 'low';
}

export const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    // Appearance
    theme: 'auto',
    colorScheme: 'blue',
    density: 'normal',
    fontSize: 'medium',
    
    // Weather
    temperatureUnit: 'celsius',
    windSpeedUnit: 'kmh',
    pressureUnit: 'hpa',
    locationMode: 'auto',
    updateFrequency: '15',
    
    // Notifications
    weatherAlerts: true,
    rainAlerts: true,
    stormAlerts: true,
    temperatureAlerts: false,
    soundEnabled: true,
    notificationFrequency: 'hourly',
    
    // Regional
    language: 'es',
    dateFormat: 'ddmmyyyy',
    timeFormat: '24h',
    timezone: 'auto',
    
    // Privacy & Data
    locationPermission: true,
    dataRetention: '30',
    clearHistory: false,
    apiKey: '',
    
    // Performance
    cacheEnabled: true,
    offlineMode: false,
    animationsEnabled: true,
    imageQuality: 'high'
  });

  const [activeTab, setActiveTab] = useState('appearance');
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('weatherAppSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSetting = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('weatherAppSettings', JSON.stringify(settings));
    setHasChanges(false);
    // Show success notification
    alert('Configuración guardada exitosamente');
  };

  const resetSettings = () => {
    if (confirm('¿Estás seguro de que quieres restaurar la configuración por defecto?')) {
      localStorage.removeItem('weatherAppSettings');
      window.location.reload();
    }
  };

  const clearData = () => {
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos guardados?')) {
      localStorage.clear();
      alert('Datos eliminados exitosamente');
    }
  };

  const tabs = [
    { id: 'appearance', label: 'Apariencia', icon: SunIcon },
    { id: 'weather', label: 'Clima', icon: GlobeAltIcon },
    { id: 'notifications', label: 'Notificaciones', icon: BellIcon },
    { id: 'regional', label: 'Regional', icon: MapPinIcon },
    { id: 'privacy', label: 'Privacidad', icon: ShieldCheckIcon },
    { id: 'performance', label: 'Rendimiento', icon: ChartBarIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <CogIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Configuración</h2>
              <p className="text-white/90">Personaliza tu experiencia con el clima</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {hasChanges && (
              <button
                onClick={saveSettings}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors duration-200 flex items-center space-x-2"
              >
                <CheckIcon className="w-5 h-5" />
                <span>Guardar</span>
              </button>
            )}
            <button
              onClick={resetSettings}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-200 flex items-center space-x-2"
            >
              <XMarkIcon className="w-5 h-5" />
              <span>Restaurar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Configuración de Apariencia</h3>
                
                {/* Theme */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Tema</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'Claro', icon: SunIcon },
                      { value: 'dark', label: 'Oscuro', icon: MoonIcon },
                      { value: 'auto', label: 'Automático', icon: ComputerDesktopIcon }
                    ].map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <button
                          key={theme.value}
                          onClick={() => updateSetting('theme', theme.value)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            settings.theme === theme.value
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Icon className="w-6 h-6 mx-auto mb-2" />
                          <div className="text-sm font-medium">{theme.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Esquema de Colores</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { value: 'blue', label: 'Azul', color: 'bg-blue-500' },
                      { value: 'green', label: 'Verde', color: 'bg-green-500' },
                      { value: 'purple', label: 'Púrpura', color: 'bg-purple-500' },
                      { value: 'red', label: 'Rojo', color: 'bg-red-500' }
                    ].map((scheme) => (
                      <button
                        key={scheme.value}
                        onClick={() => updateSetting('colorScheme', scheme.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          settings.colorScheme === scheme.value
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-8 h-8 ${scheme.color} rounded-full mx-auto mb-2`}></div>
                        <div className="text-sm font-medium text-slate-700">{scheme.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Density */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Densidad de Interfaz</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'compact', label: 'Compacto' },
                      { value: 'normal', label: 'Normal' },
                      { value: 'spacious', label: 'Espacioso' }
                    ].map((density) => (
                      <button
                        key={density.value}
                        onClick={() => updateSetting('density', density.value)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          settings.density === density.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-medium">{density.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Tamaño de Fuente</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'small', label: 'Pequeño' },
                      { value: 'medium', label: 'Mediano' },
                      { value: 'large', label: 'Grande' }
                    ].map((size) => (
                      <button
                        key={size.value}
                        onClick={() => updateSetting('fontSize', size.value)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          settings.fontSize === size.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-medium">{size.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Weather Settings */}
            {activeTab === 'weather' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Configuración del Clima</h3>
                
                {/* Temperature Unit */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Unidad de Temperatura</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'celsius', label: 'Celsius (°C)' },
                      { value: 'fahrenheit', label: 'Fahrenheit (°F)' }
                    ].map((unit) => (
                      <button
                        key={unit.value}
                        onClick={() => updateSetting('temperatureUnit', unit.value)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          settings.temperatureUnit === unit.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-medium">{unit.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wind Speed Unit */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Unidad de Velocidad del Viento</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'kmh', label: 'km/h' },
                      { value: 'ms', label: 'm/s' },
                      { value: 'mph', label: 'mph' }
                    ].map((unit) => (
                      <button
                        key={unit.value}
                        onClick={() => updateSetting('windSpeedUnit', unit.value)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          settings.windSpeedUnit === unit.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-medium">{unit.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Update Frequency */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Frecuencia de Actualización</label>
                  <select
                    value={settings.updateFrequency}
                    onChange={(e) => updateSetting('updateFrequency', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="5">Cada 5 minutos</option>
                    <option value="10">Cada 10 minutos</option>
                    <option value="15">Cada 15 minutos</option>
                    <option value="30">Cada 30 minutos</option>
                  </select>
                </div>

                {/* API Key */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Clave API de OpenWeather</label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={settings.apiKey}
                      onChange={(e) => updateSetting('apiKey', e.target.value)}
                      placeholder="Ingresa tu clave API"
                      className="w-full p-3 pr-12 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showApiKey ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">Obtén tu clave gratuita en openweathermap.org</p>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Configuración de Notificaciones</h3>
                
                {/* Weather Alerts */}
                <div className="space-y-4">
                  {[
                    { key: 'weatherAlerts', label: 'Alertas de Clima Generales', description: 'Notificaciones sobre cambios importantes en el clima' },
                    { key: 'rainAlerts', label: 'Alertas de Lluvia', description: 'Avisos cuando se pronostica lluvia' },
                    { key: 'stormAlerts', label: 'Alertas de Tormentas', description: 'Advertencias sobre tormentas y condiciones severas' },
                    { key: 'temperatureAlerts', label: 'Alertas de Temperatura', description: 'Notificaciones sobre temperaturas extremas' },
                    { key: 'soundEnabled', label: 'Sonidos de Notificación', description: 'Reproducir sonidos para las notificaciones' }
                  ].map((alert) => (
                    <div key={alert.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <div className="font-medium text-slate-800">{alert.label}</div>
                        <div className="text-sm text-slate-600">{alert.description}</div>
                      </div>
                      <button
                        onClick={() => updateSetting(alert.key as keyof SettingsState, !settings[alert.key as keyof SettingsState])}
                        className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                          settings[alert.key as keyof SettingsState] ? 'bg-indigo-500' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                          settings[alert.key as keyof SettingsState] ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Notification Frequency */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Frecuencia de Notificaciones</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'immediate', label: 'Inmediata' },
                      { value: 'hourly', label: 'Cada hora' },
                      { value: 'daily', label: 'Diaria' }
                    ].map((freq) => (
                      <button
                        key={freq.value}
                        onClick={() => updateSetting('notificationFrequency', freq.value)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          settings.notificationFrequency === freq.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-medium">{freq.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Regional Settings */}
            {activeTab === 'regional' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Configuración Regional</h3>
                
                {/* Language */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Idioma</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'es', label: 'Español' },
                      { value: 'en', label: 'English' },
                      { value: 'pt', label: 'Português' }
                    ].map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => updateSetting('language', lang.value)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          settings.language === lang.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-medium">{lang.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Format */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Formato de Fecha</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'ddmmyyyy', label: 'DD/MM/YYYY' },
                      { value: 'mmddyyyy', label: 'MM/DD/YYYY' }
                    ].map((format) => (
                      <button
                        key={format.value}
                        onClick={() => updateSetting('dateFormat', format.value)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          settings.dateFormat === format.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-medium">{format.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Format */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Formato de Hora</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: '12h', label: '12 horas (AM/PM)' },
                      { value: '24h', label: '24 horas' }
                    ].map((format) => (
                      <button
                        key={format.value}
                        onClick={() => updateSetting('timeFormat', format.value)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          settings.timeFormat === format.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-medium">{format.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Privacidad y Datos</h3>
                
                {/* Location Permission */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <div className="font-medium text-slate-800">Permisos de Ubicación</div>
                    <div className="text-sm text-slate-600">Permitir acceso a la ubicación para obtener el clima local</div>
                  </div>
                  <button
                    onClick={() => updateSetting('locationPermission', !settings.locationPermission)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                      settings.locationPermission ? 'bg-indigo-500' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      settings.locationPermission ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>

                {/* Data Retention */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Retención de Datos</label>
                  <select
                    value={settings.dataRetention}
                    onChange={(e) => updateSetting('dataRetention', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="7">7 días</option>
                    <option value="30">30 días</option>
                    <option value="90">90 días</option>
                    <option value="unlimited">Sin límite</option>
                  </select>
                </div>

                {/* Clear Data */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Gestión de Datos</label>
                  <button
                    onClick={clearData}
                    className="w-full p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl hover:bg-red-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <TrashIcon className="w-5 h-5" />
                    <span>Eliminar Todos los Datos</span>
                  </button>
                </div>
              </div>
            )}

            {/* Performance Settings */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Configuración de Rendimiento</h3>
                
                {/* Performance Options */}
                <div className="space-y-4">
                  {[
                    { key: 'cacheEnabled', label: 'Habilitar Caché', description: 'Almacenar datos localmente para acceso más rápido' },
                    { key: 'offlineMode', label: 'Modo Offline', description: 'Usar datos guardados cuando no hay conexión' },
                    { key: 'animationsEnabled', label: 'Animaciones', description: 'Mostrar animaciones y transiciones' }
                  ].map((option) => (
                    <div key={option.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <div className="font-medium text-slate-800">{option.label}</div>
                        <div className="text-sm text-slate-600">{option.description}</div>
                      </div>
                      <button
                        onClick={() => updateSetting(option.key as keyof SettingsState, !settings[option.key as keyof SettingsState])}
                        className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                          settings[option.key as keyof SettingsState] ? 'bg-indigo-500' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                          settings[option.key as keyof SettingsState] ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Image Quality */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Calidad de Imágenes</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'high', label: 'Alta' },
                      { value: 'medium', label: 'Media' },
                      { value: 'low', label: 'Baja' }
                    ].map((quality) => (
                      <button
                        key={quality.value}
                        onClick={() => updateSetting('imageQuality', quality.value)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          settings.imageQuality === quality.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-medium">{quality.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

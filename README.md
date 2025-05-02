# Panel del Clima

Una aplicación moderna de panel del clima construida con React, TypeScript y Tailwind CSS. La app muestra las condiciones climáticas actuales y pronósticos para cualquier ciudad, con funciones como modo oscuro, geolocalización y gráficos interactivos.

## Caracteristicas

- 🔍 Búsqueda del clima por nombre de ciudad
- 📍 Detección automática de geolocalización
- 📊 Gráficos interactivos del clima
- 🌡️ Condiciones climáticas actuales
- 📈 Pronóstico de 24 horas
- 🌓 Soporte para modo oscuro
- 📱  Diseño responsivo

## Prerequisitos

- Node.js (v14 or higher)
- npm or yarn
- OpenWeather API key

## Configuracion

1. Clonar repositorio:
```bash
git clone <repository-url>
cd weather-dashboard
```

2. Instalacion de dependencias:
```bash
npm install
```
3. Crea un archivo `.env` en el directorio raíz y agrega tu clave API de OpenWeather:
```
VITE_OPENWEATHER_API_KEY=your_api_key_here
```
Para obtener una clave API:

1.Regístrate en OpenWeather[OpenWeather](https://openweathermap.org/)

2.Ve a la página de tu cuenta

3.Copia tu clave API

4.Pégala en el archivo .env

## Desarrollo
Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`

## Construcción para Producción
Para crear una versión de producción:

```bash
npm run build
```

Los archivos construidos estarán en el directorio dist.

## Tecnologias Usadas

- React
- TypeScript
- Vite
- Tailwind CSS
- Chart.js
- OpenWeather API
- Heroicons

## License

MIT

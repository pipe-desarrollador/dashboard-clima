# Weather Dashboard

A modern weather dashboard application built with React, TypeScript, and Tailwind CSS. The app displays current weather conditions and forecasts for any city, with features like dark mode, geolocation, and interactive charts.

## Features

- 🔍 Search weather by city name
- 📍 Automatic geolocation detection
- 📊 Interactive weather charts
- 🌡️ Current weather conditions
- 📈 24-hour forecast
- 🌓 Dark mode support
- 📱 Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeather API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenWeather API key:
```
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

To get an API key:
1. Sign up at [OpenWeather](https://openweathermap.org/)
2. Go to your account page
3. Copy your API key
4. Paste it in the `.env` file

## Development

To start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Chart.js
- OpenWeather API
- Heroicons

## License

MIT

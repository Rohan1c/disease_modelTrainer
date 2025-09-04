interface WeatherWidgetProps {
  location: string;
}

function WeatherWidget({ location }: WeatherWidgetProps) {
  // Mock weather data - in a real app, this would come from a weather API
  const weatherData = {
    temperature: 24,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    precipitation: 20,
    uvIndex: 6
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Weather</h3>
          <p className="text-blue-100 text-sm">{location}</p>
        </div>
        <div className="text-3xl">🌤️</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{weatherData.temperature}°C</div>
          <div className="text-blue-100 text-sm">{weatherData.condition}</div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-blue-100">Humidity</span>
            <span>{weatherData.humidity}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-blue-100">Wind</span>
            <span>{weatherData.windSpeed} km/h</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-blue-100">Rain</span>
            <span>{weatherData.precipitation}%</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-400 bg-opacity-30 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm">UV Index</span>
          <span className="font-semibold">{weatherData.uvIndex}/10</span>
        </div>
        <div className="w-full bg-blue-300 bg-opacity-30 rounded-full h-2 mt-2">
          <div 
            className="bg-white h-2 rounded-full" 
            style={{ width: `${(weatherData.uvIndex / 10) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default WeatherWidget;
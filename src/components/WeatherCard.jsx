const WEATHER_ICONS = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  51: "🌧️",
  61: "🌧️",
  71: "❄️",
  80: "🌦️",
  95: "⛈️",
};

const WeatherCard = ({ weather, city }) => {
  const c = weather.current;
  // FIX 1: was c.temprature_2 (typo + wrong field name) → c.temperature_2m
  const icon = WEATHER_ICONS[c.weathercode] || "🌡️";

  return (
    // FIX 2: was "wether-card" (typo) → "weather-card"
    <div className="weather-card">
      <div className="weather-icon">{icon}</div>
      <div className="weather-temp">{Math.round(c.temperature_2m)} °C</div>
      <div className="weather-city">
        {city.name}, {city.country}
      </div>
      <div className="weather-details">
        <span>💧 {c.relative_humidity_2m}%</span>
        <span>💨 {c.wind_speed_10m} km/h</span>
      </div>
    </div>
  );
};

export default WeatherCard;
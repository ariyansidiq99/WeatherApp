import { useEffect, useState } from "react";
import WeatherCard from "./WeatherCard";

const WeatherApp = () => {
  const [input, setInput] = useState("New Delhi");
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("New Delhi");

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function fetchWeather() {
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`,
          { signal: controller.signal }
        );
        const geoData = await geoRes.json();
        if (!geoData.results?.length) throw new Error(`City '${query}' not found`);
        const location = geoData.results[0];

        const wxRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode&timezone=auto`,
          { signal: controller.signal }
        );
        const wxData = await wxRes.json();
        setCity(location);
        setWeather(wxData);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
    return () => controller.abort();
  }, [query]);

  function handleSearch() {
    const trimmed = input.trim();
    if (trimmed) setQuery(trimmed);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="weather-app">
      <div className="search-form">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search City..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <div className="skeleton weather-skeleton" />}
      {error && <div className="error">{error}</div>}
      {!loading && !error && weather && city && (
        <WeatherCard weather={weather} city={city} />
      )}
    </div>
  );
};

export default WeatherApp;
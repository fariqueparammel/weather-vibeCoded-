import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaExchangeAlt, FaChartLine } from "react-icons/fa";

import SearchBar from "./SearchBar";
import CurrentWeather from "./CurrentWeather";
import Forecast from "./Forecast";
import WeatherBackground from "./WeatherBackground";
import InstallPrompt from "./InstallPrompt";
import CityComparison from "./CityComparison";
import useGeolocation from "../../hooks/useGeolocation";
import {
  getCurrentWeatherByCity,
  getCurrentWeatherByCoords,
  getForecastByCity,
  getForecastByCoords,
  WeatherData,
  ForecastData,
} from "../../services/weatherService";

// Default city to show when the app loads
const DEFAULT_CITY = "London";

const Weather: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherType, setWeatherType] = useState<string>("clear");
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [hoveredForecastWeatherId, setHoveredForecastWeatherId] = useState<
    number | null
  >(null);
  const [originalWeatherType, setOriginalWeatherType] =
    useState<string>("clear");

  const geolocation = useGeolocation();

  // Determine weather type for animations
  const determineWeatherType = (weatherId: number) => {
    if (weatherId >= 200 && weatherId < 300) return "thunderstorm";
    if (weatherId >= 300 && weatherId < 600) return "rain";
    if (weatherId >= 600 && weatherId < 700) return "snow";
    if (weatherId === 800) return "clear";
    if (weatherId > 800) return "clouds";
    return "clear";
  };

  // Handle hover on forecast card
  const handleHoverForecast = (weatherId: number | null) => {
    if (weatherId) {
      // Save original weather type if not already saved
      if (hoveredForecastWeatherId === null) {
        setOriginalWeatherType(weatherType);
      }
      // Set weather type based on hovered forecast
      setWeatherType(determineWeatherType(weatherId));
      setHoveredForecastWeatherId(weatherId);
    } else {
      // Restore original weather type when hover ends
      if (hoveredForecastWeatherId !== null) {
        setWeatherType(originalWeatherType);
        setHoveredForecastWeatherId(null);
      }
    }
  };

  // Fetch weather by city name
  const fetchWeatherByCity = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const weatherData = await getCurrentWeatherByCity(city);
      const forecastData = await getForecastByCity(city);

      setCurrentWeather(weatherData);
      setForecast(forecastData);
      const newWeatherType = determineWeatherType(weatherData.weather[0].id);
      setWeatherType(newWeatherType);
      setOriginalWeatherType(newWeatherType);
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to fetch weather data. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);

      // Clear current weather data on error
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const weatherData = await getCurrentWeatherByCoords(lat, lon);
      const forecastData = await getForecastByCoords(lat, lon);

      setCurrentWeather(weatherData);
      setForecast(forecastData);
      const newWeatherType = determineWeatherType(weatherData.weather[0].id);
      setWeatherType(newWeatherType);
      setOriginalWeatherType(newWeatherType);
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to fetch weather data. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);

      // Clear current weather data on error
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  // Load initial weather data
  useEffect(() => {
    // Try to load weather for default city on initial load
    if (!currentWeather && !loading) {
      fetchWeatherByCity(DEFAULT_CITY);
    }
  }, []);

  // Use geolocation if available and user hasn't searched yet
  useEffect(() => {
    if (geolocation.position && !currentWeather && !loading && !error) {
      fetchWeatherByCoords(geolocation.position.lat, geolocation.position.lon);
    }
  }, [geolocation.position]);

  return (
    <div className="weather-app">
      <WeatherBackground weatherType={weatherType} />

      <div className="container py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0 app-title">
              Weather <span className="text-primary">Forecast</span>
            </h1>

            <div className="view-toggle futuristic-toggle">
              <button
                className={`toggle-button ${!showComparison ? "active" : ""}`}
                onClick={() => setShowComparison(false)}
              >
                <div className="toggle-icon">
                  <FaChartLine />
                </div>
                <span>Forecast</span>
              </button>
              <button
                className={`toggle-button ${showComparison ? "active" : ""}`}
                onClick={() => setShowComparison(true)}
              >
                <div className="toggle-icon">
                  <FaExchangeAlt />
                </div>
                <span>Compare Cities</span>
              </button>
            </div>
          </div>

          <SearchBar onSearch={fetchWeatherByCity} />

          {loading && (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading weather data...</p>
            </div>
          )}

          {error && !loading && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!showComparison ? (
            // Show regular forecast view
            <>
              {currentWeather && !loading && (
                <CurrentWeather data={currentWeather} />
              )}

              {forecast && !loading && (
                <Forecast
                  data={forecast}
                  onHoverForecast={handleHoverForecast}
                />
              )}
            </>
          ) : (
            // Show city comparison view
            <>
              {currentWeather && !loading && (
                <CityComparison initialCity={currentWeather} />
              )}
            </>
          )}
        </motion.div>
      </div>

      <InstallPrompt />
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Weather;

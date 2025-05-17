import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaTimes,
  FaSearch,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
} from "react-icons/fa";
import {
  WeatherData,
  getCurrentWeatherByCity,
} from "../../services/weatherService";
import {
  getLocationSuggestions,
  formatLocationSuggestion,
  LocationSuggestion,
} from "../../services/locationService";
import { toast } from "react-toastify";

interface CityComparisonProps {
  initialCity?: WeatherData;
}

const CityComparison: React.FC<CityComparisonProps> = ({ initialCity }) => {
  const [cities, setCities] = useState<WeatherData[]>(
    initialCity ? [initialCity] : []
  );
  const [newCity, setNewCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch location suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (newCity.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        // Add a small delay to avoid too many API calls while typing
        const timeoutId = setTimeout(async () => {
          const results = await getLocationSuggestions(newCity);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
          setIsLoadingSuggestions(false);
        }, 500);

        return () => clearTimeout(timeoutId);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [newCity]);

  // Handle suggestion click
  const handleSuggestionClick = async (suggestion: LocationSuggestion) => {
    const locationName = suggestion.name;
    setNewCity(locationName);
    setShowSuggestions(false);

    // Automatically add the city
    if (
      cities.some(
        (city) => city.name.toLowerCase() === locationName.toLowerCase()
      )
    ) {
      toast.info(`${locationName} is already in your comparison`);
      return;
    }

    setLoading(true);
    try {
      const weatherData = await getCurrentWeatherByCity(locationName);
      setCities([...cities, weatherData]);
      setNewCity("");
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch city data");
    } finally {
      setLoading(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Add a new city to the comparison
  const addCity = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCity.trim()) {
      toast.warning("Please enter a city name");
      return;
    }

    // Check if we already have this city
    if (
      cities.some((city) => city.name.toLowerCase() === newCity.toLowerCase())
    ) {
      toast.info(`${newCity} is already in your comparison`);
      setNewCity("");
      return;
    }

    setLoading(true);

    try {
      const weatherData = await getCurrentWeatherByCity(newCity);
      setCities([...cities, weatherData]);
      setNewCity("");
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch city data");
    } finally {
      setLoading(false);
    }
  };

  // Remove a city from the comparison
  const removeCity = (index: number) => {
    setCities(cities.filter((_, i) => i !== index));
  };

  // Format temperature
  const formatTemp = (temp: number) => {
    return `${Math.round(temp)}°C`;
  };

  // Format time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="city-comparison mb-5">
      <h3 className="mb-3">Compare Cities</h3>

      {/* Add city form */}
      <div
        className="city-search-container position-relative mb-4"
        ref={searchContainerRef}
      >
        <form onSubmit={addCity} className="mb-2">
          <div className="input-group">
            <span className="input-group-text futuristic-input-icon">
              <FaGlobe />
            </span>
            <input
              type="text"
              className="form-control futuristic-input"
              placeholder="Add a city to compare..."
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />
            <button
              className="btn btn-primary futuristic-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <>
                  <FaPlus className="me-1" /> Add
                </>
              )}
            </button>
          </div>
        </form>

        {/* Location Suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              className="location-suggestions position-absolute w-100 bg-glass shadow-lg rounded-lg mt-1 p-3 z-3 futuristic-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h6 className="text-primary mb-3 d-flex align-items-center">
                <FaMapMarkerAlt className="me-2" />
                <span>Location Suggestions</span>
                {isLoadingSuggestions && (
                  <span
                    className="spinner-border spinner-border-sm ms-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
              </h6>
              <div className="suggestions-list custom-scrollbar">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    className="suggestion-item"
                    whileHover={{
                      backgroundColor: "rgba(74, 111, 165, 0.1)",
                      scale: 1.02,
                      transition: { duration: 0.1 },
                    }}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="d-flex align-items-center">
                      <div className="suggestion-icon">
                        <FaCity />
                      </div>
                      <div className="suggestion-details">
                        <div className="suggestion-name">{suggestion.name}</div>
                        <div className="suggestion-country">
                          {suggestion.state ? `${suggestion.state}, ` : ""}
                          {suggestion.country}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {cities.length === 0 ? (
        <div className="alert alert-info futuristic-alert">
          <div className="alert-icon">
            <FaCity size={24} />
          </div>
          <div className="alert-content">
            <h5>No Cities Added</h5>
            <p>Add cities above to compare their weather conditions</p>
          </div>
        </div>
      ) : (
        <div className="comparison-container">
          <div className="table-responsive futuristic-table-container">
            <table className="table comparison-table futuristic-table">
              <thead>
                <tr>
                  <th>City</th>
                  <th>Temperature</th>
                  <th>Feels Like</th>
                  <th>Weather</th>
                  <th>Humidity</th>
                  <th>Wind</th>
                  <th>Pressure</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {cities.map((city, index) => (
                    <motion.tr
                      key={`${city.name}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="city-row"
                      whileHover={{
                        backgroundColor: "rgba(74, 111, 165, 0.05)",
                        transition: { duration: 0.1 },
                      }}
                    >
                      <td>
                        <div className="d-flex align-items-center city-cell">
                          <div className="city-icon-container">
                            <img
                              src={`https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`}
                              alt={city.weather[0].description}
                              className="city-weather-icon"
                            />
                          </div>
                          <div className="city-info">
                            <div className="city-name">{city.name}</div>
                            <div className="city-country">
                              {city.sys.country}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle temperature-cell">
                        <div className="temperature-value">
                          {Math.round(city.main.temp)}°
                        </div>
                        <div className="temperature-unit">C</div>
                      </td>
                      <td className="align-middle">
                        <div className="feels-like-value">
                          {Math.round(city.main.feels_like)}°C
                        </div>
                      </td>
                      <td className="align-middle text-capitalize weather-cell">
                        <div className="weather-description">
                          {city.weather[0].description}
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="humidity-container">
                          <div className="humidity-value">
                            {city.main.humidity}%
                          </div>
                          <div className="humidity-bar">
                            <div
                              className="humidity-fill"
                              style={{ width: `${city.main.humidity}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="wind-value">{city.wind.speed} m/s</div>
                      </td>
                      <td className="align-middle">
                        <div className="pressure-value">
                          {city.main.pressure} hPa
                        </div>
                      </td>
                      <td className="align-middle">
                        <button
                          className="btn btn-sm btn-remove futuristic-button-remove"
                          onClick={() => removeCity(index)}
                          aria-label="Remove city"
                        >
                          <FaTimes />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityComparison;

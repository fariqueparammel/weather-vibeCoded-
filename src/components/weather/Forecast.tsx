import React, { useState } from "react";
import { motion } from "framer-motion";
import { ForecastData } from "../../services/weatherService";
import { FaChevronLeft, FaChevronRight, FaCloudRain } from "react-icons/fa";

interface ForecastProps {
  data: ForecastData;
  onHoverForecast?: (weatherId: number | null) => void;
}

const Forecast: React.FC<ForecastProps> = ({ data, onHoverForecast }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const itemsPerPage = 8; // Show 8 hours per page
  const totalPages = Math.ceil(data.list.length / itemsPerPage);

  // Handle mouse enter on forecast card
  const handleMouseEnter = (index: number) => {
    setHoveredCardIndex(index);
    const currentItems = getCurrentItems();
    const item = currentItems[index];
    if (onHoverForecast && item) {
      onHoverForecast(item.weather[0].id);
    }
  };

  // Handle mouse leave on forecast card
  const handleMouseLeave = () => {
    setHoveredCardIndex(null);
    if (onHoverForecast) {
      onHoverForecast(null);
    }
  };

  // Format time in 24-hour format
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Get current items for pagination
  const getCurrentItems = () => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return data.list.slice(start, end);
  };

  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="forecast-container mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Hourly Forecast</h3>
        <div className="pagination-controls">
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={prevPage}
            disabled={currentPage === 0}
          >
            <FaChevronLeft /> Previous
          </button>
          <span className="mx-2">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            className="btn btn-sm btn-outline-primary ms-2"
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
          >
            Next <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="row">
        {getCurrentItems().map((item, index) => (
          <div className="col-md-3 col-sm-6 mb-3" key={index}>
            <motion.div
              className={`forecast-card card h-100 ${
                hoveredCardIndex === index ? "hovered" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                transition: { duration: 0.2 },
              }}
            >
              <div className="card-body text-center">
                <h5 className="card-title">{formatDate(item.dt)}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {formatTime(item.dt)}
                </h6>

                <div className="forecast-icon my-2">
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt={item.weather[0].description}
                  />
                </div>

                <p className="temperature mb-1">
                  {Math.round(item.main.temp)}°C
                </p>
                <p className="weather-description text-capitalize small">
                  {item.weather[0].description}
                </p>

                <div className="forecast-details small text-muted">
                  <div>Humidity: {item.main.humidity}%</div>
                  <div>Wind: {item.wind.speed} m/s</div>
                  {item.pop > 0 && (
                    <div className="precipitation">
                      <FaCloudRain className="me-1" />
                      Precipitation: {Math.round(item.pop * 100)}%
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;

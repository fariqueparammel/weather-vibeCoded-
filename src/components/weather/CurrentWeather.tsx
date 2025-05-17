import React from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '../../services/weatherService';
import { FaTemperatureHigh, FaWind, FaWater, FaCompass } from 'react-icons/fa';

interface CurrentWeatherProps {
  data: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get weather icon class based on weather condition
  const getWeatherIconClass = (weatherId: number) => {
    if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
    if (weatherId >= 300 && weatherId < 400) return 'drizzle';
    if (weatherId >= 500 && weatherId < 600) return 'rain';
    if (weatherId >= 600 && weatherId < 700) return 'snow';
    if (weatherId >= 700 && weatherId < 800) return 'atmosphere';
    if (weatherId === 800) return 'clear';
    if (weatherId > 800) return 'clouds';
    return 'default';
  };

  const weatherClass = getWeatherIconClass(data.weather[0].id);

  return (
    <motion.div 
      className={`current-weather-card card mb-4 weather-${weatherClass}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h2 className="city-name mb-0">{data.name}, {data.sys.country}</h2>
            <p className="text-muted">{formatDate(data.dt)}</p>
            
            <div className="d-flex align-items-center mb-4">
              <motion.div 
                className="weather-icon me-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <img 
                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} 
                  alt={data.weather[0].description} 
                  width="100"
                />
              </motion.div>
              <div>
                <h1 className="temperature display-3">
                  {Math.round(data.main.temp)}°C
                </h1>
                <p className="weather-description text-capitalize">
                  {data.weather[0].description}
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="weather-details">
              <motion.div 
                className="detail-item mb-3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <FaTemperatureHigh className="detail-icon" />
                <span className="detail-label">Feels like:</span>
                <span className="detail-value">{Math.round(data.main.feels_like)}°C</span>
              </motion.div>
              
              <motion.div 
                className="detail-item mb-3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <FaWind className="detail-icon" />
                <span className="detail-label">Wind:</span>
                <span className="detail-value">{data.wind.speed} m/s</span>
              </motion.div>
              
              <motion.div 
                className="detail-item mb-3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <FaWater className="detail-icon" />
                <span className="detail-label">Humidity:</span>
                <span className="detail-value">{data.main.humidity}%</span>
              </motion.div>
              
              <motion.div 
                className="detail-item"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <FaCompass className="detail-icon" />
                <span className="detail-label">Pressure:</span>
                <span className="detail-value">{data.main.pressure} hPa</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentWeather;

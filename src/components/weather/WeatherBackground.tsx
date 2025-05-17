import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WeatherBackgroundProps {
  weatherType: string;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
  weatherType,
}) => {
  const [prevWeatherType, setPrevWeatherType] = useState<string>(weatherType);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Handle smooth transitions between weather types
  useEffect(() => {
    if (weatherType !== prevWeatherType) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setPrevWeatherType(weatherType);
        setIsTransitioning(false);
      }, 300); // Match this with the CSS transition time

      return () => clearTimeout(timer);
    }
  }, [weatherType, prevWeatherType]);
  const renderWeatherElements = () => {
    switch (weatherType) {
      case "rain":
        return (
          <div className="rain-container">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="raindrop"
                initial={{ y: -20, x: Math.random() * 100 }}
                animate={{
                  y: "100vh",
                  opacity: [1, 0.8, 0.6, 0.4, 0.2, 0],
                }}
                transition={{
                  duration: 1 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear",
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        );

      case "thunderstorm":
        return (
          <>
            <div className="rain-container">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="raindrop"
                  initial={{ y: -20, x: Math.random() * 100 }}
                  animate={{
                    y: "100vh",
                    opacity: [1, 0.8, 0.6, 0.4, 0.2, 0],
                  }}
                  transition={{
                    duration: 1 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "linear",
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
            <motion.div
              className="lightning"
              animate={{
                opacity: [0, 1, 0.5, 0, 0.2, 0],
                backgroundColor: [
                  "rgba(255, 255, 255, 0)",
                  "rgba(255, 255, 255, 0.8)",
                  "rgba(255, 255, 255, 0)",
                ],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: Math.random() * 5 + 3,
              }}
            />
          </>
        );

      case "clouds":
        return (
          <div className="clouds-container">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="cloud"
                initial={{ x: -100 }}
                animate={{ x: "100vw" }}
                transition={{
                  duration: 20 + Math.random() * 30,
                  repeat: Infinity,
                  delay: Math.random() * 10,
                  ease: "linear",
                }}
                style={{
                  top: `${10 + Math.random() * 30}%`,
                  opacity: 0.7 + Math.random() * 0.3,
                  scale: 0.5 + Math.random() * 0.5,
                }}
              />
            ))}
          </div>
        );

      case "clear":
        return (
          <div className="sun-container">
            <motion.div
              className="sun"
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: {
                  duration: 120,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="sun-ray"
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                style={{
                  transform: `rotate(${i * 45}deg)`,
                }}
              />
            ))}
          </div>
        );

      case "snow":
        return (
          <div className="snow-container">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="snowflake"
                initial={{ y: -20, x: Math.random() * 100 }}
                animate={{
                  y: "100vh",
                  x: [
                    `${Math.random() * 100}%`,
                    `${Math.random() * 100}%`,
                    `${Math.random() * 100}%`,
                  ],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear",
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  opacity: 0.7 + Math.random() * 0.3,
                }}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`weather-background ${weatherType} ${
        isTransitioning ? "transitioning" : ""
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={weatherType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="weather-elements-container"
        >
          {renderWeatherElements()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WeatherBackground;

import axios from 'axios';

// Define the API key and base URL
// Using OpenWeatherMap API
// Note: In a production app, you should store this in an environment variable
const API_KEY = '5f472b7acba333cd8a035ea85a0d4d4c'; // Sample API key for testing
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Define interfaces for the weather data
export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
  timezone: number;
  coord: {
    lat: number;
    lon: number;
  };
}

export interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
      deg: number;
    };
    dt_txt: string;
    pop: number; // Probability of precipitation
    visibility: number;
  }[];
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
}

// Function to get current weather by city name
export const getCurrentWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric' // Use metric units (Celsius)
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching current weather:', error);
    if (error.response && error.response.status === 404) {
      throw new Error('City not found. Please check the spelling and try again.');
    } else {
      throw new Error('Failed to fetch weather data. Please try again later.');
    }
  }
};

// Function to get current weather by coordinates
export const getCurrentWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching current weather by coordinates:', error);
    if (error.response && error.response.status === 404) {
      throw new Error('Location not found. Please try a different location.');
    } else {
      throw new Error('Failed to fetch weather data. Please try again later.');
    }
  }
};

// Function to get weather forecast by city name
export const getForecastByCity = async (city: string): Promise<ForecastData> => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        cnt: 24 // Get 24 hours of forecast data (hourly)
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching forecast:', error);
    if (error.response && error.response.status === 404) {
      throw new Error('City not found. Please check the spelling and try again.');
    } else {
      throw new Error('Failed to fetch forecast data. Please try again later.');
    }
  }
};

// Function to get weather forecast by coordinates
export const getForecastByCoords = async (lat: number, lon: number): Promise<ForecastData> => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        cnt: 24 // Get 24 hours of forecast data (hourly)
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching forecast by coordinates:', error);
    if (error.response && error.response.status === 404) {
      throw new Error('Location not found. Please try a different location.');
    } else {
      throw new Error('Failed to fetch forecast data. Please try again later.');
    }
  }
};

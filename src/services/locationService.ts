import axios from 'axios';

// Using OpenWeatherMap's Geocoding API for location suggestions
// https://openweathermap.org/api/geocoding-api
const API_KEY = '5f472b7acba333cd8a035ea85a0d4d4c'; // Sample API key for testing
const BASE_URL = 'https://api.openweathermap.org/geo/1.0';

export interface LocationSuggestion {
  name: string;
  local_names?: {
    [key: string]: string;
  };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

/**
 * Get location suggestions based on a query string
 * @param query The search query
 * @param limit Maximum number of results to return (default: 5)
 * @returns Array of location suggestions
 */
export const getLocationSuggestions = async (
  query: string,
  limit: number = 5
): Promise<LocationSuggestion[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await axios.get(`${BASE_URL}/direct`, {
      params: {
        q: query,
        limit,
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching location suggestions:', error);
    throw new Error('Failed to fetch location suggestions. Please try again.');
  }
};

/**
 * Format a location suggestion for display
 * @param location The location suggestion object
 * @returns Formatted location string
 */
export const formatLocationSuggestion = (location: LocationSuggestion): string => {
  if (location.state) {
    return `${location.name}, ${location.state}, ${location.country}`;
  }
  return `${location.name}, ${location.country}`;
};

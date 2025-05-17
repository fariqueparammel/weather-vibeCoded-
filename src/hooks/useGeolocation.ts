import { useState, useEffect } from 'react';

interface GeolocationState {
  loading: boolean;
  error: string | null;
  position: {
    lat: number;
    lon: number;
  } | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    position: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: 'Geolocation is not supported by your browser',
        position: null,
      });
      return;
    }

    const success = (position: GeolocationPosition) => {
      setState({
        loading: false,
        error: null,
        position: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
      });
    };

    const error = (error: GeolocationPositionError) => {
      setState({
        loading: false,
        error: error.message,
        position: null,
      });
    };

    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  return state;
};

export default useGeolocation;

import { useState, useEffect } from 'react';

interface GeolocationState {
  loading: boolean;
  coordinates: { latitude: number; longitude: number } | null;
  error: GeolocationPositionError | Error | null;
}

const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    coordinates: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: new Error('Geolocation is not supported by your browser.'),
      }));
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        loading: false,
        coordinates: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        error: null,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setState({
        loading: false,
        coordinates: null,
        error: error,
      });
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return state;
};

export default useGeolocation;

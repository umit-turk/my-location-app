import { useState, useEffect } from 'react';

const useUserLocation = () => {
    const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        }
    }, []);

    return userLocation;
};

export default useUserLocation;

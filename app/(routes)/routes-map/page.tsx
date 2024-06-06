"use client";
import { useSelector } from 'react-redux';
import { Box, Text } from '@chakra-ui/react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { RootState } from '@/store';
import { useState, useEffect, useMemo } from 'react';

interface Location {
    id: string;
    name: string;
    color: string;
    lat: number;
    lng: number;
}

const mapContainerStyle = {
    width: '100%',
    height: '100vh',
};

const RoutesMap = () => {
    const locations = useSelector((state: RootState) => state.locations.locations);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries: ['geometry']
    });

    const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [distances, setDistances] = useState<number[]>([]);

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

    const sortedLocations = useMemo(() => {
        if (!userLocation) return locations;

        const locsCopy = [...locations];
        const computedDistances = locsCopy.map(location => {
            const userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
            const locationLatLng = new google.maps.LatLng(location.lat, location.lng);
            const distance = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, locationLatLng) / 1000;
            return {
                ...location,
                distance
            };
        });

        const sorted = computedDistances.sort((a, b) => a.distance - b.distance);
        setDistances(sorted.map(loc => loc.distance));
        return sorted;
    }, [locations, userLocation]);

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded || !userLocation) return <div>Loading Maps...</div>;

    const handleMarkerClick = (location: Location) => {
        setSelectedLocation(location);
    };

    const markerIcon = (color: string) => ({
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 1,
    });

    return (
        <Box p={4}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={10}
                center={userLocation}
            >
                <Marker
                    position={userLocation}
                    icon={markerIcon("#00F")}
                />
                {sortedLocations.map((location, index) => (
                    <Marker
                        key={location.id}
                        position={{ lat: location.lat, lng: location.lng }}
                        icon={markerIcon(location.color)}
                        onClick={() => handleMarkerClick(location)}
                    >
                        {selectedLocation && selectedLocation.id === location.id && (
                            <InfoWindow
                                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                                onCloseClick={() => setSelectedLocation(null)}
                            >
                                <div>
                                    <h2>{selectedLocation.name}</h2>
                                    <p>Latitude: {selectedLocation.lat}</p>
                                    <p>Longitude: {selectedLocation.lng}</p>
                                    <p>Distance: {distances[index].toFixed(2)} km</p>
                                </div>
                            </InfoWindow>
                        )}
                    </Marker>
                ))}
                <Polyline
                    path={[userLocation, ...sortedLocations.map(loc => ({ lat: loc.lat, lng: loc.lng }))]}
                    options={{
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                    }}
                />
            </GoogleMap>
        </Box>
    );
};

export default RoutesMap;

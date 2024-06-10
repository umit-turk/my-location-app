"use client"
import { useSelector } from 'react-redux';
import { Box } from '@chakra-ui/react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { RootState } from '@/store';
import { useState, useEffect, useMemo } from 'react';
import { Location } from '@/app/types/location';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { MARKER_COLOR, POLYLINE_COLOR, getMapContainerStyle } from '@/app/config/constants';



const RoutesMap = () => {
    const { locations } = useSelector((state: RootState) => state.locationsReducer);
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

    if (loadError) return <>Error loading maps</>;
    if (!isLoaded || !userLocation) return <LoadingSpinner />;

    const handleMarkerClick = (location: Location) => {
        setSelectedLocation(location);
    };

    // Marker ikonu oluşturma fonksiyonu
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
                mapContainerStyle={getMapContainerStyle('100%','100vh')}
                zoom={10}
                center={userLocation}
            >
                <Marker
                    position={userLocation}
                    icon={markerIcon(MARKER_COLOR)}
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
                                <Box>
                                    <h2>{selectedLocation.name}</h2>
                                    <div>Latitude: {selectedLocation.lat.toFixed(2)}</div>
                                    <div>Longitude: {selectedLocation.lng.toFixed(2)}</div>
                                    <div>Distance: {distances[index].toFixed(2)} km</div>
                                </Box>
                            </InfoWindow>
                        )}
                    </Marker>
                ))}
                <Polyline
                    path={[userLocation, ...sortedLocations.map(loc => ({ lat: loc.lat, lng: loc.lng }))]}
                    options={{
                        strokeColor: POLYLINE_COLOR,
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                    }}
                />
            </GoogleMap>
        </Box>
    );
};

export default RoutesMap;

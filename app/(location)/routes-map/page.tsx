"use client";
import { useSelector } from 'react-redux';
import { Box } from '@chakra-ui/react';
import { GoogleMap, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { RootState } from '@/store';
import { useState, useMemo } from 'react';
import { Location } from '@/app/types/location';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { MARKER_COLOR, POLYLINE_COLOR, getMapContainerStyle } from '@/app/config/constants';
import useUserLocation from '@/app/hooks/useUserLocation';
import { computeDistance, markerIcon, nearestNeighbor } from '@/app/helpers/mapHelpers';
import { useGoogleMaps } from '@/app/hooks/useGoogleMaps';

const RoutesMap = () => {
    const { locations } = useSelector((state: RootState) => state.locationsReducer);
    const { isLoaded, loadError } = useGoogleMaps(['geometry']);

    const userLocation = useUserLocation();
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [distances, setDistances] = useState<number[]>([]);

    const sortedLocations = useMemo(() => {
        if (!userLocation) return locations;

        const locsCopy = [...locations];
        const userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
        const allLocations = [userLatLng, ...locsCopy.map(loc => new google.maps.LatLng(loc.lat, loc.lng))];

        const unvisited = Array.from({ length: allLocations.length - 1 }, (_, i) => i + 1);
        const route = nearestNeighbor(0, unvisited, allLocations);

        const sorted = route.slice(1).map(index => locsCopy[index - 1]);
        setDistances(sorted.map((location, index) => {
            const prevIndex = route[index];
            return computeDistance(
                allLocations[prevIndex],
                allLocations[route[index + 1]]
            ) / 1000;
        }));

        return sorted;
    }, [locations, userLocation]);

    if (loadError) return <>Error loading maps</>;
    if (!isLoaded || !userLocation) return <LoadingSpinner />;

    const handleMarkerClick = (location: Location) => {
        setSelectedLocation(location);
    };

    return (
        <Box p={4}>
            <GoogleMap
                mapContainerStyle={getMapContainerStyle('100%', '100vh')}
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

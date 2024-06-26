"use client"
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { Box, Button, Input, Flex } from '@chakra-ui/react';
import { RootState } from '@/store';
import { updateLocation } from '@/store/locationsSlice';
import LocationMap from '@/app/components/LocationMap';
import LocationAutocomplete from '@/app/components/LocationAutoComplete';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { PRIMARY_COLOR, ROUTES } from '@/app/config/constants';
import { useGoogleMaps } from '@/app/hooks/useGoogleMaps';

interface EditLocationProps {
    params: { id: string };
}

const EditLocation: React.FC<EditLocationProps> = ({ params }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isLoaded, loadError } = useGoogleMaps(['places']);

    const location = useSelector((state: RootState) =>
        state.locationsReducer.locations.find(loc => loc.id === params.id)
    );

    const [name, setName] = useState<string>(location?.name || '');
    const [color, setColor] = useState<string>(location?.color || PRIMARY_COLOR);
    const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(
        location ? { lat: location.lat, lng: location.lng } : null
    );

    const inputRef = useRef<HTMLInputElement | null>(null);

    const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);

    useEffect(() => {
        if (isLoaded && inputRef.current) {
            const autocomplete = new google.maps.places.Autocomplete(inputRef.current);
            autocomplete.addListener("place_changed", handlePlaceChange);
            autoCompleteRef.current = autocomplete;
        }
        if (isLoaded) {
            geocoderRef.current = new google.maps.Geocoder();
        }
    }, [isLoaded]);


    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (event.latLng && geocoderRef.current) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            setMarker({ lat, lng });
            geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    setName(results[0].formatted_address);
                } else {
                    console.error('Geocoder failed due to: ' + status);
                }
            });
        }
    };

    const handlePlaceChange = () => {
        const place = autoCompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setMarker({ lat, lng });
            setName(place.name || '');
            if (mapRef.current) {
                mapRef.current.panTo({ lat, lng });
                mapRef.current.setZoom(15);
            }
        }
    };

    const handleSubmit = () => {
        if (location && marker) {
            dispatch(
                updateLocation({
                    ...location,
                    name,
                    lat: marker.lat,
                    lng: marker.lng,
                    color
                })
            );
            router.push(ROUTES.SHOW_LOCATIONS.route);
        }
    };

    if (!location || !isLoaded) {
        return <LoadingSpinner />;
    }
    if (loadError) return <>Error loading maps</>;

    return (
        <Box p={4}>
            <LocationMap color={color} onMapClick={handleMapClick} marker={marker} mapRef={mapRef} />
            <Flex direction="column" mt={4}>
                <LocationAutocomplete
                    inputRef={inputRef}
                    name={name}
                    setName={setName}
                    onPlaceChange={handlePlaceChange}
                />
                <Input type="color" value={color} mb={2} onChange={(e) => setColor(e.target.value)} />
                <Button onClick={handleSubmit}>Save</Button>
            </Flex>
        </Box>
    );
};

export default EditLocation;

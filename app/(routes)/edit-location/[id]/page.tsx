"use client";
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { Box, Button, Input, Flex } from '@chakra-ui/react';
import { RootState } from '@/store';
import { updateLocation } from '@/store/locationsSlice';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const libraries: any = ["places"];

const mapContainerStyle = {
    width: '100%',
    height: '50vh',
};
const center = {
    lat: 37.7749,
    lng: -122.4194,
};

const EditLocation = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const location = useSelector((state: RootState) =>
        state.locations.locations.find(loc => loc.id === params.id)
    );

    const [name, setName] = useState(location?.name || '');
    const [color, setColor] = useState(location?.color || '#FF0000');
    const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(location ? { lat: location.lat, lng: location.lng } : null);

    const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries,
    });

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
            dispatch(updateLocation({
                ...location,
                name,
                lat: marker.lat,
                lng: marker.lng,
                color,
            }));
            router.push('/show-locations');
        }
    };

    const markerIcon = isLoaded ? {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 1,
        scale: 10,
        strokeColor: 'white',
        strokeWeight: 2,
    } : undefined;

    if (!location) {
        return <div>Loading...</div>;
    }

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <Box p={4}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={8}
                center={marker || center}
                onClick={handleMapClick}
                onLoad={(map) => (mapRef.current = map)}
            >
                {marker && <Marker position={marker} icon={markerIcon} />}
            </GoogleMap>
            <Flex direction="column" mt={4}>
                <Autocomplete onLoad={(autocomplete) => (autoCompleteRef.current = autocomplete)}>
                    <Input
                        ref={inputRef}
                        placeholder="Location Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        mb={2}
                    />
                </Autocomplete>
                <Input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    mb={2}
                />
                <Button onClick={handleSubmit}>Save</Button>
            </Flex>
        </Box>
    );
};

export default EditLocation;

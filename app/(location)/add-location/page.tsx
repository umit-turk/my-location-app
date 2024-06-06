"use client"
import { Box, Button, Flex, Input } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLoadScript } from '@react-google-maps/api';
import { addLocation } from '@/store/locationsSlice';
import LocationMap from '@/app/components/LocationMap';
import LocationAutocomplete from '@/app/components/LocationAutoComplete';

const AddLocation: React.FC = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState<string>('');
  const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(null);
  const [color, setColor] = useState('#FF0000');

  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  });

  useEffect(() => {
    if (loadError) {
      console.error('Error loading maps');
    } else if (isLoaded) {
      geocoderRef.current = new google.maps.Geocoder();
    }
  }, [loadError, isLoaded]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat()!;
    const lng = event.latLng?.lng()!;
    const location = { lat, lng };
    setMarker(location);
    if (mapRef.current) {
      mapRef.current.panTo(location);
    }

    // Use geocoder to get the address
    if (geocoderRef.current) {
      geocoderRef.current.geocode({ location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setName(results[0].formatted_address);
        } else {
          console.error('Geocoder failed due to: ' + status);
        }
      });
    }
  };

  const handlePlaceChange = (location: google.maps.LatLngLiteral, placeName: string) => {
    setMarker(location);
    setName(placeName);
    if (mapRef.current) {
      mapRef.current.panTo(location);
    }
  };

  const handleSubmit = () => {
    if (name && marker) {
      dispatch(
        addLocation({
          id: Date.now().toString(),
          name,
          lat: marker.lat,
          lng: marker.lng,
          color,
        })
      );
      setName('');
      setMarker(null);
      setColor('#FF0000');
    }
  };

  if (!isLoaded) return <div>Loading Maps...</div>;

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
        <Button onClick={handleSubmit}>Add Location</Button>
      </Flex>
    </Box>
  );
};

export default AddLocation;

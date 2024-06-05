"use client";
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Input, Flex } from '@chakra-ui/react';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { addLocation } from '@/store/locationsSlice';

const libraries: any = ["places"];

const mapContainerStyle = {
  width: '100%',
  height: '50vh',
};
const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const AddLocation = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#FF0000');
  const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setMarker({ lat, lng });
          setName(place.name || '');
          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(15);
          }
        }
      });
      autoCompleteRef.current = autocomplete;
    }
    if (isLoaded) {
      geocoderRef.current = new google.maps.Geocoder();
    }
  }, [isLoaded]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

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

  const handleSubmit = () => {
    if (name && marker) {
      dispatch(addLocation({
        id: Date.now().toString(),
        name,
        lat: marker.lat,
        lng: marker.lng,
        color,
      }));
      setName('');
      setMarker(null);
      setColor('#FF0000');
    }
  };

  const markerIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    scale: 10,
    strokeColor: 'white',
    strokeWeight: 2,
  };

  return (
    <Box p={4}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={6}
        center={center}
        onClick={handleMapClick}
        onLoad={(map) => (mapRef.current = map)}
      >
        {marker && <Marker position={marker} icon={markerIcon} />}
      </GoogleMap>
      <Flex direction="column" mt={4}>
        <Autocomplete
          onLoad={(autocomplete) => (autoCompleteRef.current = autocomplete)}
          onPlaceChanged={() => {
            const place = autoCompleteRef.current?.getPlace();
            if (place?.geometry?.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              setMarker({ lat, lng });
              setName(place.name || '');
              if (mapRef.current) {
                mapRef.current.panTo({ lat, lng });
                mapRef.current.setZoom(7);
              }
            }
          }}
        >
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
        <Button onClick={handleSubmit}>Add Location</Button>
      </Flex>
    </Box>
  );
};

export default AddLocation;

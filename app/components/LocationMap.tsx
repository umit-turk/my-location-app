import { GoogleMap, Marker } from '@react-google-maps/api';
import { LocationMapProps } from '../types/locationMapProps';
import { useEffect, useRef } from 'react';

const LocationMap: React.FC<LocationMapProps> = ({
  onMapClick,
  marker,
  color,
  mapRef
}) => {
  const markerIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    scale: 10,
    strokeColor: 'white',
    strokeWeight: 2,
  };

  const defaultCenter = { lat: 37.7749, lng: -122.4194 };

  const internalMapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      internalMapRef.current = mapRef.current;
    }
  }, [mapRef]);

  const handleMapLoad = (map: google.maps.Map) => {
    if (internalMapRef.current) {
      internalMapRef.current = map;
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '50vh' }}
      zoom={6}
      center={marker || defaultCenter}
      onClick={onMapClick}
      onLoad={handleMapLoad}
    >
      {marker && <Marker position={marker} icon={markerIcon} />}
    </GoogleMap>
  );
};

export default LocationMap;

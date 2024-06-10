"use client"
import { GoogleMap, Marker } from '@react-google-maps/api';
import { LocationMapProps } from '../types/locationMapProps';
import { useEffect, useRef } from 'react';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MARKER_SCALE, MARKER_STROKE_COLOR, MARKER_STROKE_WEIGHT, getMapContainerStyle } from '../config/constants';

const LocationMap: React.FC<LocationMapProps> = ({
  onMapClick,
  marker,
  color,
  mapRef 
}) => {

  const internalMapRef = useRef<google.maps.Map | null>(null);

  const markerIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    scale: MARKER_SCALE,
    strokeColor: MARKER_STROKE_COLOR,
    strokeWeight: MARKER_STROKE_WEIGHT,
  };

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
      mapContainerStyle={getMapContainerStyle('100%','50vh')}
      zoom={DEFAULT_ZOOM}
      center={marker || DEFAULT_CENTER}
      onClick={onMapClick}
      onLoad={handleMapLoad}
    >
      {marker && <Marker position={marker} icon={markerIcon} />}
    </GoogleMap>
  );
};

export default LocationMap;

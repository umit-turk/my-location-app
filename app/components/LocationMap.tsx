"use client"
import { GoogleMap, Marker } from '@react-google-maps/api';
import { LocationMapProps } from '../types/locationMapProps';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MARKER_SCALE, MARKER_STROKE_COLOR, MARKER_STROKE_WEIGHT, getMapContainerStyle } from '../config/constants';

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
    scale: MARKER_SCALE,
    strokeColor: MARKER_STROKE_COLOR,
    strokeWeight: MARKER_STROKE_WEIGHT,
  };

  return (
    <GoogleMap
      mapContainerStyle={getMapContainerStyle('100%','50vh')}
      zoom={DEFAULT_ZOOM}
      center={marker || DEFAULT_CENTER}
      onClick={onMapClick}
      onLoad={(map) => mapRef.current = map}
    >
      {marker && <Marker position={marker} icon={markerIcon} />}
    </GoogleMap>
  );
};

export default LocationMap;

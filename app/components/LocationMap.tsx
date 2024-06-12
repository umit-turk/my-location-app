"use client"
import { GoogleMap, Marker } from '@react-google-maps/api';
import { LocationMapProps } from '../types/locationMapProps';
import { DEFAULT_CENTER, DEFAULT_ZOOM, getMapContainerStyle } from '../config/constants';
import { markerIcon } from '../helpers/mapHelpers';

const LocationMap: React.FC<LocationMapProps> = ({
  onMapClick,
  marker,
  color,
  mapRef
}) => {

  const handleMapLoad = (map: google.maps.Map) => {
    if (mapRef.current) {
      mapRef.current = map;
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={getMapContainerStyle('100%', '50vh')}
      zoom={DEFAULT_ZOOM}
      center={marker || DEFAULT_CENTER}
      onClick={onMapClick}
      onLoad={handleMapLoad}
    >
      {marker && <Marker position={marker} icon={markerIcon(color)} />}
    </GoogleMap>
  );
};

export default LocationMap;

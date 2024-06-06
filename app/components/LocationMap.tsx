import { GoogleMap, Marker } from '@react-google-maps/api';
import { LocationMapProps } from '../types/locationMapProps';

const LocationMap: React.FC<LocationMapProps> = ({ onMapClick, marker, color, mapRef }) => {
  const markerIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    scale: 10,
    strokeColor: 'white',
    strokeWeight: 2,
  };

  const defaultCenter = { lat: 37.7749, lng: -122.4194 };

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '50vh' }}
      zoom={6}
      center={marker || defaultCenter}
      onClick={onMapClick}
      onLoad={(map) => (mapRef.current = map)}
    >
      {marker && <Marker position={marker} icon={markerIcon} />}
    </GoogleMap>
  );
};

export default LocationMap;

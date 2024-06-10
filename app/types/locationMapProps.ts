export interface LocationMapProps {
    onMapClick: (event: google.maps.MapMouseEvent) => void;
    marker: google.maps.LatLngLiteral | null;
    color: string;
    mapRef: React.RefObject<google.maps.Map | null>;
}
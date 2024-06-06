export interface LocationAutocompleteProps {
    inputRef: React.RefObject<HTMLInputElement>;
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    onPlaceChange: (location: google.maps.LatLngLiteral, placeName: string) => void;
}
import { Input } from '@chakra-ui/react';
import { Autocomplete } from '@react-google-maps/api';
import { useRef } from 'react';
import { LocationAutocompleteProps } from '../types/locationAutoCompleteProps';

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({ inputRef, name, setName, onPlaceChange }) => {
    const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const handlePlaceChange = () => {
        const place = autoCompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const location = { lat, lng };
            onPlaceChange(location, place.name || '');
            setName(place.name || '');
        }
    };

    return (
        <Autocomplete
            onLoad={(autocomplete) => (autoCompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChange}
        >
            <Input
                ref={inputRef}
                placeholder="Location Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                mb={2}
            />
        </Autocomplete>
    );
};

export default LocationAutocomplete;

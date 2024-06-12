import { useLoadScript, Libraries } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '@/app/config/config';

export const useGoogleMaps = (libraries: Libraries) => {
    return useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY as string,
        libraries,
    });
};

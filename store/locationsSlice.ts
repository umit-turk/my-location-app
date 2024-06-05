import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  color: string;
}

interface LocationsState {
  locations: Location[];
}

const initialState: LocationsState = {
  locations: [],
};

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    addLocation(state, action: PayloadAction<Location>) {
      state.locations.push(action.payload);
      saveLocationsToLocalStorage(state.locations); 
    },
    updateLocation(state, action: PayloadAction<Location>) {
      const index = state.locations.findIndex(loc => loc.id === action.payload.id);
      if (index !== -1) {
        state.locations[index] = action.payload;
        saveLocationsToLocalStorage(state.locations); 
      }
    },
    deleteLocation(state, action: PayloadAction<string>) {
      state.locations = state.locations.filter(loc => loc.id !== action.payload);
      saveLocationsToLocalStorage(state.locations); 
    },
  },
});

// localStorage'e kaydetme fonksiyonu
const saveLocationsToLocalStorage = (locations: Location[]) => {
  localStorage.setItem('locations', JSON.stringify(locations));
};

const loadLocationsFromLocalStorage = (): Location[] => {
  const locationsJSON = localStorage.getItem('locations');
  return locationsJSON ? JSON.parse(locationsJSON) : [];
};

initialState.locations = loadLocationsFromLocalStorage();

export const { addLocation, updateLocation, deleteLocation } = locationsSlice.actions;
export default locationsSlice.reducer;

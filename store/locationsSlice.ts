import { Location } from '@/app/types/location';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const saveLocationsToLocalStorage = (locations: Location[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('locations', JSON.stringify(locations));
  }
};

const loadLocationsFromLocalStorage = (): Location[] => {
  if (typeof window !== 'undefined') {
    const locationsJSON = localStorage.getItem('locations');
    return locationsJSON ? JSON.parse(locationsJSON) : [];
  }
  return [];
}

initialState.locations = loadLocationsFromLocalStorage();

export const { addLocation, updateLocation, deleteLocation } = locationsSlice.actions;
export default locationsSlice.reducer;

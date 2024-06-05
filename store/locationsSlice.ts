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
    },
    updateLocation(state, action: PayloadAction<Location>) {
      const index = state.locations.findIndex(loc => loc.id === action.payload.id);
      if (index !== -1) {
        state.locations[index] = action.payload;
      }
    },
    deleteLocation(state, action: PayloadAction<string>) {
      state.locations = state.locations.filter(loc => loc.id !== action.payload);
    },
  },
});

export const { addLocation, updateLocation, deleteLocation } = locationsSlice.actions;
export default locationsSlice.reducer;

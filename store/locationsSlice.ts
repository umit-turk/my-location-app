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
   
  },
});

export default locationsSlice.reducer;

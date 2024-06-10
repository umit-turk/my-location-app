"use client"
import { configureStore } from '@reduxjs/toolkit';
import locationsReducer from './locationsSlice';

const store = configureStore({
  reducer: {
    locationsReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from './slices/exampleSlice'; // Import your reducer here

const store = configureStore({
  reducer: {
    example: exampleReducer, // Add your reducer to the store
  },
});

export default store;

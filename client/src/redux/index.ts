import { configureStore } from '@reduxjs/toolkit';
import { arcadeReducer } from './slices/arcadeSlice';

// Configura a store com o reducer
export const store = configureStore({
  reducer: {
    arcade: arcadeReducer,
  },
});

export type IRootState = ReturnType<typeof store.getState>
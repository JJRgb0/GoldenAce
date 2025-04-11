import { configureStore } from '@reduxjs/toolkit';
import { arcadeReducer } from './slices/arcadeSlice';
import { controlsReducer } from './slices/controlsSlice';

// Configura a store com o reducer
export const store = configureStore({
  reducer: {
    arcade: arcadeReducer,
    controls: controlsReducer,
  },
});

export type IRootState = ReturnType<typeof store.getState>
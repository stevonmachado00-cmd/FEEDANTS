import { configureStore } from '@reduxjs/toolkit';
import competitionReducer from './slices/competitionSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    competition: competitionReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

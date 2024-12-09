import { configureStore } from "@reduxjs/toolkit";
import screeningSetup from "./slices/screeningSetUpSlice";
import screeningResult from "./slices/screeningResultSlice";
import alertSlice from "./slices/alertsSlice";

export const store = configureStore({
  reducer: {
    screeningSetup: screeningSetup, // Add additional reducers here
    screeningResult: screeningResult,
    alertSlice: alertSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

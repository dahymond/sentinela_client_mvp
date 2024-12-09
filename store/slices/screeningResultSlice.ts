import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  main_alert: null, // Will hold the main alert data
  additional_alerts: [], // Initially empty
};

const screeningResultSlice = createSlice({
  name: "screeningResult",
  initialState,
  reducers: {
    updateScreeningResult: (
      state: any,
      { payload: { name, value } }: { payload: { name: string; value: any } }
    ) => {
      state[name] = value;
    },
    clearScreeningResult: (state) => {
      state.main_alert = null;
      state.additional_alerts = [];
    },
  },
  extraReducers: (builder) => {},
});

export const { updateScreeningResult, clearScreeningResult } =
  screeningResultSlice.actions;

export default screeningResultSlice.reducer;

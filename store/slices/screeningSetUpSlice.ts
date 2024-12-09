import { baseServerURL } from "@/lib/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../interceptors";

export const submitPII = createAsyncThunk(
  "submitPII",
  async (PIIDetails: Partial<ScreeningSetUpState>, thunkApi) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseServerURL}/sentinela/fuzzy_match_mvp_alt`,
        PIIDetails,
        { withCredentials: true }
      );
      return data;
    } catch (err: any) {
      return thunkApi.rejectWithValue(
        err?.response?.data?.error ||
          err.message ||
          "Something went wrong. Please try again"
      );
    }
  }
);

interface ScreeningSetUpState {
  full_name: string;
  alias: string;
  address: string;
  citizenship: string;
  country_of_residence: string;
  date_of_birth: string;
  national_identification_number: string;
  passport_number: string;
  fuzzyThreshold: number;
}

const initialState: ScreeningSetUpState = {
  full_name: "",
  alias: "",
  address: "",
  citizenship: "",
  country_of_residence: "",
  date_of_birth: "",
  national_identification_number: "",
  passport_number: "",
  fuzzyThreshold: 60,
};

const screeningSetUpSlice = createSlice({
  name: "screeningSetUp",
  initialState,
  reducers: {
    updateScreeningSetUp: (
      state: any,
      { payload: { name, value } }: { payload: { name: string; value: any } }
    ) => {
      state[name] = value;
    },
  },
});

export const { updateScreeningSetUp } = screeningSetUpSlice.actions;

export default screeningSetUpSlice.reducer;

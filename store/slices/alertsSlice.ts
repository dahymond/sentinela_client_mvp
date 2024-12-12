import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../interceptors";
import { submitPII } from "./screeningSetUpSlice";
import { APIResponse, MainAlert } from "@/app/components/interfaces/interfaces";

type AlertsSliceType = {
  all_main_alerts: Omit<MainAlert, "details">[];
  main_alert: MainAlert | null;
  main_alert_mini_details: Omit<MainAlert, "details"> | null;
  additional_alerts: MainAlert[];

  // pending loading
  all_main_alerts_loading: boolean;
  main_alert_loading: boolean;
  additional_alerts_loading: boolean;
  submit_alert_loading: boolean;
  delete_alert_loading: boolean;

  // errors loading
  all_main_alerts_error: boolean;
  main_alert_error: boolean;
  additional_alerts_error: boolean;
  submit_alert_error: boolean;
  delete_alert_error: boolean;
};

const initialState: AlertsSliceType = {
  all_main_alerts: [],
  main_alert: null, // Will hold the main alert data
  main_alert_mini_details: null,
  additional_alerts: [], // Initially empty

  // loading states
  all_main_alerts_loading: false,
  main_alert_loading: false,
  additional_alerts_loading: false,
  submit_alert_loading: false,
  delete_alert_loading: false,

  // errors state
  all_main_alerts_error: false,
  main_alert_error: false,
  additional_alerts_error: false,
  submit_alert_error: false,
  delete_alert_error: false,
};

export const getAllAlerts = createAsyncThunk(
  "getAllAlerts",
  async (_, thunkApi) => {
    try {
      const { data } = await axiosInstance.get(`/sentinela/alerts/`);
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

export const getMainAlert = createAsyncThunk(
  "getMainAlert",
  async (alertId: number, thunkApi) => {
    try {
      const { data } = await axiosInstance.get(
        `/sentinela/alerts/main/${alertId}`
      );
      //   console.log(data);
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

export const getAdditionalAlert = createAsyncThunk(
  "getAdditionalAlert",
  async (alertId: number, thunkApi) => {
    try {
      const { data } = await axiosInstance.get(
        `/sentinela/alerts/additional/${alertId}`
      );
      //   console.log(data);
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
export const deleteMainAlert = createAsyncThunk(
  "deleteMainAlert",
  async (alertId: number, thunkApi) => {
    try {
      const { data } = await axiosInstance.delete(
        `/sentinela/alerts/delete/${alertId}`
      );
      //   console.log(data);
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

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    updatealertsSlice: (
      state: any,
      { payload: { name, value } }: { payload: { name: string; value: any } }
    ) => {
      state[name] = value;
    },
  },
  extraReducers: (builder) => {
    //
    // Submit PII/Generate Alert
    builder.addCase(submitPII.pending, (state, action: {}) => {
      state.submit_alert_loading = true;
      state.submit_alert_error = false;
    });
    builder.addCase(
      submitPII.fulfilled,
      (state, action: PayloadAction<APIResponse>) => {
        state.submit_alert_loading = false;
        state.main_alert = action?.payload?.main_alert;
        state.additional_alerts = action?.payload?.additional_alerts;
      }
    );
    builder.addCase(submitPII.rejected, (state, { payload }: any) => {
      state.submit_alert_loading = false;
      state.submit_alert_error = true;
    });

    // Get All Alerts
    builder.addCase(getAllAlerts.pending, (state, action: {}) => {
      state.all_main_alerts_loading = true;
      state.all_main_alerts_error = false;
    });
    builder.addCase(
      getAllAlerts.fulfilled,
      (state, action: PayloadAction<any>) => {
        // console.log(action.payload);
        state.all_main_alerts_loading = false;
        state.all_main_alerts = action?.payload?.alerts;
      }
    );
    builder.addCase(getAllAlerts.rejected, (state, { payload }: any) => {
      state.all_main_alerts_loading = false;
      state.all_main_alerts_error = true;
    });

    // Get Main Alert
    builder.addCase(getMainAlert.pending, (state, action: {}) => {
      state.main_alert_loading = true;
      state.main_alert_error = false;
    });
    builder.addCase(
      getMainAlert.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.main_alert_loading = false;
        state.main_alert = action?.payload?.main_alert;
        state.main_alert_mini_details = action?.payload?.main_alert;
        state.additional_alerts = action?.payload?.additional_alerts;
      }
    );
    builder.addCase(getMainAlert.rejected, (state, { payload }: any) => {
      state.main_alert_loading = false;
      state.main_alert_error = true;
    });

    // Get Additional Alert
    builder.addCase(getAdditionalAlert.pending, (state, action: {}) => {
      state.main_alert_loading = true;
      state.main_alert_error = false;
    });
    builder.addCase(
      getAdditionalAlert.fulfilled,
      (state, action: PayloadAction<any>) => {
        // we're updating main alert even if this additional alert slice
        //the additional_alert variable might not be needed/used in the entire application. I will double check to confirm
        state.main_alert_loading = false;
        state.main_alert_error =false;
        state.main_alert = action?.payload;
      }
    );
    builder.addCase(getAdditionalAlert.rejected, (state, { payload }: any) => {
      state.main_alert_loading = false;
      state.main_alert_error = true;
    });

    // Delete Main Alert
    builder.addCase(deleteMainAlert.pending, (state, action: {}) => {
      state.delete_alert_loading = true;
      state.delete_alert_error = false;
    });

    builder.addCase(
      deleteMainAlert.fulfilled,
      (state, action: PayloadAction<any>) => {
        // we're updating main alert even if this additional alert slice
        //the additional_alert variable might not be needed/used in the entire application. I will double check to confirm
        state.delete_alert_loading = false;
        state.delete_alert_error = false;
        if(state.all_main_alerts){
          state.all_main_alerts = [...state.all_main_alerts].filter((alert)=>alert.id !== action?.payload?.alertId);
        }
      }
    );

    builder.addCase(deleteMainAlert.rejected, (state, { payload }: any) => {
      state.delete_alert_loading = false;
      state.delete_alert_error = true;
    });
  },
});

export const { updatealertsSlice } = alertsSlice.actions;

export default alertsSlice.reducer;

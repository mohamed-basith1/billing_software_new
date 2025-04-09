import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  currentReportsTab: 0,
  fromDate: null,
  toDate: null,
  dashboardData: [],
};

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setCurrentReportsTab: (state, action) => {
      state.currentReportsTab = action.payload;
    },
    setReportsFromDate: (state, action) => {
      state.fromDate = action.payload;
    },
    setReportsToDate: (state, action) => {
      state.toDate = action.payload;
    },
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    
  },
});

// Actions
export const {
  setCurrentReportsTab,
  setReportsFromDate,
  setReportsToDate,
  setDashboardData,
} = reportSlice.actions;

// Selectors
export const selectCurrentReportsTab = (state: any) =>
  state.reports.currentReportsTab;
export const selectReportsFromDate = (state: any) => state.reports.fromDate;
export const selectReportsToDate = (state: any) => state.reports.toDate;
export const selectDashboardData = (state: any) => state.reports.dashboardData;

export default reportSlice.reducer;

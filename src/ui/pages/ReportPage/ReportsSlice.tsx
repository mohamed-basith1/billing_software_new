import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  currentReportsTab: 0,
  fromDate: null,
  toDate: null,
  dashboardData: [],
  transactionData: [],
  transactionSummary: {
    amount_available: 0,
    upi_balance: 0,
    cash_balance: 0,
    total_outstanding: 0,
  },
  AddTransactionModal: false,
  transactionHistoryTab: 0,
  transactionAmountTakeTab: 0,
  submitLoader: false,
  employeeList: [],
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
    setTransactionData: (state, action) => {
      state.transactionData = action.payload;
    },
    setTransactionHistoryTab: (state, action) => {
      state.transactionHistoryTab = action.payload;
    },
    setTransactionSummary: (state, action) => {
      state.transactionSummary = action.payload;
    },
    setTransactionAmountTakeTab: (state, action) => {
      state.transactionAmountTakeTab = action.payload;
    },
    setAddTransactionModal: (state, action) => {
      state.AddTransactionModal = action.payload;
    },
    setSubmitLoader: (state, action) => {
      state.submitLoader = action.payload;
    },
    setEmployeeList: (state, action) => {
      state.employeeList = action.payload;
    },
  },
});

// Actions
export const {
  setCurrentReportsTab,
  setReportsFromDate,
  setReportsToDate,
  setDashboardData,
  setTransactionData,
  setTransactionHistoryTab,
  setTransactionAmountTakeTab,
  setAddTransactionModal,
  setSubmitLoader,
  setTransactionSummary,
  setEmployeeList,
} = reportSlice.actions;

// Selectors
export const selectCurrentReportsTab = (state: any) =>
  state.reports.currentReportsTab;
export const selectReportsFromDate = (state: any) => state.reports.fromDate;
export const selectReportsToDate = (state: any) => state.reports.toDate;
export const selectDashboardData = (state: any) => state.reports.dashboardData;
export const selectTransactionData = (state: any) =>
  state.reports.transactionData;

export const selectTransactionHistoryTab = (state: any) =>
  state.reports.transactionHistoryTab;
export const selectTransactionAmountTakeTab = (state: any) =>
  state.reports.transactionAmountTakeTab;
export const selectAddTransactionModal = (state: any) =>
  state.reports.AddTransactionModal;
export const selectSubmitLoader = (state: any) => state.reports.submitLoader;
export const selectTransactionSummary = (state: any) =>
  state.reports.transactionSummary;
export const selectEmployeeList = (state: any) => state.reports.employeeList;

export default reportSlice.reducer;

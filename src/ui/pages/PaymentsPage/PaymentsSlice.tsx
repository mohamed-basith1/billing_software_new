import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  currentPaymentsTab: 0,
  UPIBillsList: [],
};

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setCurrentPaymentsTab: (state, action) => {
      state.currentPaymentsTab = action.payload;
    },
    setUPIBillsList: (state, action) => {
      state.UPIBillsList = action.payload;
    },
  },
});

// Actions
export const { setCurrentPaymentsTab, setUPIBillsList } = paymentSlice.actions;

// Selectors
export const selectCurrentPaymentsTab = (state: any) =>
  state.payments.currentPaymentsTab;
export const selectUPIBillsList = (state: any) => state.payments.UPIBillsList;

export default paymentSlice.reducer;

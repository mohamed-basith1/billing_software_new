import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stringify } from "querystring";
import { aggregateItemsByCode } from "../../utils/utils";

const initialState: any = {
  currentPaymentsTab: 0,
  UPIBillsList: [],
  selectedBills: {},
  tempRemoveItem: [],
  billSearch: "",
  fromDate: null,
  toDate: null,
  payCreditBalance: 0,
  payCreditBalanceModal: false,
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
    setSelectedBills: (state, action) => {
      state.tempRemoveItem = [];
      state.selectedBills = action.payload;
    },
    setItemRemove: (state, action) => {
      console.log("remove code", action.payload);
      const codeToRemove = action.payload;

      state.tempRemoveItem = aggregateItemsByCode([
        ...state.tempRemoveItem,
        ...state.selectedBills.itemsList.filter(
          (item) => item.code === codeToRemove
        ),
      ]);
      state.selectedBills.itemsList = state.selectedBills.itemsList.filter(
        (item) => item.code !== codeToRemove
      );
    },
    setReturnItem: (state, action) => {
      const index = state.selectedBills.itemsList.findIndex(
        (item) => item.code === action.payload.code
      );

      if (index !== -1) {
        // Parse the previous quantity
        const prevItem = state.selectedBills.itemsList[index];
        const prevQty = prevItem.qty; // Assuming `qty` is the quantity field

        // New quantity from action payload
        const newQty = action.payload.qty;

        // Calculate the difference
        const qtyDifference = prevQty - newQty;

        // Update the item in selectedBills
        state.selectedBills.itemsList[index] = action.payload;
        let tempRemoveItemData = [
          ...state.tempRemoveItem,
          { ...action.payload, qty: qtyDifference },
        ];

        state.tempRemoveItem = aggregateItemsByCode(tempRemoveItemData);
      }
    },
    setnewReturnBill: (state, action) => {
      const index = state.UPIBillsList.findIndex(
        (bill: any) => bill.bill_number === action.payload.bill_number
      );

      if (index !== -1) {
        state.UPIBillsList[index] = action.payload;
      }
    },
    setPaymentChange: (state, action) => {
      state.UPIBillsList = state.UPIBillsList.filter(
        (data) => data.bill_number !== action.payload.bill_number
      );
      state.selectedBills = {};
    },
    clearSelectedBills: (state) => {
      state.selectedBills = {};
    },
    setBillSearch: (state, action) => {
      state.billSearch = action.payload;
    },
    setFromDate: (state, action) => {
      state.fromDate = action.payload;
    },
    setToDate: (state, action) => {
      state.toDate = action.payload;
    },
    setPayCreditBalance: (state, action) => {
      state.payCreditBalance = action.payload;
    },
    setPayCreditBalanceModal: (state, action) => {
      state.payCreditBalanceModal = action.payload;
      state.payCreditBalance = 0;
    },
    clearPaymentBillsDetail: (state) => {
      state.UPIBillsList = [];
      state.selectedBills = {};
      state.tempRemoveItem = [];
      state.billSearch = "";
      state.fromDate = null;
      state.toDate = null;
      state.payCreditBalance = 0;
    },
  },
});

// Actions
export const {
  setCurrentPaymentsTab,
  setUPIBillsList,
  setSelectedBills,
  setItemRemove,
  setReturnItem,
  setnewReturnBill,
  setPaymentChange,
  clearSelectedBills,
  setBillSearch,
  setFromDate,
  setToDate,
  clearPaymentBillsDetail,
  setPayCreditBalance,
  setPayCreditBalanceModal,
} = paymentSlice.actions;

// Selectors
export const selectCurrentPaymentsTab = (state: any) =>
  state.payments.currentPaymentsTab;
export const selectUPIBillsList = (state: any) => state.payments.UPIBillsList;
export const selectSelectedBills = (state: any) => state.payments.selectedBills;
export const selectTempRemoveItem = (state: any) =>
  state.payments.tempRemoveItem;
export const selectBillSearch = (state: any) => state.payments.billSearch;
export const selectFromDate = (state: any) => state.payments.fromDate;
export const selectToDate = (state: any) => state.payments.toDate;
export const selectPayCreditBalance = (state: any) =>
  state.payments.payCreditBalance;
export const selectPayCreditBalanceModal = (state: any) =>
  state.payments.payCreditBalanceModal;

export default paymentSlice.reducer;

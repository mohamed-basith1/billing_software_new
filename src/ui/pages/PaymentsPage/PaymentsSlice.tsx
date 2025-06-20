import { createSlice } from "@reduxjs/toolkit";
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
  returnBillHistoryModal: false,
  returnBillHistoryList: [],
  returnAmountModel: false,
  creditBillFilter: "NOT PAID",
};

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setCurrentPaymentsTab: (state, action) => {
      state.currentPaymentsTab = action.payload;
    },
    setCreditBillFilter: (state, action) => {
      state.creditBillFilter = action.payload;
    },
    setUPIBillsList: (state, action) => {
      state.UPIBillsList = action.payload;
    },
    setReturnAmountModel: (state, action) => {
      state.returnAmountModel = action.payload;
    },

    setSelectedBills: (state, action) => {
      state.tempRemoveItem = [];
      state.selectedBills = action.payload;
    },
    removeBill: (state, action) => {
      const updatedItems = state.UPIBillsList.filter(
        (bill) => bill.bill_number !== action.payload.bill_number
      );
      state.UPIBillsList = updatedItems;
      state.selectedBills = {};
    },
    setItemRemove: (state, action) => {
      const codeToRemove = action.payload;

      if (!state.selectedBills) return; // Prevent errors if `selectedBills` is undefined

      // Aggregate removed items by unique_id
      state.tempRemoveItem = aggregateItemsByCode([
        ...state.tempRemoveItem,
        ...state.selectedBills.itemsList.filter(
          (item) => item.unique_id === codeToRemove
        ),
      ]);

      // Filter out the removed item
      const updatedItems = state.selectedBills.itemsList.filter(
        (item) => item.unique_id !== codeToRemove
      );

      // Calculate new total amount
      const totalAmount = updatedItems.reduce((sum, item) => {
        const quantity = item.uom === "gram" ? item.qty / 1000 : item.qty;
        return sum + quantity * item.rate;
      }, 0);

      const discountAmount =
        (totalAmount * Number(state.selectedBills.discount)) / 100;
      let total_amount = totalAmount - (discountAmount || 0);
      total_amount = Math.floor(total_amount);
      let balance_amount = totalAmount - state.selectedBills.amount_paid;
      // Update state correctly
      state.selectedBills.itemsList = updatedItems;
      state.selectedBills.sub_amount = totalAmount;
      state.selectedBills.total_amount = total_amount;
      // state.selectedBills.return_amount = Math.max(
      //   state.selectedBills?.amount_paid -
      //     updatedItems?.reduce((sum, item) => {
      //       const quantity = item.uom === "gram" ? item.qty / 1000 : item.qty;
      //       return sum + quantity * item.rate;
      //     }, 0),
      //   0
      // );
      state.selectedBills.return_amount = Math.max(0,
        state.selectedBills?.amount_paid - total_amount
      );
      state.selectedBills.balance = balance_amount < 0 ? 0 : balance_amount;
      state.selectedBills.paid =
        state.selectedBills.amount_paid >= state.selectedBills.total_amount
          ? true
          : false;
    },

    setReturnItem: (state, action) => {
      const index = state.selectedBills.itemsList.findIndex(
        (item) => item.unique_id === action.payload.unique_id
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

        let removeSelectedItem = [
          ...state.selectedBills.itemsList.filter(
            (data: any) => data.unique_id !== action.payload.unique_id
          ),
          action.payload,
        ];
        const totalAmount = removeSelectedItem.reduce((sum, item) => {
          const quantity = item.uom === "gram" ? item.qty / 1000 : item.qty;
          return sum + quantity * item.rate;
        }, 0);
        let total_amount =
          totalAmount -
          ((totalAmount * state.selectedBills.discount) / 100 || 0);
        total_amount = Math.floor(total_amount);
        let balance_amount = totalAmount - state.selectedBills.amount_paid;

        state.selectedBills.sub_amount = totalAmount;
        state.selectedBills.total_amount = total_amount;
        state.selectedBills.return_amount = Math.max(0,
          state.selectedBills?.amount_paid - total_amount
        );
        //     state.selectedBills?.itemsList?.reduce((sum, item) => {
        //       const quantity = item.uom === "gram" ? item.qty / 1000 : item.qty;
        //       return sum + quantity * item.rate;
        //     }, 0),
        //   0
        // ) ;
        state.selectedBills.balance = balance_amount < 0 ? 0 : balance_amount;
        state.selectedBills.paid =
          state.selectedBills.amount_paid >= state.selectedBills.total_amount
            ? true
            : false;

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
    setReturnBillHistoryModal: (state, action) => {
      state.returnBillHistoryModal = action.payload;
    },
    setReturnBillHistoryList: (state, action) => {
      state.returnBillHistoryList = action.payload;
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
    clearReturnBillDetail: (state) => {
      state.tempRemoveItem = [];
      state.billSearch = "";
    },
  },
});

// Actions
export const {
  setCurrentPaymentsTab,
  setReturnAmountModel,
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
  setReturnBillHistoryModal,
  setReturnBillHistoryList,
  clearReturnBillDetail,
  removeBill,
  setCreditBillFilter,
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
export const selectReturnBillHistoryModal = (state: any) =>
  state.payments.returnBillHistoryModal;
export const selectReturnBillHistoryList = (state: any) =>
  state.payments.returnBillHistoryList;
export const selectCreditBillFilter = (state: any) =>
  state.payments.creditBillFilter;

export const selectReturnAmountModel = (state: any) =>
  state.payments.returnAmountModel;
export default paymentSlice.reducer;

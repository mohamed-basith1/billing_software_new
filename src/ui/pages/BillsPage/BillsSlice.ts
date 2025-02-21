import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Bill {
  bill_number: number;
  items: any[];
  code: string | null;
  itemsearch: string;
  uom: string;
  qty: number | null;
  rate: number | null;
  amount: number | null;
  showSuggestions?: boolean;
  filteredItems?: string[];
}

interface BillsState {
  bills: Bill[];
  currentTab: number;
}

const initialState: BillsState = {
  bills: [
    {
      bill_number: 0,
      items: [],
      code: null,
      itemsearch: "",
      uom: "",
      qty: null,
      rate: null,
      amount: null,
      showSuggestions: false,
      filteredItems: [],
    },
  ],
  currentTab: 0,
};

const billsSlice = createSlice({
  name: "bills",
  initialState,
  reducers: {
    addBillsTabs: (state) => {
      const lastBillNumber =
        state.bills.length > 0
          ? state.bills[state.bills.length - 1].bill_number
          : 0;

      state.bills.push({
        bill_number: lastBillNumber + 1,
        items: [],
        code: null,
        itemsearch: "",
        uom: "",
        qty: null,
        rate: null,
        amount: null,
        showSuggestions: false,
        filteredItems: [],
      });
      state.currentTab = lastBillNumber + 1;
    },
    decrementBillsTabs: (state, action: PayloadAction<number>) => {
      if (action.payload > 0) {
        state.bills = state.bills.filter(
          (bill) => bill.bill_number !== action.payload
        );
        state.currentTab =
          state.bills.length > 0
            ? state.currentTab === action.payload
              ? state.bills[state.bills.length - 1].bill_number
              : state.currentTab
            : 0;
      }
    },
    setCurrentTab: (state, action: PayloadAction<number>) => {
      state.currentTab = action.payload;
    },
    setBillingField: <K extends keyof Bill>(
      state: BillsState,
      action: PayloadAction<{ bill_number: number; field: K; value:any }>
    ) => {
      const { bill_number, field, value } = action.payload;
      const bill = state.bills.find((b) => b.bill_number === bill_number);
      if (bill) {
        bill[field] = value;
      }
    },
  },
});

// Actions
export const {
  addBillsTabs,
  decrementBillsTabs,
  setCurrentTab,
  setBillingField,
} = billsSlice.actions;

// Selectors
export const selectBillValue = (state: any) => state.bills.bills;
export const selectCurrentTabValue = (state: any) => state.bills.currentTab;

export default billsSlice.reducer;

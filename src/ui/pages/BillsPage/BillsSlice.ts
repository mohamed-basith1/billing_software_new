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
    setItem: (state, action: any) => {
      const {
        code,
        uom,
        qty,
        rate,
        amount,
        item_name,
        createdAt,
        purchased_rate,
        edited,
      } = action.payload;
      console.log("set Item", action.payload);
      // Find the bill with the given bill_number
      const bill = state.bills.find((b) => b.bill_number === state.currentTab);

      if (bill) {
        // Check if the item already exists in the bill items
        const existingItem = bill.items.find((item) => item.code === code);
        const existingItemIndex = bill.items.findIndex(
          (item) => item.code === code
        );

        if (edited) {
          console.log("new update data", action.payload);
          bill.items[existingItemIndex] = {
            code,
            uom,
            qty,
            rate,
            amount,
            item_name,
            createdAt,
            id: code,
            purchased_rate,
          };
        }
        if (existingItem && edited === undefined) {
          // Update existing item's quantity and amount
          existingItem.qty += qty;
          existingItem.amount += amount;
        } else {
          if (edited === undefined) {
            // Add new item if it does not exist
            bill.items.push({
              code,
              uom,
              qty,
              rate,
              amount,
              item_name,
              createdAt,
              id: code,
              purchased_rate,
            });
          }
        }

        // Reset bill-related fields
        bill.code = null;
        bill.itemsearch = "";
        bill.uom = "";
        bill.qty = null;
        bill.rate = null;
        bill.amount = null;
        bill.showSuggestions = false;
        bill.filteredItems = [];
      }
    },

    // setItem: (state, action: any) => {
    //   const {
    //     bill_number,
    //     code,
    //     uom,
    //     qty,
    //     rate,
    //     amount,
    //     item_name,
    //     createdAt,
    //     purchased_rate,
    //   } = action.payload;

    //   // Find the bill with the given bill_number
    //   const bill = state.bills.find((b) => b.bill_number === bill_number);

    //   if (bill) {
    //     // Push the new item to the items array
    //     bill.items.push({
    //       code,
    //       uom,
    //       qty,
    //       rate,
    //       amount,
    //       item_name,
    //       createdAt,
    //       id: code,
    //       purchased_rate,
    //     });
    //     (bill.code = null),
    //       (bill.itemsearch = ""),
    //       (bill.uom = ""),
    //       (bill.qty = null),
    //       (bill.rate = null),
    //       (bill.amount = null),
    //       (bill.showSuggestions = false),
    //       (bill.filteredItems = []);
    //   }
    // },
    setBillingField: <K extends keyof Bill>(
      state: BillsState,
      action: PayloadAction<{ bill_number: number; field: any; value: any }>
    ) => {
      const { bill_number, field, value } = action.payload;
      const bill: any = state.bills.find((b) => b.bill_number === bill_number);
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
  setItem,
} = billsSlice.actions;

// Selectors
export const selectBillValue = (state: any) => state.bills.bills;
export const selectCurrentTabValue = (state: any) => state.bills.currentTab;

export default billsSlice.reducer;

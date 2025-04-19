import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Bill {
  bill_number: number;
  items: any[];
  code: string | null;
  unique_id: string;
  itemsearch: string;
  uom: string;
  qty: number | null;
  stock_qty: number | null;
  rate: number | null;
  amount: number | null;
  showSuggestions?: boolean;
  filteredItems?: string[];
  sub_amount: number;
  total_amount: number;
  discount: number;
  paid: boolean;
  payment_method: string;
  balance: number;
  customer_name: string;
  customer_id: string;
}

interface BillsState {
  bills: Bill[];
  currentTab: number;
  customerSelectModal: boolean;
  customerModal: boolean;
}

const initialState: BillsState = {
  bills: [
    {
      bill_number: 0,
      items: [],
      code: null,
      unique_id: "",
      itemsearch: "",
      uom: "",
      qty: null,
      stock_qty: null,
      rate: null,
      amount: null,
      showSuggestions: false,
      filteredItems: [],
      sub_amount: 0,
      total_amount: 0,
      discount: 0,
      paid: false,
      payment_method: "",
      balance: 0,
      customer_name: "",
      customer_id: "",
    },
  ],

  currentTab: 0,
  customerSelectModal: false,
  customerModal: false,
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
        unique_id: "",
        itemsearch: "",
        uom: "",
        qty: null,
        stock_qty: null,
        rate: null,
        amount: null,
        showSuggestions: false,
        filteredItems: [],
        sub_amount: 0,
        total_amount: 0,
        discount: 0,
        paid: false,
        payment_method: "",
        balance: 0,
        customer_name: "",
        customer_id: "",
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
        stock_qty,
        unique_id,
      } = action.payload;
      console.log("action.payload set item", action.payload);
      // Find the bill with the given bill_number
      const bill = state.bills.find((b) => b.bill_number === state.currentTab);

      if (bill) {
        // Check if the item already exists in the bill items
        const existingItem: any = bill.items.find(
          (item) => item.unique_id === unique_id
        );
        const existingItemIndex = bill.items.findIndex(
          (item) => item.unique_id === unique_id
        );

        if (edited) {
          bill.items[existingItemIndex] = {
            code,
            uom,
            qty,
            rate,
            amount,
            item_name,
            createdAt,
            unique_id,
            id: unique_id,
            purchased_rate,
            stock_qty,
          };
        }
        if (existingItem && edited === undefined) {
          // Update existing item's quantity and amount
          existingItem.qty = Number(existingItem.qty) + Number(qty);
          existingItem.amount = Number(existingItem.amount) + Number(amount);
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
              unique_id,
              createdAt,
              id: unique_id,
              purchased_rate,
              stock_qty,
            });
          }
        }

        // Reset bill-related fields
        bill.code = null;
        bill.itemsearch = "";
        bill.uom = "";
        bill.unique_id = "";
        bill.qty = null;
        bill.stock_qty = null;
        bill.rate = null;
        bill.amount = null;
        bill.showSuggestions = false;
        bill.filteredItems = [];
      }
    },
    removeItem: (state, action) => {
      const { code } = action.payload;

      // Find the bill with the given bill_number
      const bill = state.bills.find((b) => b.bill_number === state.currentTab);

      if (bill) {
        // Find the index of the item with the given code
        const itemIndex = bill.items.findIndex((item) => item.code === code);

        // If the item exists, remove it from the array
        if (itemIndex !== -1) {
          bill.items.splice(itemIndex, 1);
        }
      }
    },

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
    setCustomerSelectModal: (state, action) => {
      state.customerSelectModal = action.payload;
    },
    setCustomerModal: (state, action) => {
      state.customerModal = action.payload;
    },
    setBillPriceDetails: (state, action: any) => {
      const {
        sub_amount,
        total_amount,
        discount,
        paid,
        payment_method,
        balance,
      } = action.payload;

      // Find the bill with the given bill_number (matching currentTab)
      const billIndex = state.bills.findIndex(
        (b) => b.bill_number === state.currentTab
      );

      if (billIndex !== -1) {
        state.bills[billIndex] = {
          ...state.bills[billIndex],
          sub_amount,
          total_amount,
          discount,
          paid,
          payment_method,
          balance,
        };
      }
    },
    setBillCustomerDetails: (state, action: any) => {
      const { customer_id, customer_name } = action.payload;

      // Find the bill with the given bill_number (matching currentTab)
      const billIndex = state.bills.findIndex(
        (b) => b.bill_number === state.currentTab
      );

      if (billIndex !== -1) {
        state.bills[billIndex] = {
          ...state.bills[billIndex],
          customer_id,
          customer_name,
        };
      }
    },
    setClearBill: (state) => {
      const billIndex = state.bills.findIndex(
        (b) => b.bill_number === state.currentTab
      );
      if (billIndex !== -1) {
        state.bills[billIndex] = {
          bill_number: state.currentTab,
          items: [],
          code: null,
          itemsearch: "",
          uom: "",
          qty: null,
          rate: null,
          amount: null,
          showSuggestions: false,
          filteredItems: [],
          sub_amount: 0,
          total_amount: 0,
          discount: 0,
          paid: false,
          payment_method: "",
          balance: 0,
          customer_name: "",
          customer_id: "",
        };
      }
    },
    setClearBillCustomerDetails: (state) => {
      const billIndex = state.bills.findIndex(
        (b) => b.bill_number === state.currentTab
      );
      if (billIndex !== -1) {
        state.bills[billIndex] = {
          ...state.bills[billIndex],
          customer_name: "",
          customer_id: "",
        };
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
  setBillPriceDetails,
  setBillCustomerDetails,
  setClearBill,
  setClearBillCustomerDetails,
  removeItem,
} = billsSlice.actions;

// Selectors
export const selectBillValue = (state: any) => state.bills.bills;
export const selectCurrentTabValue = (state: any) => state.bills.currentTab;

export default billsSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  currentTab: 0,
  itemsTab: 0,
  itemsEntryTab: 0,
  itemName: "",
  itemUOM: "",
  itemPurchasedQuantity: "",
  perKgPurchasedPrice: "",
  marginPerUOM: "",
  sellingPricePerUOM: "",
  itemPurchasedPrice: "",
  expiryDate: "",
  itemCode: "",
  lowStockReminder: "",
};

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    setItemsTab: (state, action) => {
      state.itemsTab = action.payload;
    },
    setItemsEntryTab: (state, action) => {
      state.itemsEntryTab = action.payload;
    },
    setField: (state, action: PayloadAction<{ field: string; value: any }>) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    setClearItems: (state) => {
      state.itemName = "";
      state.itemUOM = "";
      state.itemPurchasedQuantity = "";
      state.perKgPurchasedPrice = "";
      state.marginPerUOM = "";
      state.sellingPricePerUOM = "";
      state.itemPurchasedPrice = "";
      state.expiryDate = "";
      state.itemCode = "";
      state.lowStockReminder = "";
    },
  },
});

// Actions
export const { setCurrentTab, setItemsTab, setItemsEntryTab, setField,setClearItems } =
  itemsSlice.actions;

// Selectors

export const selectCurrentTab = (state: any) => state.items.currentTab;
export const selectItemsTab = (state: any) => state.items.itemsTab;
export const selectItemsEntryTab = (state: any) => state.items.itemsEntryTab;
export const selectItems = (state: any) => state.items;
export default itemsSlice.reducer;

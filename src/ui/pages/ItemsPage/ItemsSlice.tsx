import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  currentTab: 0,
  itemsTab: 0,
  itemsEntryTab:0
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
  },
});

// Actions
export const { setCurrentTab, setItemsTab,setItemsEntryTab } = itemsSlice.actions;

// Selectors

export const selectCurrentTab = (state: any) => state.items.currentTab;
export const selectItemsTab = (state: any) => state.items.itemsTab;
export const selectItemsEntryTab = (state: any) => state.items.itemsEntryTab;
export default itemsSlice.reducer;

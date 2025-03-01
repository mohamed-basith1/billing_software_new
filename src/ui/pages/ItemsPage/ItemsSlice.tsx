import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  currentTab: 0,
  itemsTab: 0,
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
  },
});

// Actions
export const { setCurrentTab, setItemsTab } = itemsSlice.actions;

// Selectors

export const selectCurrentTab = (state: any) => state.items.currentTab;
export const selectItemsTab = (state: any) => state.items.itemsTab;
export default itemsSlice.reducer;

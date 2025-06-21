import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState: any = {
  currentTab: 0,
  itemsTab: 0,
  itemsEntryTab: 0,
  summary:{},
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
  itemSearch: "",
  dealerName: "",
  selectedItemName: "",
  itemListSearch: "",
  dealerPurchasedPrice: 0,
  dealerGivenUPIAmount: 0,
  dealerGivenCashAmount: 0,
  loadItemWithDealer: [],
  newItemWithDealer: [],
  filterSearchItem: null,
  DateTrigger: false,
  itemList: [],
  selectedItem: {},
  editSelectedItemModal: false,
  lowStockItemList: [],
  dealerHistoryList: [],
  dealerHistoryselected: {},
  dealerHistorySummary: {},
  newItemEntryModel: false,
  payDealerAmountModel: false,
  payDealerAmountHistoryModel: false,
  dealerPurchasedDeleteModel: false,
};

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    setPayDealerAmountModel: (state, action) => {
      state.payDealerAmountModel = action.payload;
    },
    setPayDealerAmountHistoryModel: (state, action) => {
      state.payDealerAmountHistoryModel = action.payload;
    },
    setDealerPurchasedDeleteModel: (state, action) => {
      state.dealerPurchasedDeleteModel = action.payload;
    },
    setItemSearch: (state, action) => {
  
      state.itemSearch = action.payload;
    },
    setItemSummary: (state, action) => {
      state.summary = action.payload;
    },
    setItemListSearch: (state, action) => {
      state.itemListSearch = action.payload;
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

    setFilterSearchItem: (state, action) => {
      state.filterSearchItem = action.payload;
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

    setClearItemsearch: (state) => {
      state.itemSearch = "";
    },
    setClearFilterData: (state) => {
      state.filterSearchItem = null;
      state.itemSearch = "";
    },
    setDateTigger: (state) => {
      state.DateTrigger = !state.DateTrigger;
    },
    setItemList: (state, action) => {
      state.itemList = action.payload;
    },

    setSelectItemName: (state, action) => {
      state.selectedItemName = action.payload;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },

    setEditSelectItem: (state, action) => {
      if (action.payload.field === undefined) {
        Object.entries(action.payload).forEach(([key, value]) => {
          state.selectedItem[key] = value;
        });
      } else {
        state.selectedItem[action.payload.field] = action.payload.value;
      }
    },
    setEditItemModal: (state, action) => {
      state.editSelectedItemModal = action.payload;
      if (action.payload === false) {
        state.selectedItemName = "";
      }
    },
    setLowStockItemList: (state, action) => {
      state.lowStockItemList = action.payload;
    },
    setNewItemEntryModel: (state, action) => {
      state.newItemEntryModel = action.payload;
    },

    setDealerDetails: (state, action) => {
      state[action.payload.field] = action.payload.value;
    },
    setLoadItemWithDealer: (state, action) => {
      const incomingItem = action.payload;
      const existingItemIndex = state.loadItemWithDealer.findIndex(
        (item) => item.unique_id === incomingItem.unique_id
      );

      if (existingItemIndex !== -1) {
        // Item already exists, so update stock_qty
        state.loadItemWithDealer[existingItemIndex].stock_qty +=
          incomingItem.stock_qty;
        state.loadItemWithDealer[existingItemIndex].total_purchased_amount +=
          incomingItem.total_purchased_amount;
      } else {
        // Item doesn't exist, add to list
        state.loadItemWithDealer.push({
          ...incomingItem,
          id: incomingItem.item_name,
        });
      }
    },
    setNewItemWithDealer: (state, action) => {
      const incomingItem = action.payload;
      const existingItemIndex = state.newItemWithDealer.findIndex(
        (item) =>
          item.item_name.replace(/\s+/g, "").toLowerCase() ===
          incomingItem.item_name.replace(/\s+/g, "").toLowerCase()
      );

      if (existingItemIndex !== -1) {
        toast.error(
          "Same item name is already present in the current entry list.",
          { position: "bottom-left" }
        );
      } else {
        // Item doesn't exist, add to list
        state.newItemWithDealer.push({
          ...incomingItem,
          id: incomingItem.item_name,
        });

        state.newItemEntryModel = false;
      }
    },
    removeEnteredListedItem: (state, action) => {
      const Income_unique_id = action.payload.unique_id;
      //This is for remove exist item in the list
      const existingItemIndex = state.loadItemWithDealer.findIndex(
        (item) => item.unique_id === Income_unique_id
      );
      if (existingItemIndex !== -1) {
        state.loadItemWithDealer.splice(existingItemIndex, 1);
      }

      //this is for remove new item in the list
      const existingNewItemIndex = state.newItemWithDealer.findIndex(
        (item) => item.unique_id === Income_unique_id
      );
      if (existingNewItemIndex !== -1) {
        state.newItemWithDealer.splice(existingNewItemIndex, 1);
      }
    },

    setDealerHistoryList: (state, action) => {
      state.dealerHistoryList = action.payload;
    },
    setDealerHistoryselected: (state, action) => {
      state.dealerHistoryselected = action.payload;
    },
    setUpdateDealerBill: (state, action) => {
      const Income_unique_id = action.payload._id;
      //This is for remove exist item in the list
      const existingItemIndex = state.dealerHistoryList.findIndex(
        (item) => item._id === Income_unique_id
      );
      if (existingItemIndex !== -1) {
        state.dealerHistoryList[existingItemIndex] = action.payload;
      }
      state.dealerHistoryselected = action.payload;
    },
    updateItemList: (state, action) => {

      const Income_unique_id = action.payload.unique_id;
      const existingItemIndex = state.itemList.findIndex(
        (item) => item.unique_id === Income_unique_id
      );
      if (existingItemIndex !== -1) {
        state.itemList[existingItemIndex] = action.payload;
      }
    },
    deleteItemList: (state, action) => {
      const Income_unique_id = action.payload;
      const existingItemIndex = state.itemList.findIndex(
        (item) => item.unique_id === Income_unique_id
      );
      if (existingItemIndex !== -1) {
        state.itemList.splice(existingItemIndex, 1);
      }
    },
    setDeleteDealerBill: (state, action) => {
      const Income_unique_id = action.payload._id;
      //This is for remove exist item in the list
      const existingItemIndex = state.dealerHistoryList.findIndex(
        (item) => item._id === Income_unique_id
      );
      if (existingItemIndex !== -1) {
        state.dealerHistoryList.splice(existingItemIndex, 1);
      }
      state.dealerHistoryselected = {};
    },

    setDeleteDealerPaymentHistory: (state, action) => {

      const Income_unique_id = action.payload.data._id;
      //dealerHistoryselected
      // This is for remove exist item in the list
      const existingItemIndex = state.dealerHistoryselected.history.findIndex(
        (item) => item._id === Income_unique_id
      );
      if (existingItemIndex !== -1) {
        state.dealerHistoryselected = action.payload.response;
      }

      const existingItemIndexx = state.dealerHistoryList.findIndex(
        (item) => item._id === state.dealerHistoryselected._id
      );
      if (existingItemIndex !== -1) {
        state.dealerHistoryList[existingItemIndexx] = action.payload.response;
      }
    },
    setDealerHistorySummary: (state, action) => {
      state.dealerHistorySummary = action.payload;
    },

    clearDealerDetails: (state) => {
      state.dealerName = "";
      state.dealerPurchasedPrice = "";
      state.loadItemWithDealer = [];
      state.newItemWithDealer = [];
    },
  },
});

// Actions
export const {
  setCurrentTab,
  setItemsTab,
  setSelectedItem,
  setSelectItemName,
  setEditItemModal,
  updateItemList,
  deleteItemList,
  setItemSummary,
  setEditSelectItem,
  setDeleteDealerBill,
  setUpdateDealerBill,
  setItemsEntryTab,
  setField,
  setClearItems,

  setItemListSearch,
  setItemSearch,
  setFilterSearchItem,
  setClearItemsearch,
  setClearFilterData,
  setDateTigger,
  setItemList,
  setLowStockItemList,
  setNewItemEntryModel,
  setDealerDetails,
  setLoadItemWithDealer,
  setNewItemWithDealer,
  removeEnteredListedItem,
  clearDealerDetails,
  setDealerHistoryList,
  setDealerHistoryselected,
  setDealerHistorySummary,
  setPayDealerAmountModel,
  setPayDealerAmountHistoryModel,
  setDealerPurchasedDeleteModel,
  setDeleteDealerPaymentHistory,
} = itemsSlice.actions;

// Selectors

export const selectCurrentTab = (state: any) => state.items.currentTab;
export const selectItemsTab = (state: any) => state.items.itemsTab;
export const selectItemsSummary = (state: any) => state.items.summary;
export const selectItemsEntryTab = (state: any) => state.items.itemsEntryTab;
export const selectItemSearch = (state: any) => state.items.itemSearch;
export const selectItemListSearch = (state: any) => state.items.itemListSearch;

export const selectDateTigger = (state: any) => state.items.DateTrigger;
export const selectItemList = (state: any) => state.items.itemList;
export const selectSelectedItem = (state: any) => state.items.selectedItem;
export const selectEditSelectedItemModal = (state: any) =>
  state.items.editSelectedItemModal;
export const selectSelectedItemName = (state: any) =>
  state.items.selectedItemName;

export const selectLowStockItemList = (state: any) =>
  state.items.lowStockItemList;
export const selectFilterSearchItem = (state: any) =>
  state.items.filterSearchItem;
export const selectNewItemEntryModel = (state: any) =>
  state.items.newItemEntryModel;
export const selectLoadItemWithDealer = (state: any) =>
  state.items.loadItemWithDealer;
export const selectNewItemWithDealer = (state: any) =>
  state.items.newItemWithDealer;

export const selectDealerPurchasedPrice = (state: any) =>
  state.items.dealerPurchasedPrice;
export const selectDealerHistoryList = (state: any) =>
  state.items.dealerHistoryList;
export const selectDealerHistoryselected = (state: any) =>
  state.items.dealerHistoryselected;

export const selectDealerHistorySummary = (state: any) =>
  state.items.dealerHistorySummary;
export const selectPayDealerAmountModel = (state: any) =>
  state.items.payDealerAmountModel;
export const selectPayDealerAmountHistoryModel = (state: any) =>
  state.items.payDealerAmountHistoryModel;

export const selectDealerPurchasedDeleteModel = (state: any) =>
  state.items.dealerPurchasedDeleteModel;

export const selectItems = (state: any) => state.items;

export default itemsSlice.reducer;

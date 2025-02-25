import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  customersList: [],
  customerName: "",
  customerAddress: "",
  customerArea: "",
  customerPincode: "",
  customerState: "Karnataka",
  customerPrimaryContact: "",
  customerSecondaryContact: "",
  customerEmail: "",
  id: "",
  currentTab: 0,
  customerSearch: "",
  selectedCustomer: null,
  customerSelectModal: false,
  customerCreateModal: false,
  customerEditModal: false,
  customerDeleteModal: false,
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    setCustomersList: (state, action) => {
      state.customersList = action.payload;
    },
    setCustomerSearch: (state, action) => {
      state.customerSearch = action.payload;
    },

    setCustomerDetails: (state, action: any) => {
      if (action.payload.field === undefined) {
        Object.entries(action.payload).forEach(([key, value]) => {
          state[key] = value;
          if (key === "id" || key === "_id") {
            state.id = value;
          }
        });
      } else {
        state[action.payload.field] = action.payload.value;
        if (action.payload.field === "id" || action.payload.field === "_id") {
          state.id = action.payload.value;
        }
      }
    },
    clearCustomerDetails: (state) => {
      state.customerName = "";
      state.customerAddress = "";
      state.customerArea = "";
      state.customerPincode = "";
      state.customerState = "Karnataka";
      state.customerPrimaryContact = "";
      state.customerSecondaryContact = "";
      state.customerEmail = "";
      state.customerId = "";
   
    },
    setSelectedCustomer: (state, action: any) => {
     
      if (action.payload.edit !== undefined) {
        const index = state.customersList.findIndex(
          (data: any) => data.id === action.payload.data.id
        );

        if (index !== -1) {
          state.customersList[index] = action.payload.data;
        }

        state.selectedCustomer = action.payload.data;
      } else {
        state.selectedCustomer = action.payload;
      }
    },
    setCustomerSelectModal: (state, action) => {
      state.customerSelectModal = action.payload;
    },
    setCustomerCreateModal: (state, action) => {
     
      state.customerCreateModal = action.payload;
    },
    setCustomerEditModal: (state, action) => {
      state.customerEditModal = action.payload;
    },
    setCustomerDeleteModal: (state, action) => {
      state.customerDeleteModal = action.payload;
    },
    resetSelectedCustomerAfterDeletion:(state,action)=>{
       state.selectedCustomer = null;
       const index = state.customersList.findIndex(
        (data: any) => data.id === action.payload
      );
      
      if (index !== -1) {
        state.customersList.splice(index, 1);
      }
    }
  },
});

// Actions
export const {
  setCustomersList,
  setCurrentTab,
  setCustomerSearch,
  setCustomerDetails,
  clearCustomerDetails,
  setSelectedCustomer,
  setCustomerSelectModal,
  setCustomerCreateModal,
  setCustomerDeleteModal,
  setCustomerEditModal,
  resetSelectedCustomerAfterDeletion
} = customersSlice.actions;

// Selectors
export const selectCustomersList = (state: any) =>
  state.customers.customersList;

export const selectCurrentTab = (state: any) => state.customers.currentTab;
export const selectCustomerSearch = (state: any) =>
  state.customers.customerSearch;

export const selectCustomerDetails = (state: any) => state.customers;
export const selectSelectedCustomer = (state: any) =>
  state.customers.selectedCustomer;
export const selectCustomerSelectModal = (state: any) =>
  state.customers.customerSelectModal;
export const selectCustomerCreateModal = (state: any) =>
  state.customers.customerCreateModal;
export const selectCustomerEditModal = (state: any) =>
  state.customers.customerEditModal;
export const selectCustomerDeleteModal = (state: any) =>
  state.customers.customerDeleteModal;

export default customersSlice.reducer;

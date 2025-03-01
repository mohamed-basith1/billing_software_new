// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import billsReducer from "../pages/BillsPage/BillsSlice";
import LoginReducer from "../pages/LoginPage/LoginSlice";
import CustomersReducer from "../pages/CustomersPage/CustomersSlice";
import ItemsReducer from "../pages/ItemsPage/ItemsSlice";

export const store = configureStore({
  reducer: {
    bills: billsReducer,
    login: LoginReducer,
    customers: CustomersReducer,
    items:ItemsReducer
  },
});

// TypeScript types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

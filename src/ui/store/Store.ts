// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import billsReducer from "../pages/BillsPage/BillsSlice";
import LoginReducer from "../pages/LoginPage/LoginSlice";
import CustomersReducer from "../pages/CustomersPage/CustomersSlice";
import ItemsReducer from "../pages/ItemsPage/ItemsSlice";
import PaymentsReducer from "../pages/PaymentsPage/PaymentsSlice";
import ReportsReducer from "../pages/ReportPage/ReportsSlice"

export const store = configureStore({
  reducer: {
    bills: billsReducer,
    login: LoginReducer,
    customers: CustomersReducer,
    items: ItemsReducer,
    payments: PaymentsReducer,
    reports:ReportsReducer
  },
});

// TypeScript types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

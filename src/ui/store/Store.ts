// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import billsReducer from "../pages/BillsPage/BillsSlice";
import LoginReducer from "../pages/LoginPage/LoginSlice";

export const store = configureStore({
  reducer: {
    bills: billsReducer,
    login: LoginReducer,
  },
});

// TypeScript types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

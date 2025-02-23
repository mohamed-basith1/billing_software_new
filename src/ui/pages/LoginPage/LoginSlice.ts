import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  isAuthenticate: false,
  username: "",
  role: "",
};

const loginSlice = createSlice({
  name: "authendicate",
  initialState,
  reducers: {
    setAuthenticate: (state, action) => {
      state.isAuthenticate = action.payload;
    },
    setUserName: (state, action) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
    logoutAction: (state) => {
      state.username = "";
      state.role = "";
      state.isAuthenticate = false;
    },
  },
});

// Actions
export const { setAuthenticate, setUserName, logoutAction } =
  loginSlice.actions;

// Selectors
export const selectAuthenticate = (state: any) => state.login.isAuthenticate;
export const selectUserName = (state: any) => state.login.username;
export const selectUserRole = (state: any) => state.login.role;

export default loginSlice.reducer;

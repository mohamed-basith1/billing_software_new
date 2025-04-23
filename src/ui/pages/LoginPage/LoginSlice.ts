import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  isAuthenticate: false,
  licenseAuth: false,
  username: "",
  role: "",
  updateUserModal: false,
};

const loginSlice = createSlice({
  name: "authendicate",
  initialState,
  reducers: {
    setAuthenticate: (state, action) => {
      state.isAuthenticate = action.payload;
    },
    setUpdateUserModal: (state, action) => {
      state.updateUserModal = action.payload;
    },
    //updateUserModal
    setUserName: (state, action) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
    setLicenseAuth: (state, action) => {
      state.licenseAuth = action.payload;
    },
    logoutAction: (state) => {
      state.username = "";
      state.role = "";
      state.isAuthenticate = false;
    },
  },
});

// Actions
export const {
  setAuthenticate,
  setUserName,
  logoutAction,
  setLicenseAuth,
  setUpdateUserModal,
} = loginSlice.actions;

// Selectors
export const selectAuthenticate = (state: any) => state.login.isAuthenticate;
export const selectLicenseAuth = (state: any) => state.login.licenseAuth;
export const selectUpdateUserModal = (state: any) =>
  state.login.updateUserModal;

export const selectUserName = (state: any) => state.login.username;
//
export const selectUserRole = (state: any) => state.login.role;

export default loginSlice.reducer;

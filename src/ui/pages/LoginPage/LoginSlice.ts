import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  isAuthenticate: false,
  user_name: "",
};

const loginSlice = createSlice({
  name: "authendicate",
  initialState,
  reducers: {
    setAuthenticate: (state, action) => {
      state.isAuthenticate = action.payload;
    },
    setUserName: (state, action) => {
      state.user_name = action.payload;
    },
  },
});

// Actions
export const { setAuthenticate, setUserName } = loginSlice.actions;

// Selectors
export const selectAuthenticate = (state: any) => state.login.isAuthenticate;

export default loginSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { userProfile } from "../user/profileSlice";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    isAuthenticated: false,
    authChecked: false        
  },

  reducers: {
    loginSuccess: (state) => {
      state.isAuthenticated = true;
      state.authChecked = true;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.authChecked = true;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(userProfile.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(userProfile.rejected, (state) => {
        state.isAuthenticated = false;
        state.authChecked = true;
      });
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

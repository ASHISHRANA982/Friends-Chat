import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: Cookies.get("token") || null
  }
  , reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      Cookies.set("token", action.payload, { expires: 7,
        path:'/'
       });
    },
    logout: (state) => {
      state.token = null;
      Cookies.remove("token",{
        path:'/'
      });
    }
  }

})

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
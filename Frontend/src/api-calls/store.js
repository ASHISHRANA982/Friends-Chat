import { configureStore } from "@reduxjs/toolkit";
import createSlice from './auth/registerSlice';
import profileSlice from "./user/profileSlice"
import authSlice from "./auth/authSlice"
import friendsSlice from "./user/friendsSlice"
import messageSlice from "./chart/messageSlice"
import { combineReducers } from "@reduxjs/toolkit";
import contactSlice from "./user/contactSlice"

const appReducer = combineReducers({
  createSlice: createSlice,
  profileSlice: profileSlice,
  authSlice: authSlice,
  friendsSlice: friendsSlice,
  messageSlice: messageSlice,
  contactSlice:contactSlice,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    state = undefined;
  }

  return appReducer(state, action);
};


const store = configureStore({
  reducer:rootReducer,
})

export default store;

export const resetStore = () => ({
  type: "RESET_STORE",
});
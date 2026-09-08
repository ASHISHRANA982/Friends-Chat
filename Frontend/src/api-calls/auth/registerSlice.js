import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";


export const createUser = createAsyncThunk(
  "create/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/register/createUser", userData);
      return response.data;
    }
    catch (error) {
        // return rejectWithValue(error.response?.data);
         return rejectWithValue(
        error.response?.data || {
          status: 500,
          message: "Something went wrong",
          errors: null
        }
      );
    }
  }
)

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      
      const response = await api.post("/user/register/loginUser", userData);
      return response.data;
    }
    catch (error) {
       return rejectWithValue(
        error.response?.data || {
          status: 500,
          message: "Something went wrong",
          errors: null
        }
      );
    }
  }
)

const createSilce = createSlice({
  name: "user",
  initialState: {
    loading: false,
    success: null,
    error: null
  },
  reducers: {
    clearMessage: (state) => {
      state.loading = false,
      state.success = null,
      state.error = null
    }

  },

  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {   //User Register
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
          state.error = action.payload;
      })

      .addCase(loginUser.pending,(state)=>{   //User Login
        state.loading=true;
      })
       .addCase(loginUser.fulfilled,(state,action)=>{
        state.loading=false;
        state.success=action.payload;
      })
       .addCase(loginUser.rejected,(state,action)=>{
        state.loading=false;
        state.error=action.payload;
      })
  }
});

export const { clearMessage } = createSilce.actions;
export default createSilce.reducer;


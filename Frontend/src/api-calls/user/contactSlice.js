import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const contact = createAsyncThunk(
  "contact/userContact",
  async (request, { rejectWithValue }) => {
    try {
      const res = await api.post("/contact/saveContact", request)
      return res.data;
    }
    catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          status: 500,
          message: "something went wrong",
          errors: null
        }
      )
    }
  }
)

const contactSlice=createSlice(
  {
    name:"contact",

    initialState:{
        contactLoading:false,
        contactMessage:null,
        contactError:null
    },
    reducers:{
        clearContact:(state)=>{
          state.contactLoading=false;
          state.contactMessage=null;
          state.contactError=null;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(contact.pending,(state)=>{
          state.contactLoading=true;
        })
        .addCase(contact.fulfilled,(state,action)=>{
          state.contactLoading=false;
          state.contactMessage=action.payload;
        })
        .addCase(contact.rejected,(state,action)=>{
          state.contactLoading=false;
          state.contactMessage=action.payload;
        })
    }
  }
);

export const{clearContact}=contactSlice.actions;
export default contactSlice.reducer;
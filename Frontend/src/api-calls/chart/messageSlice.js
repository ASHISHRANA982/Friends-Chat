import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../services/api"
import Cookies from "js-cookie"

export const getConversations = createAsyncThunk(    
  "message/getMessages",
  async (request, { rejectWithValue }) => {

    const token = Cookies.get("token");

    try {
      const res = await api.post(`/message/conversation`,request,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )
      return res.data;
    }
    catch (error) {
      return rejectWithValue(
        error.response?.data ||
        {
          status:500,
          message:"something went wrong",
          errors:null
        }

      );
    }
  }

)

const messageSlice = createSlice({
  name: "message",

  initialState: {
    loading: false,
    conversations: [],
    error: null
  },

  reducers: {
    clearConversation: (state) => {
      state.loading = false;
      state.conversations = [];
      state.error = null;
    },
    addMessage: (state, action) => {
    if (!state.conversations) {
      state.conversations = [];
    }
    state.conversations.push(action.payload);
  }
  },

  extraReducers:(builder)=>{

   builder
   .addCase(getConversations.pending,(state)=>{
    state.loading=true;
    state.conversations=[];
   })
   .addCase(getConversations.fulfilled,(state,action)=>{
    state.loading=false;
    state.conversations=action.payload.data;
   })
   .addCase(getConversations.rejected,(state,action)=>{
    state.loading=false;
    state.error=action.payload;
   })

  }

})

export const {clearConversation,addMessage}=messageSlice.actions;
export default messageSlice.reducer;
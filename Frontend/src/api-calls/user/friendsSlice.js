import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import Cookies from "js-cookie";


export const addFriends = createAsyncThunk(
  "friends/addFriends",
  async (request, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {

      const response = await api.post(
        "/user/addFriends", request,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    }
    catch (error) {
      return rejectWithValue(error.response?.data
      ||
      {
        status:500,
        message:"something went wrong",
        errors:null
      }
      );
    }
  }
)

export const friendPendingProfile = createAsyncThunk(
  "friends/friendsPendingProfile",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {

      const response = await api.get("/user/getPendingFriendRequest",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return response.data;
    }
    catch (error) {
      return rejectWithValue(error.response?.data
        || {
          status:500,
          message:"something went wrong",
          errors:null
        }
      );
    }
  }
)

export const friendInvitationProfile = createAsyncThunk(
  "friends/friendsInvitationProfile",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {

      const response = await api.get("/user/getPendingFriendInvitation",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    }
    catch (error) {
      return rejectWithValue(error.response?.data
        ||
        {
          status:500,
          message:"something went wrong",
          errors:null
        }
      );
    }
  }
)

export const updateRequestStatus = createAsyncThunk(
  "friend/updateFriendRequest",
  async (request, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {
      const response = await api.put(
        "/user/acceptRequest", request,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data;
    }
    catch (error) {
      return rejectWithValue(error.response?.data
        ||
        {
          status:500,
          message:"something went wrong",
          errors:null
        }
      );
    }
  }
)

export const getAcceptedFriends = createAsyncThunk(
  "friend/getAcceptedFriend",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {
      const response = await api.get(
        "/user/getAcceptedFriends", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      )
      return response.data;
    }
    catch (error) {

      return rejectWithValue(
        error.response?.data || {
            status:500,
            message:"something went wrong",
            errors:null
        } 
      );

    }
  }
)

export const updateAccountBlockConnected = createAsyncThunk(
  "friend/updateAccountBlockConnected",
  async (request, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {

      const res = await api.put("/message/updateRelationStatus", request,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return res.data;

    }
    catch (error) {
       return rejectWithValue(
        error.response?.data||{
          status:500,
          message:"Failed To Update Status",
          errors:null
        }
      );
    }
  }
)

const friendSlice = createSlice({
  name: "friends",
  initialState: {
    loading: false,

    pendingRequests: null,
    pendingRequestsError:null,

    invitations: null,
    invitationError:null,

    updateInvitation: null,
    updateInvitationError:null,
    updateInvitationLoading:false,

    acceptedFriend: null,
    acceptedFriendStatus: "idle",
    acceptedFriendError:null,

    blockAndConnectedLoading:false,
    blockAndconnectedStatus: null,
    blockAndconnectedStatusError:null,

    error: null,

    addMessage: null,
    addError: null
  },

  reducers: {
    clearPendingRequests: (state) => {
      state.loading = false;
      state.pendingRequests = null;
      state.pendingRequestsError = null;
    },

    clearInvitations: (state) => {
      state.loading = false;
      state.invitations = null;
      state.invitationError = null;
    },

    clearUpdateInvitation: (state) => {
      state.updateInvitationLoading = false;
      state.updateInvitation = null;
      state.updateInvitationError = null;
    },

    clearAcceptedFriends: (state) => {
      state.loading = false;
      state.acceptedFriend = null;
      state.acceptedFriendError = null;
      state.acceptedFriendStatus = 'idle';
    },

    clearFriendsAddData: (state) => {
      state.loading = false;
      state.addMessage = null;
      state.addError = null;
    },
    clearBlockAndConnected: (state) => {
      state.blockAndConnectedLoading = false;
      state.blockAndconnectedStatus = null;
      state.blockAndconnectedStatusError = null;
    }
  },

  extraReducers: (builder) => {
    builder

     // Add Friend
      .addCase(addFriends.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.addMessage = action.payload;
      })
      .addCase(addFriends.rejected, (state, action) => {
        state.loading = false;
        state.addError = action.payload;
      })

      // Pending Requests
      .addCase(friendPendingProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(friendPendingProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = action.payload;
      })
      .addCase(friendPendingProfile.rejected, (state, action) => {
        state.loading = false;
        state.pendingRequestsError = action.payload;
      })

      // Invitations
      .addCase(friendInvitationProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(friendInvitationProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.invitations = action.payload;
      })
      .addCase(friendInvitationProfile.rejected, (state, action) => {
        state.loading = false;
        state.invitationError = action.payload;
      })

      //update invitation request

      .addCase(updateRequestStatus.pending, (state) => {
        state.updateInvitationLoading = true;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.updateInvitationLoading = false;
        state.updateInvitation = action.payload;
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.updateInvitationLoading = false;
        state.updateInvitationError = action.payload;
      })

      //get accept friend

      .addCase(getAcceptedFriends.pending, (state) => {
        state.loading = true;
        state.acceptedFriendStatus = 'loading';
      })
      .addCase(getAcceptedFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.acceptedFriend = action.payload;
        state.acceptedFriendStatus = 'successed';
      })
      .addCase(getAcceptedFriends.rejected, (state, action) => {
        state.loading = false;
        state.acceptedFriendError = action.payload;
      })

      //block and connected status

      .addCase(updateAccountBlockConnected.pending, (state) => {
        state.blockAndConnectedLoading = true;
      })
      .addCase(updateAccountBlockConnected.fulfilled, (state, action) => {
        state.blockAndConnectedLoading = false;
        state.blockAndconnectedStatus = action.payload;
      })
      .addCase(updateAccountBlockConnected.rejected, (state, action) => {
        state.blockAndConnectedLoading = false;
        state.blockAndconnectedStatusError = action.payload;
      });

  }
});

export const { clearAcceptedFriends, clearFriendsAddData, clearInvitations, clearPendingRequests, clearUpdateInvitation, clearBlockAndConnected } = friendSlice.actions;
export default friendSlice.reducer;
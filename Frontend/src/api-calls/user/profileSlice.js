import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import Cookies from "js-cookie";
import { toast } from "sonner";


export const userProfile = createAsyncThunk(
  "profile/userProfile",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {
      const response = await api.get("/user/getUser",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    }
    catch (error) {
      console.log( "ERROR:",error.response?.data)
        return rejectWithValue(
        error.response?.data || {
          status: 500,
          message: "Something went wrong",
          errors: null
        }
      );
    }
  }
);

export const userLogout = createAsyncThunk(
  "logout/userLogout",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {
      const response = await api.post("/user/register/logoutUser",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
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

export const updateProfileImage = createAsyncThunk(
  "profile/updateImage",
  async (imageUrl, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {
      const res = await api.put(
        "/user/updatePic",
        {
          image: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          status: 500,
          message: "Something went wrong",
          errors: null
        }
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (request, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {
      const res = await api.put(
        "/user/updateProfile",
        request,
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
        error.response?.data || {
          status: 500,
          message: "Something went wrong",
          errors: null
        }
      );
    }
  }
);

export const getQuickInfo = createAsyncThunk(
  "profile/InfoProfile",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {
      const res = await api.get("/message/countInfo", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      );
      return res.data;
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

export const deleteCloudinaryImage = createAsyncThunk(
  "profile/deleteCloudinaryImage",

  async (publicId, { rejectWithValue }) => {

    const token = Cookies.get("token");

    try {

      const res = await api.delete(
        "/user/deleteCloudinaryImage",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            publicId: publicId,
          },
        }
      );

      return res.data;

    } catch (error) {

      return rejectWithValue(
        error.response?.data || "Image deletion failed"
      );
    }
  }
);

const profileSilce = createSlice({
  name: "profile",
  initialState: {
    loading: false,
    success: null,
    logoutMessage: null,
    quickInfo: null,
    error: null,
    profileError:null,
    accountChecked:false,
    accountValidate:false,

    profileUpdateMessage: null,
    profileUpdateError:null,

    imageUpdateSuccessMsg:null,
    imageUpdateErrorMsg:null

  },
  reducers: {
    clearProfileMessage: (state) => {
      state.loading = false;
      state.success = null;
      state.profileError = null;
    }
    ,
    clearLogoutMessage: (state) => {
      state.loading = false;
      state.logoutMessage = null;
      state.error = null;
    },
    clearQuickInfo: (state) => {
      state.loading = false;
      state.quickInfo = null;
      state.error = null;
    },
    clearProfileUpdate: (state) => {
      state.loading = false;
      state.profileUpdateMessage = null;
      state.profileUpdateError = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(userProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(userProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
        
        state.accountChecked=true;
        state.accountValidate=true;
        
      })
      .addCase(userProfile.rejected, (state, action) => {
        state.loading = false;
        state.profileError = action.payload;

        state.accountChecked=true;
        state.accountValidate=false;
      })
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogout.fulfilled, (state, action) => {
        state.loading = false;
        state.logoutMessage = action.payload;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfileImage.pending, (state) => {
        state.updateImageLoading = true;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.updateImageLoading = false;
        state.imageUpdateSuccessMsg = action.payload;
        // toast.success("Image Updated successfully")
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.updateImageLoading = false;
        state.imageUpdateErrorMsg = action.payload;
      })
      .addCase(getQuickInfo.pending, (state) => {  //get quick info
        state.loading = true;
      })
      .addCase(getQuickInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.quickInfo = action.payload;
        // toast.success("Quick Info Loaded");
      })
      .addCase(getQuickInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {  //update profile
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileUpdateMessage = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.profileUpdateError = action.payload;
      })
      .addCase(deleteCloudinaryImage.pending, (state) => {  //delete cloudinary image
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCloudinaryImage.fulfilled, (state, action) => {
        state.loading = false;
        toast.success(action.payload);
      })
      .addCase(deleteCloudinaryImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

export const { clearProfileMessage, clearLogoutMessage, clearQuickInfo, clearProfileUpdate } = profileSilce.actions;
export default profileSilce.reducer;
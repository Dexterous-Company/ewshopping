import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  banners: [],
  status: "idle",
  error: null,
};

// ✅ Always fetch banners from API (no localStorage used)ss
export const getBanners = createAsyncThunk(
  "banner/getBanners",
  async (_, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/mainhomeslider/slidersImage`;
      const response = await axios.get(url);
      
      return response.data.mainHomeSliders;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    resetBanners: (state) => {
      state.banners = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBanners.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBanners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.banners = action.payload;
      })
      .addCase(getBanners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetBanners } = bannerSlice.actions;

export default bannerSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// Cache duration in milliseconds (e.g., 1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

const initialState = {
  banners: [],
  status: "idle",
  error: null,
  lastUpdated: null,
};

export const getBanners = createAsyncThunk(
  "banner/getBanners",
  async (_, thunkAPI) => {
    try {
      // Check if we have cached data and it's still fresh
      const cachedData = typeof window !== "undefined" && localStorage.getItem("banners");
      const now = Date.now();
      
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        // Return cached data if it's still fresh
        if (now - timestamp < CACHE_DURATION) {
          return data;
        }
      }

      // Fetch fresh data if cache is expired or doesn't exist
      const url = `${Baseurl}/api/v1/mainhomeslider/slidersImage`;
      const response = await axios.get(url);
      const freshData = response.data.mainHomeSliders;
      
      // Update cache with fresh data
      if (typeof window !== "undefined") {
        localStorage.setItem("banners", JSON.stringify({
          data: freshData,
          timestamp: now
        }));
      }
      
      return freshData;
    } catch (error) {
      // Fallback to cached data if available
      const cachedData = typeof window !== "undefined" && localStorage.getItem("banners");
      if (cachedData) {
        const { data } = JSON.parse(cachedData);
        return data;
      }
      
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
      state.lastUpdated = null;
    },
    forceRefreshBanners: (state) => {
      state.lastUpdated = null; // This will trigger a refresh
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBanners.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBanners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.banners = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(getBanners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetBanners, forceRefreshBanners } = bannerSlice.actions;
export default bannerSlice.reducer;
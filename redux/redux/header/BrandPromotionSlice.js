import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// Cache duration in milliseconds (e.g., 1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

const initialState = {
  promotionBanners: [],  // Changed from Brand to match the actual data
  status: "idle",
  error: null,
  lastUpdated: null,
};

export const getPromotionBanners = createAsyncThunk(
  "promotionBanner/getPromotionBanners",
  async (_, thunkAPI) => {
    try {
      const cachedData = typeof window !== "undefined" && localStorage.getItem("promotionBanners");
      const now = Date.now();
      
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        // Return cached data if it's still fresh
        if (now - timestamp < CACHE_DURATION) {
          return data;
        }
      }

      // Fetch fresh data if cache is expired or doesn't exist
      const url = `${Baseurl}/api/v1/brandPromotion/getBrandPromotion`;
      const response = await axios.get(url);      
      const freshData = response.data.ctegoryTags;
      
      // Update cache with fresh data
      if (typeof window !== "undefined") {
        localStorage.setItem("promotionBanners", JSON.stringify({  // Fixed key to match getItem
          data: freshData,
          timestamp: now
        }));
      }
      
      return freshData;
    } catch (error) {
      // Fallback to cached data if available
      const cachedData = typeof window !== "undefined" && localStorage.getItem("promotionBanners");
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

export const promotionBannerSlice = createSlice({  // Fixed slice name to match the context
  name: "promotionBanner",
  initialState,
  reducers: {
    resetBanners: (state) => {
      state.promotionBanners = [];
      state.lastUpdated = null;
    },
    forceRefreshBanners: (state) => {
      state.lastUpdated = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPromotionBanners.pending, (state) => {  // Fixed to match the thunk name
        state.status = "loading";
      })
      .addCase(getPromotionBanners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.promotionBanners = action.payload;  // Fixed to match initialState
        state.lastUpdated = Date.now();
      })
      .addCase(getPromotionBanners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetBanners, forceRefreshBanners } = promotionBannerSlice.actions;
export default promotionBannerSlice.reducer;
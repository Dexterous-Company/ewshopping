import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// Cache duration in milliseconds (e.g., 1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

const initialState = {
  cardPromotions: [],
  status: "idle",
  error: null,
  lastUpdated: null,
};

export const fetchCardPromotions = createAsyncThunk(
  "cPromotion/fetchCardPromotions",
  async (_, thunkAPI) => {
    try {
      // Check if we have cached data and it's still fresh
      const cachedData = typeof window !== "undefined" && localStorage.getItem("cardPromotions");
      const now = Date.now();
      
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (now - timestamp < CACHE_DURATION) {
          return data;
        }
      }

      // Fetch fresh data if cache is expired or doesn't exist
      const url = `${Baseurl}/api/v1/cardPromotion/cardPromotion`;
      const response = await axios.get(url);
      const freshData = response.data.cardPromotions;
      
      // Update cache with fresh data
      if (typeof window !== "undefined") {
        localStorage.setItem("cardPromotions", JSON.stringify({
          data: freshData,
          timestamp: now
        }));
      }
      
      return freshData;
    } catch (error) {
      // Fallback to cached data if available
      const cachedData = typeof window !== "undefined" && localStorage.getItem("cardPromotions");
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

export const cardPromotionSlice = createSlice({
  name: "cardPromotion",
  initialState,
  reducers: {
    resetCardPromotions: (state) => {
      state.cardPromotions = [];
      state.lastUpdated = null;
    },
    forceRefreshCardPromotions: (state) => {
      state.lastUpdated = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardPromotions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCardPromotions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cardPromotions = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchCardPromotions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetCardPromotions, forceRefreshCardPromotions } = cardPromotionSlice.actions;
export default cardPromotionSlice.reducer;
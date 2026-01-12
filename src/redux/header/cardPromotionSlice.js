import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL1;
const STORAGE_KEY = "card_promotions_cache";

// 🔹 Load from localStorage (FIRST RENDER)
const loadFromStorage = () => {
  if (typeof window === "undefined") return [];
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
};

const initialState = {
  cardPromotions: loadFromStorage(), // 👈 instant UI
  status: "idle",
  error: null,
};

export const fetchCardPromotions = createAsyncThunk(
  "cPromotion/fetchCardPromotions",
  async (_, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/cardPromotion/cardPromotion`;
      const response = await axios.get(url);
      return response.data.cardPromotions;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const cardPromotionSlice = createSlice({
  name: "cPromotion",
  initialState,
  reducers: {
    resetCardPromotions: (state) => {
      state.cardPromotions = [];
      state.status = "idle";
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardPromotions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCardPromotions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cardPromotions = action.payload;

        // 🔥 SAVE AFTER 10 SECONDS (ONLY ON PAGE REFRESH)
        setTimeout(() => {
          try {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(action.payload)
            );
          } catch (e) {
            console.warn("Card promotions LS save failed", e);
          }
        }, 10000);
      })
      .addCase(fetchCardPromotions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetCardPromotions } = cardPromotionSlice.actions;
export default cardPromotionSlice.reducer;

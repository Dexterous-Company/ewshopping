import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL1;
const STORAGE_KEY = "home_banners_cache";

// 🔹 load banners from localStorage (first render)
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
  banners: loadFromStorage(), // 👈 instant UI
  status: "idle",
  error: null,
};

export const getBanners = createAsyncThunk(
  "banner/getBanners",
  async (_, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/mainhomeslider/slidersImage`;
      const response = await axios.get(url);
      return response.data.mainHomeSliders;
    } catch (error) {
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
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
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

        // 🔥 SAVE AFTER 10s (ONLY ON PAGE REFRESH)
        setTimeout(() => {
          try {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(action.payload)
            );
          } catch (e) {
            console.warn("Banner cache save failed", e);
          }
        }, 10000);
      })
      .addCase(getBanners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetBanners } = bannerSlice.actions;
export default bannerSlice.reducer;

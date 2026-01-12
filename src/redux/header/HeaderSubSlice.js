import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL1;
const STORAGE_KEY = "subCategories_cache";

// 🔹 read once from localStorage
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
  subCategories: loadFromStorage(), // 👈 instant UI
  status: "idle",
  error: null,
};

export const getSubCategory = createAsyncThunk(
  "subCat/getSubCategory",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        `${Baseurl}/api/v1/subcategory/top_category`
      );
      return res.data.category;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const subCatSlice = createSlice({
  name: "subCat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSubCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSubCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subCategories = action.payload;

        // 🔥 SAVE AFTER 10s (ONLY ON PAGE REFRESH)
        setTimeout(() => {
          try {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(action.payload)
            );
          } catch (e) {
            console.warn("localStorage save failed", e);
          }
        }, 10000);
      })
      .addCase(getSubCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default subCatSlice.reducer;

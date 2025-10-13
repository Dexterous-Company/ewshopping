import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;


const getStoredSubCategories = () => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("subCategories");
    if (!data || data === "undefined") return []; // <-- extra check
    const parsed = JSON.parse(data);
    return Array.isArray(parsed)
      ? parsed.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
      : [];
  } catch (e) {
    console.error("Failed to parse subCategories from localStorage", e);
    return [];
  }
};

const initialState = {
  subCategories: getStoredSubCategories(),
  status: "idle",
  error: null,
};

export const getSubCategory = createAsyncThunk(
  "subCat/getSubCategory",
  async (_, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/subcategory/top_category`;
      const resp = await axios(url);
      return resp.data.category;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const subCatSlice = createSlice({
  name: "subCat",
  initialState,
  reducers: {
    // Removed pagination-related reducers
    resetSubCategories: (state) => {
      state.subCategories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSubCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subCategories = action.payload;
        localStorage.setItem(
          "subCategories",
          JSON.stringify(action.payload)
        );
      })
      .addCase(getSubCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetSubCategories } = subCatSlice.actions;
export default subCatSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  subCategories:
    typeof window !== "undefined" && localStorage.getItem("subCategories")
      ? JSON.parse(localStorage.getItem("subCategories")).sort((a, b) =>
          a.createdAt > b.createdAt ? 1 : -1
        )
      : [],
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

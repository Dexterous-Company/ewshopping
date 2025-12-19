import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  fillteredSubCategory: [],
  status: "idle",
  error: null,
};

// Safely parse localStorage
if (typeof window !== "undefined") {
  const storedSubCategory = localStorage.getItem("fillteredSubCategory");
  if (storedSubCategory) {
    try {
      initialState.fillteredSubCategory = JSON.parse(storedSubCategory);
    } catch (err) {
      console.warn("Error parsing fillteredSubCategory from localStorage", err);
      localStorage.removeItem("fillteredSubCategory");
    }
  }
}
export const getFillteredSubCategory = createAsyncThunk(
  "subcategory/getFillteredSubCategory",
  async (_, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/subcategory/getFilteredSubcategory`;
      const resp = await axios.get(url);
      return resp.data.subcategories;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const subcategorySlice = createSlice({
  name: "subcategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFillteredSubCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFillteredSubCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fillteredSubCategory = action.payload;

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "fillteredSubCategory",
            JSON.stringify(action.payload)
          );
        }
      })
      .addCase(getFillteredSubCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default subcategorySlice.reducer;

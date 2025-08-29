import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  fillteredCategory: [],
  status: "idle",
  error: null,
};

// Safely parse localStorage
if (typeof window !== "undefined") {
  const storedCategory = localStorage.getItem("fillteredCategory");
  if (storedCategory) {
    try {
      initialState.fillteredCategory = JSON.parse(storedCategory);
    } catch (err) {
      console.warn("Error parsing fillteredCategory from localStorage", err);
      localStorage.removeItem("fillteredCategory");
    }
  }
}

export const getFillteredCategory = createAsyncThunk(
  "category/getFillteredCategory",
  async (_, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/category/getFilteredCategory`;
      const resp = await axios.get(url);
      return resp.data.categories;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFillteredCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFillteredCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fillteredCategory = action.payload;

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "fillteredCategory",
            JSON.stringify(action.payload)
          );
        }
      })
      .addCase(getFillteredCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;

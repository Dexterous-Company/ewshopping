import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;


// code by sshaik
const initialState = {
  fillteredCategory: [],
  allCategoryTags: {}, 
  tagsStatus: {}, 
  tagsError: {}, 
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

// code by shaik
// categorySlice.js - Update your thunk
export const getAllCategoryTagsAllCategories = createAsyncThunk(
  "category/getAllCategoryTagsAllCategories",
  async (categoryurl, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/category/category-tags/${categoryurl}`;
      const resp = await axios.get(url);
      console.log("resp",resp);
      

     
      return {
        categoryUrl: categoryurl,
        data: resp.data.data, // This should contain the category data with tags
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      console.error("❌ API Error for", categoryurl, ":", message);
      return thunkAPI.rejectWithValue({ categoryUrl: categoryurl, message });
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
      })
      // code by shaik
      .addCase(getAllCategoryTagsAllCategories.pending, (state, action) => {
        const categoryUrl = action.meta.arg;
        state.tagsStatus[categoryUrl] = "loading";
        state.tagsError[categoryUrl] = null;
      })
      .addCase(getAllCategoryTagsAllCategories.fulfilled, (state, action) => {
        const { categoryUrl, data } = action.payload;
        state.tagsStatus[categoryUrl] = "succeeded";
        state.allCategoryTags[categoryUrl] = data; // Store by categoryUrl
        state.tagsError[categoryUrl] = null;
      })
      .addCase(getAllCategoryTagsAllCategories.rejected, (state, action) => {
        const categoryUrl = action.meta.arg;
        state.tagsStatus[categoryUrl] = "failed";
        state.tagsError[categoryUrl] =
          action.payload?.message || action.error.message;
      });
  },
});

export default categorySlice.reducer;

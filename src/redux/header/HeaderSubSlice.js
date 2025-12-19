import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// ----------------------------------------------------------
// LOAD CHUNKED DATA FROM LOCALSTORAGE (FAST)
// ----------------------------------------------------------
const loadFullSubCategories = () => {
  if (typeof window === "undefined") return [];

  if (!localStorage.getItem("subCategories_complete")) return [];

  let index = 0;
  let fullData = "";

  while (true) {
    const chunk = localStorage.getItem(`subCategories_chunk_${index}`);
    if (!chunk) break;
    fullData += chunk;
    index += 50000; // must match chunk size
  }

  try {
    return JSON.parse(fullData);
  } catch (e) {
    console.error("Failed to parse chunked subCategories", e);
    return [];
  }
};

// ----------------------------------------------------------
// INITIAL STATE
// ----------------------------------------------------------
const initialState = {
  subCategories: loadFullSubCategories(),
  categoryTags: [],
  status: "idle",
  categoryTagsStatus: "idle",
  error: null,
  categoryTagsError: null,
};

// ----------------------------------------------------------
// API: Get Top Subcategories
// ----------------------------------------------------------
export const getSubCategory = createAsyncThunk(
  "subCat/getSubCategory",
  async (_, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/subcategory/top_category`;
      const resp = await axios.get(url);
      return resp.data.category;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ----------------------------------------------------------
// API: Get Category Tags
// ----------------------------------------------------------
export const getCategoryTags = createAsyncThunk(
  "subCat/getCategoryTags",
  async (slugUrl, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/categorytag/getcategorytages?slugUrl=${slugUrl}`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ----------------------------------------------------------
// SLICE
// ----------------------------------------------------------
export const subCatSlice = createSlice({
  name: "subCat",
  initialState,
  reducers: {
    resetSubCategories: (state) => {
      state.subCategories = [];
      localStorage.removeItem("subCategories_complete");

      // remove chunk keys
      let index = 0;
      while (true) {
        const key = `subCategories_chunk_${index}`;
        if (!localStorage.getItem(key)) break;
        localStorage.removeItem(key);
        index += 50000;
      }
    },

    resetCategoryTags: (state) => {
      state.categoryTags = [];
      localStorage.removeItem("categoryTags");
    },
  },

  extraReducers: (builder) => {
    builder
      // ------------------------------------------------------
      // SUB CATEGORIES
      // ------------------------------------------------------
      .addCase(getSubCategory.pending, (state) => {
        state.status = "loading";
      })

      .addCase(getSubCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subCategories = action.payload;

        // -------------------------------
        // SAVE FULL DATA IN CHUNKS (FAST)
        // -------------------------------
        const data = JSON.stringify(action.payload);
        const chunkSize = 50000; // 50 KB chunks
        let index = 0;

        // remove old chunks
        let i = 0;
        while (true) {
          const key = `subCategories_chunk_${i}`;
          if (!localStorage.getItem(key)) break;
          localStorage.removeItem(key);
          i += chunkSize;
        }

        function saveChunk() {
          const chunk = data.slice(index, index + chunkSize);
          const key = `subCategories_chunk_${index}`;

          localStorage.setItem(key, chunk);
          index += chunkSize;

          if (index < data.length) {
            setTimeout(saveChunk, 0); // non-blocking
          } else {
            localStorage.setItem("subCategories_complete", "true");
          }
        }

        setTimeout(saveChunk, 0);
      })

      .addCase(getSubCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ------------------------------------------------------
      // CATEGORY TAGS
      // ------------------------------------------------------
      .addCase(getCategoryTags.pending, (state) => {
        state.categoryTagsStatus = "loading";
      })

      .addCase(getCategoryTags.fulfilled, (state, action) => {
        state.categoryTagsStatus = "succeeded";
        state.categoryTags = action.payload.categoryTags;

        // Save normally (small data)
        setTimeout(() => {
          localStorage.setItem(
            "categoryTags",
            JSON.stringify(action.payload.categoryTags)
          );
        }, 0);
      })

      .addCase(getCategoryTags.rejected, (state, action) => {
        state.categoryTagsStatus = "failed";
        state.categoryTagsError = action.payload;
      });
  },
});

export const { resetSubCategories, resetCategoryTags } = subCatSlice.actions;

export default subCatSlice.reducer;

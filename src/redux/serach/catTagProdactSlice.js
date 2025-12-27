import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

/* ===================================================
   CATEGORY TAG PRODUCTS
=================================================== */
export const CategoryTagProducts = createAsyncThunk(
  "categoryTag/CategoryTagProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/getCategoryTagProducts`,
        {
          ...params,
          sort: params.sort || "relevance",
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===================================================
   CATEGORY TAG FILTERS
=================================================== */
export const getCategoryTagFilters = createAsyncThunk(
  "categoryTag/getCategoryTagFilters",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/getCategoryTagFilters`,
        params
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===================================================
   LOAD MORE PRODUCTS
=================================================== */
export const loadMoreCategoryTagProducts = createAsyncThunk(
  "categoryTag/loadMoreCategoryTagProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/getCategoryTagProducts`,
        params
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===================================================
   INITIAL STATE
=================================================== */
const initialState = {
  success: false,
  total: 0,
  page: 1,
  limit: 30,
  totalPages: 1,
  count: 0,
  products: [],
  filters: [],
  loading: false,
  loadingMore: false,
  loadingFilters: false,
  filtersLoaded: false,
  error: null,
  sort: "relevance",
};

/* ===================================================
   SLICE
=================================================== */
const categoryTagSlice = createSlice({
  name: "categoryTag",
  initialState,
  reducers: {
    setSortOption: (state, action) => {
      state.sort = action.payload;
      state.page = 1;
    },
    clearCategoryTagState: () => initialState,
    resetFiltersLoaded: (state) => {
      state.filtersLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ---------- FETCH PRODUCTS ---------- */
      .addCase(CategoryTagProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CategoryTagProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.products = action.payload.products || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 30;
        state.totalPages = Math.ceil(state.total / state.limit);
        state.error = null;
      })
      .addCase(CategoryTagProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.products = [];
      })

      /* ---------- LOAD MORE ---------- */
      .addCase(loadMoreCategoryTagProducts.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreCategoryTagProducts.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.success = action.payload.success;
        state.page += 1;
        state.products = [
          ...state.products,
          ...(action.payload.products || []),
        ];
        state.total = action.payload.total || state.total;
      })
      .addCase(loadMoreCategoryTagProducts.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload?.message || action.error.message;
      })

      /* ---------- FETCH FILTERS ---------- */
      .addCase(getCategoryTagFilters.pending, (state) => {
        state.loadingFilters = true;
        state.error = null;
      })
      .addCase(getCategoryTagFilters.fulfilled, (state, action) => {
        state.loadingFilters = false;
        state.success = action.payload.success;

        const raw = action.payload.filters || {};
        const normalized = [];

        // ✅ BRAND
        if (Array.isArray(raw.brand) && raw.brand.length > 0) {
          normalized.push({
            name: "brand",
            values: raw.brand,
            tag: "static",
          });
        }

        // ✅ CATEGORY TAG (VISIBLE)
        if (Array.isArray(raw.CategoryTag) && raw.CategoryTag.length > 0) {
          normalized.push({
            name: "CategoryTag",
            values: raw.CategoryTag,
            tag: "static",
          });
        }

        // ✅ ATTRIBUTE FILTERS
        if (Array.isArray(raw.attributes)) {
          raw.attributes.forEach((attr) => {
            if (attr.values?.length > 0) {
              normalized.push(attr);
            }
          });
        }

        state.filters = normalized;
        state.filtersLoaded = true;
      })
      .addCase(getCategoryTagFilters.rejected, (state, action) => {
        state.loadingFilters = false;
        state.error = action.payload?.message || action.error.message;
        state.filtersLoaded = true;
      });
  },
});

/* ===================================================
   EXPORTS
=================================================== */
export const { setSortOption, clearCategoryTagState, resetFiltersLoaded } =
  categoryTagSlice.actions;

export const selectCategoryTagProducts = (state) => state.categoryTag.products;
export const selectCategoryTagFilters = (state) => state.categoryTag.filters;
export const selectCategoryTagLoading = (state) => state.categoryTag.loading;
export const selectCategoryTagLoadingMore = (state) =>
  state.categoryTag.loadingMore;
export const selectCategoryTagLoadingFilters = (state) =>
  state.categoryTag.loadingFilters;
export const selectCategoryTagPagination = (state) => ({
  page: state.categoryTag.page,
  limit: state.categoryTag.limit,
  total: state.categoryTag.total,
  totalPages: state.categoryTag.totalPages,
  hasNext: state.categoryTag.page < state.categoryTag.totalPages,
});
export const selectCategoryTagSort = (state) => state.categoryTag.sort;

export default categoryTagSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

/* ------------------------------------
   FETCH CATEGORY PRODUCTS
------------------------------------ */
export const CategoryProducts = createAsyncThunk(
  "category/CategoryProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/getCategoryProducts`,
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

/* ------------------------------------
   FETCH CATEGORY FILTERS
------------------------------------ */
export const getCategoryFilters = createAsyncThunk(
  "category/getCategoryFilters",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/getCategoryFilters`,
        params
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ------------------------------------
   LOAD MORE CATEGORY PRODUCTS
------------------------------------ */
export const loadMoreCategoryProducts = createAsyncThunk(
  "category/loadMoreCategoryProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/getCategoryProducts`,
        params
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ------------------------------------
   INITIAL STATE
------------------------------------ */
const initialState = {
  success: false,
  total: 0,
  page: 1,
  limit: 20,
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

/* ------------------------------------
   CATEGORY SLICE
------------------------------------ */
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setSortOption: (state, action) => {
      state.sort = action.payload;
      state.page = 1;
    },
    clearCategory: () => ({ ...initialState }),
    setPage: (state, action) => {
      state.page = action.payload;
    },
    resetFetching: (state) => {
      state.loading = false;
      state.loadingMore = false;
      state.loadingFilters = false;
    },
    resetFiltersLoaded: (state) => {
      state.filtersLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- INITIAL LOAD ---------- */
      .addCase(CategoryProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CategoryProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 20;
        state.totalPages = action.payload.totalPages || 1;
        state.count = action.payload.count || 0;
        state.products = action.payload.products || [];
        state.sort = action.meta.arg?.sort || "relevance";
        state.error = null;
      })
      .addCase(CategoryProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.products = [];
        state.success = false;
      })

      /* ---------- FILTERS ---------- */
      .addCase(getCategoryFilters.pending, (state) => {
        state.loadingFilters = true;
        state.error = null;
      })
      .addCase(getCategoryFilters.fulfilled, (state, action) => {
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

        // ✅ CATEGORY TAG
        if (Array.isArray(raw.CategoryTag) && raw.CategoryTag.length > 0) {
          normalized.push({
            name: "CategoryTag",
            values: raw.CategoryTag,
            tag: "static",
          });
        }

        // ✅ SUBCATEGORY
        if (Array.isArray(raw.SubCategory) && raw.SubCategory.length > 0) {
          normalized.push({
            name: "SubCategory",
            values: raw.SubCategory,
            tag: "static",
          });
        }

        // ✅ ATTRIBUTE FILTERS
        if (Array.isArray(raw.attributes)) {
          raw.attributes.forEach((attr) => {
            if (attr.values && attr.values.length > 0) {
              normalized.push(attr);
            }
          });
        }

        state.filters = normalized;
        state.filtersLoaded = true;
      })
      .addCase(getCategoryFilters.rejected, (state, action) => {
        state.loadingFilters = false;
        state.error = action.payload?.message || action.error.message;
        state.filtersLoaded = true;
      })

      /* ---------- LOAD MORE ---------- */
      .addCase(loadMoreCategoryProducts.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreCategoryProducts.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.success = action.payload.success;
        state.total = action.payload.total || state.total;

        state.page += 1;

        state.products = [
          ...state.products,
          ...(action.payload.products || []),
        ];

        state.error = null;
      })
      .addCase(loadMoreCategoryProducts.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

/* ------------------------------------
   EXPORTS
------------------------------------ */
export const {
  setSortOption,
  clearCategory,
  setPage,
  resetFetching,
  resetFiltersLoaded,
} = categorySlice.actions;

/* ------------------------------------
   SELECTORS
------------------------------------ */
export const selectCategoryProducts = (state) => state.category.products;
export const selectCategoryLoading = (state) => state.category.loading;
export const selectCategoryLoadingMore = (state) => state.category.loadingMore;
export const selectCategoryFilters = (state) => state.category.filters;
export const selectCategoryFiltersLoaded = (state) =>
  state.category.filtersLoaded;
export const selectCategoryPagination = (state) => ({
  page: state.category.page,
  limit: state.category.limit,
  total: state.category.total,
  totalPages: state.category.totalPages,
  count: state.category.count,
  hasNext: state.category.page < state.category.totalPages,
});

export default categorySlice.reducer;

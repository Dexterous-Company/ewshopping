import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// Async thunk for search
export const SubCatProdact = createAsyncThunk(
  "searchNew/SubCatProdact",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/getSubCatProducts`,
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

// Async thunk for fetching filters only
export const getSubCatFilters = createAsyncThunk(
  "searchNew/getSubCatFilters",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/getSubCatFilters`,
        params
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for loading more products
export const loadMoreSubCatProducts = createAsyncThunk(
  "searchNew/loadMoreSubCatProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/getSubCatProducts`,
        params
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  success: false,
  query: "",
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
  sort: "",
};

const subCatFiltersSlice = createSlice({
  name: "searchNew",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
      state.page = 1;
    },
    setSortOption: (state, action) => {
      state.sort = action.payload;
      state.page = 1;
    },
    clearSearch: (state) => {
      return { ...initialState };
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    resetFetching: (state) => {
      state.loading = false;
      state.loadingMore = false;
      state.loadingFilters = false;
    },
    // Add a new reducer to clear only filters flag
    resetFiltersLoaded: (state) => {
      state.filtersLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initial search
      .addCase(SubCatProdact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SubCatProdact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.query = action.payload.query || "";
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 20;
        state.totalPages = action.payload.totalPages || 1;
        state.count = action.payload.count || 0;
        state.products = action.payload.products || [];
        state.sort = action.meta.arg?.sort || "relevance";

        // Only update filters if they exist in the response AND filters haven't been loaded yet
        if (action.payload.filters && action.payload.filters.length > 0) {
          state.filters = action.payload.filters;
        } else if (!state.filtersLoaded) {
          state.filters = state.filters || [];
        }

        state.error = null;
      })
      .addCase(SubCatProdact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.products = [];
        state.success = false;
      })
      // Get filters only
      .addCase(getSubCatFilters.pending, (state) => {
        state.loadingFilters = true;
        state.error = null;
      })
      .addCase(getSubCatFilters.fulfilled, (state, action) => {
        state.loadingFilters = false;
        state.success = action.payload.success;

        const raw = action.payload.filters || {};
        const normalized = [];

        // ✅ BRAND FILTER
        if (Array.isArray(raw.brand) && raw.brand.length > 0) {
          normalized.push({
            name: "brand",
            values: raw.brand,
            tag: "static",
          });
        }

        // ✅ CATEGORY TAG FILTER (VISIBLE)
        if (Array.isArray(raw.CategoryTag) && raw.CategoryTag.length > 0) {
          normalized.push({
            name: "CategoryTag",
            values: raw.CategoryTag,
            tag: "static",
          });
        }

        // ❌ CategoryTagUrl intentionally NOT added

        // ✅ ATTRIBUTE FILTERS
        if (Array.isArray(raw.attributes)) {
          raw.attributes.forEach((attr) => {
            if (attr.values && attr.values.length > 0) {
              normalized.push(attr);
            }
          });
        }
        if (Array.isArray(raw.CategoryTag) && raw.CategoryTag.length > 0) {
          normalized.push({
            name: "ProductType", // 👈 UI key
            apiKey: "CategoryTag", // 👈 REAL backend key
            values: raw.CategoryTag,
            tag: "static",
          });
        }
        state.filters = normalized;
        state.filtersLoaded = true;
      })
      .addCase(getSubCatFilters.rejected, (state, action) => {
        state.loadingFilters = false;
        state.error = action.payload?.message || action.error.message;
        state.filtersLoaded = true;
      })
      // Loading more products - FIXED
      .addCase(loadMoreSubCatProducts.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreSubCatProducts.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.success = action.payload.success;
        state.query = action.payload.query || state.query;
        state.total = action.payload.total || state.total;

        // CRITICAL FIX: Increment page number
        state.page = state.page + 1;

        state.limit = action.payload.limit || state.limit;
        state.totalPages = action.payload.totalPages || state.totalPages;
        state.count = action.payload.count || state.count;
        state.products = [
          ...state.products,
          ...(action.payload.products || []),
        ];
        // Don't update filters on loadMore - keep existing filters
        state.error = null;

        console.log(
          `Loaded more: Now page ${state.page}, ${state.products.length} products`
        );
      })
      .addCase(loadMoreSubCatProducts.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const {
  setSearchQuery,
  setSortOption,
  clearSearch,
  setPage,
  resetFetching,
  resetFiltersLoaded,
} = subCatFiltersSlice.actions;

// Selectors
export const selectSearchProducts = (state) => state.searchNew.products;
export const selectSearchLoading = (state) => state.searchNew.loading;
export const selectSearchLoadingMore = (state) => state.searchNew.loadingMore;
export const selectSearchLoadingFilters = (state) =>
  state.searchNew.loadingFilters;
export const selectSearchError = (state) => state.searchNew.error;
export const selectSearchQuery = (state) => state.searchNew.query;
export const selectSearchFilters = (state) => state.searchNew.filters;
export const selectPagination = (state) => ({
  page: state.searchNew.page,
  limit: state.searchNew.limit,
  total: state.searchNew.total,
  totalPages: state.searchNew.totalPages,
  count: state.searchNew.count,
  hasNext: state.searchNew.page < state.searchNew.totalPages,
  hasPrevious: state.searchNew.page > 1,
});
export const selectSortOption = (state) => state.searchNew.sort;
export const selectSearchSuccess = (state) => state.searchNew.success;
export const selectFiltersLoaded = (state) => state.searchNew.filtersLoaded;

export default subCatFiltersSlice.reducer;

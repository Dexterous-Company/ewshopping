import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

export const searchNewProducts = createAsyncThunk(
  "searchNew/searchNewProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${Baseurl}/api/v1/search/products`, {
        ...params,
        sort: params.sort || "relevance",
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getFilters = createAsyncThunk(
  "searchNew/getFilters",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/filters`,
        params
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const loadMoreProducts = createAsyncThunk(
  "searchNew/loadMoreProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/products`,
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
  priceRange: null,
  loading: false, // Changed to false initially
  loadingMore: false,
  loadingFilters: false,
  filtersLoaded: false,
  hasFetchedOnce: false, // 🔥 NEW FLAG
  currentSearch: null, // Track current search query
  error: null,
  sort: "",
};

const newSearchSlice = createSlice({
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
    resetFiltersLoaded: (state) => {
      state.filtersLoaded = false;
    },
    clearPriceRange: (state) => {
      state.priceRange = null;
    },
    // NEW ACTION: Clear products when search changes
    clearProductsForNewSearch: (state) => {
      state.products = [];
      state.page = 1;
      state.total = 0;
      state.hasFetchedOnce = false; // 🔥 reset
      state.loading = true; // Show loading immediately
      state.filtersLoaded = false;
      state.currentSearch = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchNewProducts.pending, (state, action) => {
        const { q, page } = action.meta.arg;

        // 🔥 Always show loader for first page
        if (page === 1) {
          state.loading = true;
          state.loadingMore = false;
        }
      })
      .addCase(searchNewProducts.fulfilled, (state, action) => {
        const { page, q } = action.meta.arg;

        // Accept response only for active search
        state.currentSearch = q;
        state.hasFetchedOnce = true; // 🔥 VERY IMPORTANT

        state.success = action.payload.success;
        state.query = action.payload.query || "";
        state.total = action.payload.total || 0;
        state.page = page;
        state.limit = action.payload.limit || 20;
        state.totalPages = action.payload.totalPages || 1;
        state.count = action.payload.count || 0;
        state.sort = action.meta.arg?.sort || "relevance";

        // 🔥 FIRST PAGE → REPLACE
        if (page === 1) {
          state.products = action.payload.products || [];
        }

        state.loading = false;
        state.loadingMore = false;
        state.error = null;

        if (page === 1 && action.payload.filters) {
          state.filters = action.payload.filters;
        }
      })
      .addCase(searchNewProducts.rejected, (state, action) => {
        const { q } = action.meta.arg;
        state.hasFetchedOnce = true; // even on error

        if (state.currentSearch === null || state.currentSearch === q) {
          state.loading = false;
          state.error = action.payload?.message || action.error.message;
          state.products = [];
          state.success = false;
        }
      })

      .addCase(getFilters.pending, (state) => {
        state.loadingFilters = true;
        state.error = null;
      })
      .addCase(getFilters.fulfilled, (state, action) => {
        state.loadingFilters = false;
        state.success = action.payload.success;

        // Update price range from API (this changes dynamically)
        if (action.payload.priceRange) {
          state.priceRange = action.payload.priceRange;
        }

        // Store filters
        if (action.payload.filters && action.payload.filters.length > 0) {
          state.filters = action.payload.filters;
        } else {
          state.filters = [];
        }

        state.filtersLoaded = true;
        state.error = null;
      })
      .addCase(getFilters.rejected, (state, action) => {
        state.loadingFilters = false;
        state.error = action.payload?.message || action.error.message;
        state.filtersLoaded = true;
      })

      .addCase(loadMoreProducts.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreProducts.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.success = action.payload.success;

        const newProducts = action.payload.products || [];

        state.products = [...state.products, ...newProducts];
        state.total = action.payload.total || state.total;
        state.page = action.meta.arg.page; // 🔥 trust caller
        state.error = null;
      })
      .addCase(loadMoreProducts.rejected, (state, action) => {
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
  clearPriceRange,
  clearProductsForNewSearch, // Export the new action
} = newSearchSlice.actions;

// Selectors
export const selectSearchProducts = (state) => state.searchNew.products;
export const selectSearchLoading = (state) => state.searchNew.loading;
export const selectSearchLoadingMore = (state) => state.searchNew.loadingMore;
export const selectSearchLoadingFilters = (state) =>
  state.searchNew.loadingFilters;
export const selectSearchError = (state) => state.searchNew.error;
export const selectSearchQuery = (state) => state.searchNew.query;
export const selectSearchFilters = (state) => state.searchNew.filters;
export const selectPriceRange = (state) => state.searchNew.priceRange;
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
export const selectHasFetchedOnce = (state) => state.searchNew.hasFetchedOnce;
export const selectCurrentSearch = (state) => state.searchNew.currentSearch;

export default newSearchSlice.reducer;

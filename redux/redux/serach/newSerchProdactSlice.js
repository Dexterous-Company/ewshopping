import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// Async thunk for search
export const searchNewProducts = createAsyncThunk(
  "search/searchNewProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${Baseurl}/api/v1/search/search`, params);      
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for loading more products
export const loadMoreProducts = createAsyncThunk(
  "search/loadMoreProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${Baseurl}/api/v1/search/search`, params);
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
  filtersCount: 0,
  filters: [],
  loading: false,
  loadingMore: false,
  error: null,
  sort: "",
};

const newSearchSlice = createSlice({
  name: "search",
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
      return initialState;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initial search
      .addCase(searchNewProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchNewProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.query = action.payload.query;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.count = action.payload.count;
        state.products = action.payload.products || [];
        state.filtersCount = action.payload.filtersCount;
        state.filters = action.payload.filters || [];
        state.error = null;
      })
      .addCase(searchNewProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.products = [];
        state.success = false;
      })
      // Loading more products
      .addCase(loadMoreProducts.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreProducts.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.success = action.payload.success;
        state.query = action.payload.query;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.count = action.payload.count;
        state.products = [...state.products, ...(action.payload.products || [])];
        state.filtersCount = action.payload.filtersCount;
        state.filters = action.payload.filters || [];
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
} = newSearchSlice.actions;

// Selectors
export const selectSearchProducts = (state) => state.search.products;
export const selectSearchLoading = (state) => state.search.loading;
export const selectSearchLoadingMore = (state) => state.search.loadingMore;
export const selectSearchError = (state) => state.search.error;
export const selectSearchQuery = (state) => state.search.query;
export const selectSearchFilters = (state) => state.search.filters;
export const selectPagination = (state) => ({
  page: state.search.page,
  limit: state.search.limit,
  total: state.search.total,
  totalPages: state.search.totalPages,
  count: state.search.count,
  hasNext: state.search.page < state.search.totalPages,
  hasPrevious: state.search.page > 1,
});
export const selectSortOption = (state) => state.search.sort;
export const selectSearchSuccess = (state) => state.search.success;
export const selectFiltersCount = (state) => state.search.filtersCount;

export default newSearchSlice.reducer;
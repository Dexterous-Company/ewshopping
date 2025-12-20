import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// Async thunk for search
export const searchNewProducts = createAsyncThunk(
  "brandNew/searchNewProducts",
  async (params, { rejectWithValue }) => {
    try {
      
      const response = await axios.post(`${Baseurl}/api/v1/product/getDataUsingBrandAndSubCat`, params);
      
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for loading more products
export const loadMoreProducts = createAsyncThunk(
  "brandNew/loadMoreProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${Baseurl}/api/v1/product/getDataUsingBrandAndSubCat`, params);
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

const newBrandSlice = createSlice({
  name: "brandNew",
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
    resetFetching: (state) => {
      state.loading = false;
      state.loadingMore = false;
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
  resetFetching,
} = newBrandSlice.actions;

// Selectors
export const selectSearchProducts = (state) => state.brandNew.products;
export const selectSearchLoading = (state) => state.brandNew.loading;
export const selectSearchLoadingMore = (state) => state.brandNew.loadingMore;
export const selectSearchError = (state) => state.brandNew.error;
export const selectSearchQuery = (state) => state.brandNew.query;
export const selectSearchFilters = (state) => state.brandNew.filters;
export const selectPagination = (state) => ({
  page: state.brandNew.page,
  limit: state.brandNew.limit,
  total: state.brandNew.total,
  totalPages: state.brandNew.totalPages,
  count: state.brandNew.count,
  hasNext: state.brandNew.page < state.brandNew.totalPages,
  hasPrevious: state.brandNew.page > 1,
});
export const selectSortOption = (state) => state.brandNew.sort;
export const selectSearchSuccess = (state) => state.brandNew.success;
export const selectFiltersCount = (state) => state.brandNew.filtersCount;

export default newBrandSlice.reducer;
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
      const response = await axios.post(`${Baseurl}/api/v1/search/filters`, params);
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
  loading: false,
  loadingMore: false,
  loadingFilters: false,
  filtersLoaded: false,
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
    // Add a new reducer to clear only filters flag
    resetFiltersLoaded: (state) => {
      state.filtersLoaded = false;
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
        state.query = action.payload.query || "";
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 20;
        state.totalPages = action.payload.totalPages || 1;
        state.count = action.payload.count || 0;
        state.products = action.payload.products || [];
        state.sort = action.meta.arg?.sort || "relevance";
        
        if (action.payload.filters && action.payload.filters.length > 0) {
          state.filters = action.payload.filters;
        } else if (!state.filtersLoaded) {
          state.filters = state.filters || [];
        }
        
        state.error = null;
      })
      .addCase(searchNewProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.products = [];
        state.success = false;
      })
      // Get filters only
      .addCase(getFilters.pending, (state) => {
        state.loadingFilters = true;
        state.error = null;
      })
      .addCase(getFilters.fulfilled, (state, action) => {
        state.loadingFilters = false;
        // Always update filters from getFilters endpoint
        if (action.payload.filters && action.payload.filters.length > 0) {
          state.filters = action.payload.filters;
          state.filtersLoaded = true;
        } else {
          state.filters = [];
          state.filtersLoaded = true;
        }
        state.success = action.payload.success;
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
        state.query = action.payload.query || state.query;
        state.total = action.payload.total || state.total;
        
        state.page = state.page + 1;
        
        state.limit = action.payload.limit || state.limit;
        state.totalPages = action.payload.totalPages || state.totalPages;
        state.count = action.payload.count || state.count;
        state.products = [
          ...state.products,
          ...(action.payload.products || []),
        ];
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
} = newSearchSlice.actions;

// Selectors
export const selectSearchProducts = (state) => state.searchNew.products;
export const selectSearchLoading = (state) => state.searchNew.loading;
export const selectSearchLoadingMore = (state) => state.searchNew.loadingMore;
export const selectSearchLoadingFilters = (state) => state.searchNew.loadingFilters;
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

export default newSearchSlice.reducer;
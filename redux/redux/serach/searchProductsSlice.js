import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// Async thunk for search
export const searchProducts = createAsyncThunk(
  "search/searchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${Baseurl}/api/v1/searchtest`, params);
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
      const response = await axios.post(`${Baseurl}/api/v1/searchtest`, params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  query: "",
  results: [],
  loading: false,
  loadingMore: false,
  error: null,
  filters: {
    category: "",
    brand: [],
    color: "",
    minPrice: "",
    maxPrice: "",
    availability: "",
    rating: "",
  },
  pagination: {
    currentPage: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
  sort: "",
  availableFilters: {
    categories: [],
    superCategories: [],
    subCategories: [],
    categoryTags: [],
    brands: [],
    productTypes: [],
    priceRange: { min: null, max: null },
  },
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
      state.pagination.currentPage = 1;
    },
    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload;
      state.pagination.currentPage = 1;
    },
    setBrandFilter: (state, action) => {
      state.filters.brand = action.payload;
      state.pagination.currentPage = 1;
    },
    setColorFilter: (state, action) => {
      state.filters.color = action.payload;
      state.pagination.currentPage = 1;
    },
    setPriceRange: (state, action) => {
      state.filters.minPrice = action.payload.minPrice;
      state.filters.maxPrice = action.payload.maxPrice;
      state.pagination.currentPage = 1;
    },
    setAvailabilityFilter: (state, action) => {
      state.filters.availability = action.payload;
      state.pagination.currentPage = 1;
    },
    setRatingFilter: (state, action) => {
      state.filters.rating = action.payload;
      state.pagination.currentPage = 1;
    },
    setSortOption: (state, action) => {
      state.sort = action.payload;
      state.pagination.currentPage = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.sort = initialState.sort;
      state.pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initial search
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.products || [];
        state.pagination = {
          ...action.payload.pagination,
          hasNext:
            action.payload.pagination?.currentPage <
            action.payload.pagination?.totalPages,
        };
        state.availableFilters =
          action.payload.filters?.available || initialState.availableFilters;
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.results = [];
      })
      // Loading more products
      .addCase(loadMoreProducts.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreProducts.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.results = [...state.results, ...(action.payload.products || [])];
        state.pagination = {
          ...action.payload.pagination,
          hasNext:
            action.payload.pagination?.currentPage <
            action.payload.pagination?.totalPages,
        };
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
  setCategoryFilter,
  setBrandFilter,
  setColorFilter,
  setPriceRange,
  setAvailabilityFilter,
  setRatingFilter,
  setSortOption,
  resetFilters,
} = searchSlice.actions;

// Selectors
export const selectsearch = (state) => state.search.results;
export const selectSearchLoading = (state) => state.search.loading;
export const selectSearchLoadingMore = (state) => state.search.loadingMore;
export const selectSearchError = (state) => state.search.error;
export const selectSearchQuery = (state) => state.search.query;
export const selectSearchFilters = (state) => state.search.filters;
export const selectPagination = (state) => state.search.pagination;
export const selectSortOption = (state) => state.search.sort;

export default searchSlice.reducer;

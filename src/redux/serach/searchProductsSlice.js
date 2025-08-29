import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// Async thunk for search
export const searchProducts = createAsyncThunk(
  "search/searchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${Baseurl}/api/v1/search`, { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  query: "",
  results: [],
  loading: false,
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
    page: 1,
    limit: 30,
    totalResults: 0,
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
    priceRange: { min: null, max: null }
  }
};


const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
      state.pagination.page = 1; // Reset to first page on new query
    },
    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload;
      state.pagination.page = 1;
    },
    setBrandFilter: (state, action) => {
      state.filters.brand = action.payload;
      state.pagination.page = 1;
    },
    setColorFilter: (state, action) => {
      state.filters.color = action.payload;
      state.pagination.page = 1;
    },
    setPriceRange: (state, action) => {
      state.filters.minPrice = action.payload.minPrice;
      state.filters.maxPrice = action.payload.maxPrice;
      state.pagination.page = 1;
    },
    setAvailabilityFilter: (state, action) => {
      state.filters.availability = action.payload;
      state.pagination.page = 1;
    },
    setRatingFilter: (state, action) => {
      state.filters.rating = action.payload;
      state.pagination.page = 1;
    },
    setSortOption: (state, action) => {
      state.sort = action.payload;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.sort = initialState.sort;
      state.pagination.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.products;
        state.pagination = {
          ...action.payload.pagination,
          totalResults: action.payload.pagination.total,
        };
        state.availableFilters = action.payload.filters.available;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
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
  setPage,
  setLimit,
  resetFilters,
} = searchSlice.actions;

// Selectors
export const selectSearchResults = (state) => state.search.results;
export const selectSearchLoading = (state) => state.search.loading;
export const selectSearchError = (state) => state.search.error;
export const selectSearchQuery = (state) => state.search.query;
export const selectSearchFilters = (state) => state.search.filters;
export const selectPagination = (state) => state.search.pagination;
export const selectSortOption = (state) => state.search.sort;

export default searchSlice.reducer;

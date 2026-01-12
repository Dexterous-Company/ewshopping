import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

export const SubCatProdact = createAsyncThunk(
  "subCatProdact/SubCatProdact",
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

export const getSubCatFilters = createAsyncThunk(
  "subCatProdact/getSubCatFilters",
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

export const loadMoreSubCatProducts = createAsyncThunk(
  "subCatProdact/loadMoreSubCatProducts",
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
  priceRange: null,
  loading: false, // Changed to false initially
  loadingMore: false, // Changed to false initially
  loadingFilters: false,
  filtersLoaded: false,
  hasFetchedOnce: false, // 🔥 NEW FLAG

  error: null,
  sort: "",
  currentSubcat: null, // Track current subcategory
};

const subCatProdactSlice = createSlice({
  name: "subCatProdact",
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
    // NEW ACTION: Clear products when subcategory changes
    clearProductsForNewSubcat: (state) => {
      state.products = [];
      state.page = 1;
      state.total = 0;
      state.hasFetchedOnce = false; // 🔥 reset

      state.loading = true; // Show loading immediately
      state.filtersLoaded = false;
      state.currentSubcat = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SubCatProdact.pending, (state, action) => {
        const { subcat, page } = action.meta.arg;

        // 🔥 Always show loader for first page
        if (page === 1) {
          state.loading = true;
          state.loadingMore = false;
        }
      })

      .addCase(SubCatProdact.fulfilled, (state, action) => {
        const { page, subcat } = action.meta.arg;

        // Accept response only for active subcat
        state.currentSubcat = subcat;
        state.hasFetchedOnce = true; // 🔥 VERY IMPORTANT

        state.success = action.payload.success;
        state.total = action.payload.total || 0;
        state.page = page;
        state.limit = action.payload.limit || 20;
        state.totalPages = action.payload.totalPages || 1;
        state.count = action.payload.count || 0;

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
      .addCase(SubCatProdact.rejected, (state, action) => {
        const { subcat } = action.meta.arg;
        state.hasFetchedOnce = true; // even on error

        if (state.currentSubcat === null || state.currentSubcat === subcat) {
          state.loading = false;
          state.error = action.payload?.message || action.error.message;
          state.products = [];
          state.success = false;
        }
      })

      .addCase(getSubCatFilters.pending, (state) => {
        state.loadingFilters = true;
        state.error = null;
      })
      .addCase(getSubCatFilters.fulfilled, (state, action) => {
        state.loadingFilters = false;
        state.success = action.payload.success;

        // Only update priceRange if we don't have products yet
        // This prevents overwriting dynamic price range from products API
        if (!state.priceRange && action.payload.priceRange) {
          state.priceRange = action.payload.priceRange;
        }

        // Static filters
        const raw = action.payload.filters || {};
        const normalized = [];

        if (Array.isArray(raw.brand) && raw.brand.length > 0) {
          normalized.push({
            name: "brand",
            values: raw.brand,
            tag: "static",
          });
        }

        if (Array.isArray(raw.CategoryTag) && raw.CategoryTag.length > 0) {
          normalized.push({
            name: "CategoryTag",
            values: raw.CategoryTag,
            tag: "static",
          });
        }

        if (Array.isArray(raw.attributes)) {
          raw.attributes.forEach((attr) => {
            if (attr.values && attr.values.length > 0) {
              normalized.push(attr);
            }
          });
        }

        if (Array.isArray(raw.CategoryTag) && raw.CategoryTag.length > 0) {
          normalized.push({
            name: "ProductType",
            apiKey: "CategoryTag",
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

      .addCase(loadMoreSubCatProducts.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreSubCatProducts.fulfilled, (state, action) => {
        state.loadingMore = false;

        const newProducts = action.payload.products || [];

        state.products = [...state.products, ...newProducts];
        state.total = action.payload.total || state.total;
        state.page = action.meta.arg.page; // 🔥 trust caller
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
  clearPriceRange,
  clearProductsForNewSubcat, // Export the new action
} = subCatProdactSlice.actions;

// Selectors
export const selectSubCatProducts = (state) => state.subCatProdact.products;
export const selectSubCatLoading = (state) => state.subCatProdact.loading;
export const selectSubCatLoadingMore = (state) =>
  state.subCatProdact.loadingMore;
export const selectSubCatLoadingFilters = (state) =>
  state.subCatProdact.loadingFilters;
export const selectSubCatError = (state) => state.subCatProdact.error;
export const selectSubCatQuery = (state) => state.subCatProdact.query;
export const selectSubCatFilters = (state) => state.subCatProdact.filters;
export const selectSubCatPriceRange = (state) => state.subCatProdact.priceRange;
export const selectSubCatPagination = (state) => ({
  page: state.subCatProdact.page,
  limit: state.subCatProdact.limit,
  total: state.subCatProdact.total,
  totalPages: state.subCatProdact.totalPages,
  count: state.subCatProdact.count,
  hasNext: state.subCatProdact.page < state.subCatProdact.totalPages,
  hasPrevious: state.subCatProdact.page > 1,
});
export const selectSubCatSort = (state) => state.subCatProdact.sort;
export const selectSubCatSuccess = (state) => state.subCatProdact.success;
export const selectSubCatFiltersLoaded = (state) =>
  state.subCatProdact.filtersLoaded;
export const selectCurrentSubcat = (state) => state.subCatProdact.currentSubcat;

export default subCatProdactSlice.reducer;

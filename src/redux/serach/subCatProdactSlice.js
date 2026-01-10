import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

export const SubCatProdact = createAsyncThunk(
  "subCatProdact/SubCatProdact", // ✅ Changed name to match slice
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
  "subCatProdact/getSubCatFilters", // ✅ Changed name to match slice
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
  "subCatProdact/loadMoreSubCatProducts", // ✅ Changed name to match slice
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
  priceRange: null, // ✅ ADDED: Dynamic price range from API
  loading: true,
  loadingMore: true,
  loadingFilters: false,
  filtersLoaded: false,
  error: null,
  sort: "",
};

const subCatProdactSlice = createSlice({ // ✅ Changed slice name
  name: "subCatProdact", // ✅ Changed name
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
    clearPriceRange: (state) => { // ✅ ADDED
      state.priceRange = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SubCatProdact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SubCatProdact.fulfilled, (state, action) => {
        
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
        state.loading = false;
        
        state.error = null;
      })
      .addCase(SubCatProdact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.products = [];
        state.success = false;
      })
      
      .addCase(getSubCatFilters.pending, (state) => {
        state.loadingFilters = true;
        state.error = null;
      })
      .addCase(getSubCatFilters.fulfilled, (state, action) => {
        state.loadingFilters = false;
        state.success = action.payload.success;

        // ✅ DYNAMIC PRICE RANGE FROM API
        if (action.payload.priceRange) {
          state.priceRange = action.payload.priceRange;
        } else {
          // Fallback: calculate from current products
          if (state.products.length > 0) {
            const prices = state.products
              .map(p => {
                if (p.priceRange) return p.priceRange;
                if (p.salePrice) return p.salePrice;
                if (p.price) return p.price;
                return 0;
              })
              .filter(p => p > 0);
            
            if (prices.length > 0) {
              state.priceRange = {
                min: Math.min(...prices),
                max: Math.max(...prices)
              };
            }
          }
        }

        // ✅ STATIC FILTERS (ONLY LOADED ONCE)
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
  clearPriceRange, // ✅ ADDED
} = subCatProdactSlice.actions;

// ✅ UPDATED SELECTORS WITH CORRECT STATE PATH
export const selectSubCatProducts = (state) => state.subCatProdact.products;
export const selectSubCatLoading = (state) => state.subCatProdact.loading;
export const selectSubCatLoadingMore = (state) => state.subCatProdact.loadingMore;
export const selectSubCatLoadingFilters = (state) => state.subCatProdact.loadingFilters;
export const selectSubCatError = (state) => state.subCatProdact.error;
export const selectSubCatQuery = (state) => state.subCatProdact.query;
export const selectSubCatFilters = (state) => state.subCatProdact.filters;
export const selectSubCatPriceRange = (state) => state.subCatProdact.priceRange; // ✅ NEW
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
export const selectSubCatFiltersLoaded = (state) => state.subCatProdact.filtersLoaded;

export default subCatProdactSlice.reducer;
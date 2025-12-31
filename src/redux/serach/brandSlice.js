import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

export const fetchBrandSubProducts = createAsyncThunk(
  "brandSub/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${Baseurl}/api/v1/product/getBrandSubCategoryProducts`,
        params
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchBrandSubFilters = createAsyncThunk(
  "brandSub/fetchFilters",
  async (params, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${Baseurl}/api/v1/product/getBrandSubCategoryFilters`,
        params
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const loadMoreBrandSubProducts = createAsyncThunk(
  "brandSub/loadMore",
  async (params, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${Baseurl}/api/v1/product/getBrandSubCategoryProducts`,
        params
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  success: false,
  products: [],
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
  filters: [],
  priceRange: null, // ✅ ADDED: Dynamic price range from API
  filtersCount: 0,
  filtersLoaded: false,
  loading: false,
  loadingMore: false,
  loadingFilters: false,
  error: null,
};

const brandSubSlice = createSlice({
  name: "brandSub",
  initialState,

  reducers: {
    clearBrandSub: () => initialState,
    resetFiltersLoaded: (state) => {
      state.filtersLoaded = false;
    },
    updateSelectedFilters: (state, action) => {
      state.selectedFilters = action.payload;
    },
    clearSelectedFilters: (state) => {
      if (state.selectedFilters) {
        Object.keys(state.selectedFilters).forEach((key) => {
          state.selectedFilters[key] = [];
        });
      }
    },
    clearPriceRange: (state) => { // ✅ ADDED
      state.priceRange = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------------- FETCH PRODUCTS ---------------- */
      .addCase(fetchBrandSubProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandSubProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;

        state.products = action.payload.products || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 20;
        state.totalPages = action.payload.totalPages || 1;
        state.error = null;
      })
      .addCase(fetchBrandSubProducts.rejected, (state, action) => {
        state.loading = false;
        state.products = [];
        state.error = action.payload?.message || action.error.message;
      })

      /* ---------------- LOAD MORE ---------------- */
      .addCase(loadMoreBrandSubProducts.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreBrandSubProducts.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.success = action.payload.success;
        state.products = [
          ...state.products,
          ...(action.payload.products || []),
        ];
        state.page = action.payload.page || state.page + 1;
        state.total = action.payload.total || state.total;
        state.totalPages = action.payload.totalPages || state.totalPages;
      })
      .addCase(loadMoreBrandSubProducts.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload?.message || action.error.message;
      })

      /* ---------------- FETCH FILTERS ---------------- */
      .addCase(fetchBrandSubFilters.pending, (state) => {
        state.loadingFilters = true;
        state.error = null;
      })
      .addCase(fetchBrandSubFilters.fulfilled, (state, action) => {
        state.loadingFilters = false;
        state.filtersLoaded = true;

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
                if (p.price) {
                  if (typeof p.price === 'object' && p.price.current) {
                    return Number(p.price.current);
                  }
                  return Number(p.price);
                }
                return 0;
              })
              .filter(p => p > 0 && !isNaN(p));
            
            if (prices.length > 0) {
              state.priceRange = {
                min: Math.min(...prices),
                max: Math.max(...prices)
              };
            }
          }
        }

        // ✅ STATIC FILTERS (ONLY LOADED ONCE)
        const filters = action.payload.filters || [];

        const transformedFilters = filters.map((filter) => {
          if (filter.values && Array.isArray(filter.values)) {
            return filter;
          }
          if (filter.value) {
            return {
              ...filter,
              values: filter.value.split(", ").filter((v) => v.trim()),
            };
          }
          return filter;
        });

        state.filters = transformedFilters;
        state.filtersCount = action.payload.filtersCount || 0;
        state.success = action.payload.success;

      })
      .addCase(fetchBrandSubFilters.rejected, (state, action) => {
        state.loadingFilters = false;
        state.filtersLoaded = true;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const {
  clearBrandSub,
  resetFiltersLoaded,
  updateSelectedFilters,
  clearSelectedFilters,
  clearPriceRange, // ✅ ADDED
} = brandSubSlice.actions;

/* ---------------- SELECTORS ---------------- */
export const selectBrandSubProducts = (state) => state.brandSub.products;
export const selectBrandSubTotal = (state) => state.brandSub.total;
export const selectBrandSubPage = (state) => state.brandSub.page;
export const selectBrandSubLimit = (state) => state.brandSub.limit;
export const selectBrandSubTotalPages = (state) => state.brandSub.totalPages;
export const selectBrandSubFilters = (state) => state.brandSub.filters;
export const selectBrandSubPriceRange = (state) => state.brandSub.priceRange; // ✅ NEW
export const selectBrandSubFiltersCount = (state) => state.brandSub.filtersCount;
export const selectBrandSubFiltersLoaded = (state) => state.brandSub.filtersLoaded;
export const selectBrandSubLoading = (state) => state.brandSub.loading;
export const selectBrandSubLoadingMore = (state) => state.brandSub.loadingMore;
export const selectBrandSubLoadingFilters = (state) => state.brandSub.loadingFilters;
export const selectBrandSubError = (state) => state.brandSub.error;
export const selectBrandSubSuccess = (state) => state.brandSub.success;

export const selectBrandSubPagination = (state) => ({
  page: state.brandSub.page,
  limit: state.brandSub.limit,
  total: state.brandSub.total,
  totalPages: state.brandSub.totalPages,
  hasNext: state.brandSub.page < state.brandSub.totalPages,
});

export default brandSubSlice.reducer;
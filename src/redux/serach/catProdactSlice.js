import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

/* ------------------------------------
   FETCH CATEGORY PRODUCTS
------------------------------------ */
export const CategoryProducts = createAsyncThunk(
  "categoryProdact/CategoryProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/getCategoryProducts`,
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

/* ------------------------------------
   FETCH CATEGORY FILTERS
------------------------------------ */
export const getCategoryFilters = createAsyncThunk(
  "categoryProdact/getCategoryFilters",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/getCategoryFilters`,
        params
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ------------------------------------
   LOAD MORE CATEGORY PRODUCTS
------------------------------------ */
export const loadMoreCategoryProducts = createAsyncThunk(
  "categoryProdact/loadMoreCategoryProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/getCategoryProducts`,
        params
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ------------------------------------
   INITIAL STATE
------------------------------------ */
const initialState = {
  success: false,
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
  currentCategory: null, // Track current category
  error: null,
  sort: "relevance",
};

/* ------------------------------------
   CATEGORY SLICE
------------------------------------ */
const categoryProdactSlice = createSlice({
  name: "categoryProdact",
  initialState,
  reducers: {
    setSortOption: (state, action) => {
      state.sort = action.payload;
      state.page = 1;
    },
    clearCategory: () => ({ ...initialState }),
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
    // NEW ACTION: Clear products when category changes
    clearProductsForNewCategory: (state) => {
      state.products = [];
      state.page = 1;
      state.total = 0;
      state.hasFetchedOnce = false; // 🔥 reset
      state.loading = true; // Show loading immediately
      state.filtersLoaded = false;
      state.currentCategory = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CategoryProducts.pending, (state, action) => {
        const { category, page } = action.meta.arg;

        // 🔥 Always show loader for first page
        if (page === 1) {
          state.loading = true;
          state.loadingMore = false;
        }
      })
      .addCase(CategoryProducts.fulfilled, (state, action) => {
        const { page, category } = action.meta.arg;

        // Accept response only for active category
        state.currentCategory = category;
        state.hasFetchedOnce = true; // 🔥 VERY IMPORTANT

        state.success = action.payload.success;
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
      .addCase(CategoryProducts.rejected, (state, action) => {
        const { category } = action.meta.arg;
        state.hasFetchedOnce = true; // even on error

        if (state.currentCategory === null || state.currentCategory === category) {
          state.loading = false;
          state.error = action.payload?.message || action.error.message;
          state.products = [];
          state.success = false;
        }
      })

      /* ---------- FILTERS ---------- */
      .addCase(getCategoryFilters.pending, (state) => {
        state.loadingFilters = true;
        state.error = null;
      })
      .addCase(getCategoryFilters.fulfilled, (state, action) => {
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
                if (p.price) {
                  // Handle both number and object price formats
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
        const raw = action.payload.filters || {};
        const normalized = [];

        // ✅ BRAND
        if (Array.isArray(raw.brand) && raw.brand.length > 0) {
          normalized.push({
            name: "brand",
            values: raw.brand,
            tag: "static",
          });
        }

        // ✅ CATEGORY TAG
        if (Array.isArray(raw.CategoryTag) && raw.CategoryTag.length > 0) {
          normalized.push({
            name: "CategoryTag",
            values: raw.CategoryTag,
            tag: "static",
          });
        }

        // ✅ SUBCATEGORY
        if (Array.isArray(raw.SubCategory) && raw.SubCategory.length > 0) {
          normalized.push({
            name: "SubCategory",
            values: raw.SubCategory,
            tag: "static",
          });
        }

        // ✅ ATTRIBUTE FILTERS
        if (Array.isArray(raw.attributes)) {
          raw.attributes.forEach((attr) => {
            if (attr.values && attr.values.length > 0) {
              normalized.push(attr);
            }
          });
        }

        state.filters = normalized;
        state.filtersLoaded = true;
      })
      .addCase(getCategoryFilters.rejected, (state, action) => {
        state.loadingFilters = false;
        state.error = action.payload?.message || action.error.message;
        state.filtersLoaded = true;
      })

      /* ---------- LOAD MORE ---------- */
      .addCase(loadMoreCategoryProducts.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreCategoryProducts.fulfilled, (state, action) => {
        state.loadingMore = false;

        const newProducts = action.payload.products || [];

        state.products = [...state.products, ...newProducts];
        state.total = action.payload.total || state.total;
        state.page = action.meta.arg.page; // 🔥 trust caller
      })
      .addCase(loadMoreCategoryProducts.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

/* ------------------------------------
   EXPORTS
------------------------------------ */
export const {
  setSortOption,
  clearCategory,
  setPage,
  resetFetching,
  resetFiltersLoaded,
  clearPriceRange,
  clearProductsForNewCategory, // Export the new action
} = categoryProdactSlice.actions;

/* ------------------------------------
   SELECTORS
------------------------------------ */
export const selectCategoryProducts = (state) => state.categoryProdact.products;
export const selectCategoryLoading = (state) => state.categoryProdact.loading;
export const selectCategoryLoadingMore = (state) => state.categoryProdact.loadingMore;
export const selectCategoryFilters = (state) => state.categoryProdact.filters;
export const selectCategoryPriceRange = (state) => state.categoryProdact.priceRange;
export const selectCategoryLoadingFilters = (state) => state.categoryProdact.loadingFilters;
export const selectCategoryFiltersLoaded = (state) => state.categoryProdact.filtersLoaded;
export const selectCategoryPagination = (state) => ({
  page: state.categoryProdact.page,
  limit: state.categoryProdact.limit,
  total: state.categoryProdact.total,
  totalPages: state.categoryProdact.totalPages,
  count: state.categoryProdact.count,
  hasNext: state.categoryProdact.page < state.categoryProdact.totalPages,
});
export const selectCategorySort = (state) => state.categoryProdact.sort;
export const selectCategorySuccess = (state) => state.categoryProdact.success;
export const selectHasFetchedOnce = (state) => state.categoryProdact.hasFetchedOnce;
export const selectCurrentCategory = (state) => state.categoryProdact.currentCategory;

export default categoryProdactSlice.reducer;
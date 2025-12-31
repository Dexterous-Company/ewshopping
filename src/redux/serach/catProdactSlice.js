import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

/* ------------------------------------
   FETCH CATEGORY PRODUCTS
------------------------------------ */
export const CategoryProducts = createAsyncThunk(
  "categoryProdact/CategoryProducts", // ✅ Changed to match component selector
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
  "categoryProdact/getCategoryFilters", // ✅ Changed to match component selector
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
  "categoryProdact/loadMoreCategoryProducts", // ✅ Changed to match component selector
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
  priceRange: null, // ✅ ADDED: Dynamic price range from API
  loading: false,
  loadingMore: false,
  loadingFilters: false,
  filtersLoaded: false,
  error: null,
  sort: "relevance",
};

/* ------------------------------------
   CATEGORY SLICE
------------------------------------ */
const categoryProdactSlice = createSlice({ // ✅ Changed slice name
  name: "categoryProdact", // ✅ Changed to match component selector
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
    clearPriceRange: (state) => { // ✅ ADDED
      state.priceRange = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- INITIAL LOAD ---------- */
      .addCase(CategoryProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CategoryProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 20;
        state.totalPages = action.payload.totalPages || 1;
        state.count = action.payload.count || 0;
        state.products = action.payload.products || [];
        state.sort = action.meta.arg?.sort || "relevance";
        state.error = null;
      })
      .addCase(CategoryProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.products = [];
        state.success = false;
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
        state.success = action.payload.success;
        state.total = action.payload.total || state.total;
        state.page += 1;
        state.products = [
          ...state.products,
          ...(action.payload.products || []),
        ];
        state.error = null;
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
  clearPriceRange, // ✅ ADDED
} = categoryProdactSlice.actions;

/* ------------------------------------
   SELECTORS
------------------------------------ */
export const selectCategoryProducts = (state) => state.categoryProdact.products;
export const selectCategoryLoading = (state) => state.categoryProdact.loading;
export const selectCategoryLoadingMore = (state) => state.categoryProdact.loadingMore;
export const selectCategoryFilters = (state) => state.categoryProdact.filters;
export const selectCategoryPriceRange = (state) => state.categoryProdact.priceRange; // ✅ NEW
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

export default categoryProdactSlice.reducer;
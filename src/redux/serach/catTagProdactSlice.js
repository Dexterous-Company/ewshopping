import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

/* ===================================================
   CATEGORY TAG PRODUCTS
=================================================== */
export const CategoryTagProducts = createAsyncThunk(
  "categoryTag/CategoryTagProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/getCategoryTagProducts`,
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

/* ===================================================
   CATEGORY TAG FILTERS
=================================================== */
export const getCategoryTagFilters = createAsyncThunk(
  "categoryTag/getCategoryTagFilters",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/getCategoryTagFilters`,
        params
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===================================================
   LOAD MORE PRODUCTS
=================================================== */
export const loadMoreCategoryTagProducts = createAsyncThunk(
  "categoryTag/loadMoreCategoryTagProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/search/getCategoryTagProducts`,
        params
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===================================================
   INITIAL STATE
=================================================== */
const initialState = {
  success: false,
  total: 0,
  page: 1,
  limit: 30,
  totalPages: 1,
  count: 0,
  products: [],
  filters: [],
  priceRange: null, // ✅ ADDED: Dynamic price range from API
  loading: false,
  loadingMore: false,
  loadingFilters: false,
  filtersLoaded: false,
  hasFetchedOnce: false, // 🔥 NEW
  currentCategoryTag: null, // 🔥 NEW
  error: null,
  sort: "relevance",
};

/* ===================================================
   SLICE
=================================================== */
const categoryTagSlice = createSlice({
  name: "categoryTag",
  initialState,
  reducers: {
    setSortOption: (state, action) => {
      state.sort = action.payload;
      state.page = 1;
    },
    clearCategoryTagState: () => initialState,
    resetFiltersLoaded: (state) => {
      state.filtersLoaded = false;
    },
    clearPriceRange: (state) => {
      state.priceRange = null;
    },
    clearProductsForNewCategoryTag: (state) => {
      state.products = [];
      state.page = 1;
      state.total = 0;
      state.hasFetchedOnce = false;
      state.loading = true;
      state.filtersLoaded = false;
      state.currentCategoryTag = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ---------- FETCH PRODUCTS ---------- */
      .addCase(CategoryTagProducts.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.loading = true;
          state.loadingMore = false;
        }
      })
      .addCase(CategoryTagProducts.fulfilled, (state, action) => {
        const { page, categoryTag } = action.meta.arg;

        state.currentCategoryTag = categoryTag;
        state.hasFetchedOnce = true;

        state.success = action.payload.success;
        state.total = action.payload.total || 0;
        state.page = page;
        state.limit = action.payload.limit || 30;
        state.totalPages = action.payload.totalPages || 1;

        if (page === 1) {
          state.products = action.payload.products || [];
        } else {
          state.products = [
            ...state.products,
            ...(action.payload.products || []),
          ];
        }

        state.loading = false;
        state.loadingMore = false;
        state.error = null;
      })
      .addCase(CategoryTagProducts.rejected, (state, action) => {
        state.hasFetchedOnce = true;
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload?.message || action.error.message;
        state.products = [];
      })

      /* ---------- LOAD MORE ---------- */
      .addCase(loadMoreCategoryTagProducts.pending, (state) => {
        state.loadingMore = true;
      })
      .addCase(loadMoreCategoryTagProducts.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.products = [
          ...state.products,
          ...(action.payload.products || []),
        ];
        state.total = action.payload.total || state.total;
        state.page = action.meta.arg.page; // 🔥 FIXED
      })
      .addCase(loadMoreCategoryTagProducts.rejected, (state) => {
        state.loadingMore = false;
      })

      /* ---------- FETCH FILTERS (ONLY ONCE) ---------- */
      .addCase(getCategoryTagFilters.pending, (state) => {
        state.loadingFilters = true;
      })
      .addCase(getCategoryTagFilters.fulfilled, (state, action) => {
        state.loadingFilters = false;
        state.filtersLoaded = true;

        if (action.payload.priceRange) {
          state.priceRange = action.payload.priceRange;
        }

        const raw = action.payload.filters || {};
        const normalized = [];

        if (Array.isArray(raw.brand)) {
          normalized.push({ name: "brand", values: raw.brand });
        }

        if (Array.isArray(raw.attributes)) {
          raw.attributes.forEach((a) => {
            if (a.values?.length) normalized.push(a);
          });
        }

        state.filters = normalized;
      })
      .addCase(getCategoryTagFilters.rejected, (state) => {
        state.loadingFilters = false;
        state.filtersLoaded = true;
      });
  },
});

/* ===================================================
   EXPORTS
=================================================== */
export const {
  setSortOption,
  clearCategoryTagState,
  resetFiltersLoaded,
  clearPriceRange,
  clearProductsForNewCategoryTag,
} = categoryTagSlice.actions;

/* ===================================================
   SELECTORS
=================================================== */
export const selectCategoryTagProducts = (state) => state.categoryTag.products;
export const selectCategoryTagFilters = (state) => state.categoryTag.filters;
export const selectCategoryTagPriceRange = (state) =>
  state.categoryTag.priceRange; // ✅ NEW
export const selectCategoryTagLoading = (state) => state.categoryTag.loading;
export const selectCategoryTagLoadingMore = (state) =>
  state.categoryTag.loadingMore;
export const selectCategoryTagLoadingFilters = (state) =>
  state.categoryTag.loadingFilters;
export const selectCategoryTagPagination = (state) => ({
  page: state.categoryTag.page,
  limit: state.categoryTag.limit,
  total: state.categoryTag.total,
  totalPages: state.categoryTag.totalPages,
  hasNext: state.categoryTag.page < state.categoryTag.totalPages,
});
export const selectCategoryTagSort = (state) => state.categoryTag.sort;
export const selectCategoryTagSuccess = (state) => state.categoryTag.success;
export const selectFiltersLoaded = (state) => state.categoryTag.filtersLoaded;

export default categoryTagSlice.reducer;

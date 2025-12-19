import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

export const fetchRelatedProducts = createAsyncThunk(
  "cart/fetchRelatedProducts ",
  async (productId, { rejectWithValue }) => {
    try {
      console.log("arbaz 1", `${Baseurl}/api/v1/product/subcategory/${productId}`);

      const response = await axios.get(
        `${Baseurl}/api/v1/product/subcategory/${productId}`
      );

      console.log("arbaz 2", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  relatedProducts: [],
  isLoading: false,
  error: null,
  currentProductId: null,
  lastFetched: null,
};

const relatedProductsSlice = createSlice({
  name: "relatedProducts",
  initialState,
  reducers: {
    clearRelatedProducts: (state) => {
      state.relatedProducts = [];
      state.error = null;
      state.currentProductId = null;
    },
    setRelatedProducts: (state, action) => {
      state.relatedProducts = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    removeRelatedProduct: (state, action) => {
      state.relatedProducts = state.relatedProducts.filter(
        (product) => product._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.relatedProducts = action.payload.relatedProduct || [];
        state.currentProductId = action.meta.arg;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch related products";
        state.relatedProducts = [];
      });
  },
});

// Selectors
export const selectRelatedProducts = (state) =>
  state.relatedProducts.relatedProducts;
export const selectRelatedProductsLoading = (state) =>
  state.relatedProducts.isLoading;
export const selectRelatedProductsError = (state) =>
  state.relatedProducts.error;
export const selectCurrentProductId = (state) =>
  state.relatedProducts.currentProductId;
export const selectLastFetched = (state) => state.relatedProducts.lastFetched;

// Check if related products are available for a specific product
export const selectHasRelatedProducts = (state, productId) => {
  return (
    state.relatedProducts.currentProductId === productId &&
    state.relatedProducts.relatedProducts.length > 0
  );
};

// Select related products excluding the current product
export const selectRelatedProductsExcludingCurrent = (
  state,
  currentProductId
) => {
  return state.relatedProducts.relatedProducts.filter(
    (product) =>
      product.productID !== currentProductId && product._id !== currentProductId
  );
};

// Select specific number of related products
export const selectLimitedRelatedProducts = (state, limit = 5) => {
  return state.relatedProducts.relatedProducts.slice(0, limit);
};

export const {
  clearRelatedProducts,
  setRelatedProducts,
  removeRelatedProduct,
} = relatedProductsSlice.actions;
export default relatedProductsSlice.reducer;

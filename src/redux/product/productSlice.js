// productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

export const getSingleApprovedProductDetails = createAsyncThunk(
  "product/getSingleApprovedProductDetails",
  async (slugurl, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${Baseurl}/api/v1/approve_card/productby/${slugurl}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    product: null,
    selectedVariant: 0, // Add selectedVariant to initial state
    status: "idle",
    error: null,
  },
  reducers: {
    setSelectedVariant: (state, action) => {
      state.selectedVariant = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSingleApprovedProductDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSingleApprovedProductDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload.product;
        state.selectedVariant = 0; // Reset to first variant when new product loads
      })
      .addCase(getSingleApprovedProductDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setSelectedVariant } = productSlice.actions;
export default productSlice.reducer;
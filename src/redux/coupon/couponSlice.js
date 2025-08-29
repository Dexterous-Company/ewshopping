// store/slices/couponSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// Async thunks for API calls
export const validateCoupon = createAsyncThunk(
  'coupon/validateCoupon',
  async ({ code, userId, amount }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${Baseurl}/coupons/validate`, {
        code,
        userId,
        amount
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserCoupons = createAsyncThunk(
  'coupon/getUserCoupons',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${Baseurl}/api/v1/coupons/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const applyCoupon = createAsyncThunk(
  'coupon/applyCoupon',
  async ({ couponId, userId, orderId, orderAmount, discountApplied }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${Baseurl}/coupons/apply`, {
        couponId,
        userId,
        orderId,
        orderAmount,
        discountApplied
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const checkFirstPurchaseCoupon = createAsyncThunk(
  'coupon/checkFirstPurchaseCoupon',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${Baseurl}/coupons/first-purchase/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCouponHistory = createAsyncThunk(
  'coupon/getCouponHistory',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${Baseurl}/coupons/user/history/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  availableCoupons: [],
  couponHistory: [],
  firstPurchaseCoupon: null,
  currentCoupon: null,
  validationError: null,
  loading: false,
  error: null,
};

// Create slice
const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    clearCoupon: (state) => {
      state.currentCoupon = null;
      state.validationError = null;
    },
    clearCouponError: (state) => {
      state.error = null;
      state.validationError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Validate Coupon
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true;
        state.validationError = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCoupon = action.payload;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.validationError = action.payload?.error || 'Invalid coupon';
      })
      
      // Get User Coupons
      .addCase(getUserCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.availableCoupons = action.payload.coupons;
      })
      .addCase(getUserCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to load coupons';
      })
      
      // Apply Coupon
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(applyCoupon.fulfilled, (state) => {
        state.loading = false;
        state.currentCoupon = null; // Clear after successful application
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to apply coupon';
      })
      
      // Check First Purchase Coupon
      .addCase(checkFirstPurchaseCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkFirstPurchaseCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.firstPurchaseCoupon = action.payload.eligible ? action.payload.coupon : null;
      })
      .addCase(checkFirstPurchaseCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to check first purchase coupon';
      })
      
      // Get Coupon History
      .addCase(getCouponHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCouponHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.couponHistory = action.payload.history;
      })
      .addCase(getCouponHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to load coupon history';
      });
  }
});

export const { clearCoupon, clearCouponError } = couponSlice.actions;
export default couponSlice.reducer;
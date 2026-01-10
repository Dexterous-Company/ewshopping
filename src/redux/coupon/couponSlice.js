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
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch coupon by code from your controller
export const getCouponByCode = createAsyncThunk(
  'coupon/getCouponByCode',
  async (couponCode, { rejectWithValue }) => {
    try {
      // Fetch coupon from your controller: GET /api/v1/coupons/:code
      const response = await axios.get(`${Baseurl}/api/v1/coupons/${couponCode}`);
      
      // Check if coupon exists based on your controller response
      if (!response.data.coupon) {
        return rejectWithValue("Coupon not found");
      }
      
      return {
        success: true,
        coupon: response.data.coupon
      };
    } catch (error) {
      // Handle errors from your controller
      if (error.response?.status === 404) {
        return rejectWithValue("Coupon not found");
      }
      if (error.response?.status === 500) {
        return rejectWithValue("Server error");
      }
      return rejectWithValue(error.message || "Failed to fetch coupon");
    }
  }
);

// NEW: Validate coupon for cart with cart data
export const validateCouponForCart = createAsyncThunk(
  'coupon/validateCouponForCart',
  async ({ couponCode, cartAmount, cartItems = [] }, { rejectWithValue, dispatch }) => {
    try {
      // Step 1: Fetch coupon from API
      const couponResult = await dispatch(getCouponByCode(couponCode)).unwrap();
      
      if (!couponResult.success || !couponResult.coupon) {
        return rejectWithValue("Invalid coupon code");
      }
      
      const coupon = couponResult.coupon;
      
      // Step 2: Validate coupon locally with cart data
      const validation = validateCouponLogic(coupon, cartAmount, cartItems);
      
      if (!validation.valid) {
        return rejectWithValue(validation.message);
      }
      
      return {
        valid: true,
        coupon,
        discountAmount: validation.discountAmount,
        message: validation.message
      };
      
    } catch (error) {
      console.error("Error validating coupon:", error);
      return rejectWithValue(error.message || "Failed to validate coupon");
    }
  }
);

// Helper function to validate coupon logic
const validateCouponLogic = (coupon, cartAmount, cartItems) => {
  console.log("Validating coupon:", coupon);
  
  // Basic validation
  if (!coupon) {
    return { valid: false, message: "Coupon not found" };
  }
  
  // Check if coupon is active
  if (!coupon.isActive) {
    return { valid: false, message: "This coupon is not active" };
  }
  
  // Check validity dates
  const currentDate = new Date();
  
  if (coupon.validFrom) {
    const validFrom = new Date(coupon.validFrom);
    if (currentDate < validFrom) {
      return { valid: false, message: "Coupon is not yet valid" };
    }
  }
  
  if (coupon.validUntil) {
    const validUntil = new Date(coupon.validUntil);
    if (currentDate > validUntil) {
      return { valid: false, message: "Coupon has expired" };
    }
  }
  
  // Check minimum purchase
  if (coupon.minPurchase && cartAmount < coupon.minPurchase) {
    return { 
      valid: false, 
      message: `Minimum purchase of ₹${coupon.minPurchase} required` 
    };
  }
  
  // Check usage limit
  if (coupon.usageLimit && coupon.usedBy && coupon.usedBy.length >= coupon.usageLimit) {
    return { valid: false, message: "Coupon usage limit reached" };
  }
  
  // Check applicable categories (if any)
  if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
    const hasEligibleCategory = cartItems.some(item => 
      coupon.applicableCategories.includes(item.categoryId)
    );
    
    if (!hasEligibleCategory) {
      return { 
        valid: false, 
        message: "No eligible categories for this coupon" 
      };
    }
  }
  
  // Calculate discount amount
  let discountAmount = 0;
  
  // Normalize discount type
  const discountType = (coupon.discountType || "").toLowerCase();
  
  switch (discountType) {
    case 'percentage':
    case 'percent':
      discountAmount = (cartAmount * coupon.discountValue) / 100;
      
      // Apply max discount limit if specified
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
      break;
      
    case 'fixed':
    case 'flat':
    case 'amount':
      discountAmount = Math.min(coupon.discountValue, cartAmount);
      break;
      
    default:
      return { 
        valid: false, 
        message: `Unsupported discount type: ${coupon.discountType}` 
      };
  }
  
  // Ensure discount is positive
  if (discountAmount <= 0) {
    return { valid: false, message: "No discount applicable" };
  }
  
  // Ensure discount doesn't exceed cart amount
  if (discountAmount > cartAmount) {
    discountAmount = cartAmount;
  }
  
  return {
    valid: true,
    message: `Coupon applied! You save ₹${discountAmount.toFixed(2)}`,
    discountAmount
  };
};

export const getUserCoupons = createAsyncThunk(
  'coupon/getUserCoupons',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${Baseurl}/api/v1/coupons/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
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
      return rejectWithValue(error.response?.data || error.message);
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
      return rejectWithValue(error.response?.data || error.message);
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
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  availableCoupons: [],
  couponHistory: [],
  firstPurchaseCoupon: null,
  currentCoupon: null,
  couponData: null,
  validationError: null,
  validationState: {
    loading: false,
    valid: false,
    coupon: null,
    discountAmount: 0,
    error: null
  },
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
      state.couponData = null;
      state.validationError = null;
      state.validationState = initialState.validationState;
    },
    clearCouponError: (state) => {
      state.error = null;
      state.validationError = null;
      state.validationState.error = null;
    },
    setCouponData: (state, action) => {
      state.couponData = action.payload;
    },
    // Add a reducer to manually set validation state
    setValidationState: (state, action) => {
      state.validationState = {
        ...state.validationState,
        ...action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Coupon By Code
      .addCase(getCouponByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.couponData = null;
      })
      .addCase(getCouponByCode.fulfilled, (state, action) => {
        state.loading = false;
        state.couponData = action.payload.coupon;
        state.error = null;
      })
      .addCase(getCouponByCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.couponData = null;
      })
      
      // Validate Coupon For Cart
      .addCase(validateCouponForCart.pending, (state) => {
        state.validationState.loading = true;
        state.validationState.error = null;
        state.validationState.valid = false;
        state.validationError = null;
      })
      .addCase(validateCouponForCart.fulfilled, (state, action) => {
        state.validationState.loading = false;
        state.validationState.valid = true;
        state.validationState.coupon = action.payload.coupon;
        state.validationState.discountAmount = action.payload.discountAmount;
        state.validationState.error = null;
        state.validationError = null;
        state.couponData = action.payload.coupon;
      })
      .addCase(validateCouponForCart.rejected, (state, action) => {
        state.validationState.loading = false;
        state.validationState.valid = false;
        state.validationState.error = action.payload;
        state.validationState.coupon = null;
        state.validationState.discountAmount = 0;
        state.validationError = action.payload;
      })
      
      // Validate Coupon (old endpoint)
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
        state.availableCoupons = action.payload.coupons || [];
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
        state.currentCoupon = null;
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
        state.couponHistory = action.payload.history || [];
      })
      .addCase(getCouponHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to load coupon history';
      });
  }
});

export const { clearCoupon, clearCouponError, setCouponData, setValidationState } = couponSlice.actions;
export default couponSlice.reducer;
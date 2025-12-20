import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// Async thunk for fetching brands by promotion type
export const fetchBrandsByPromotion = createAsyncThunk(
  'newBrands/fetchBrandsByPromotion',
  async (promotionType, { rejectWithValue }) => {
    try {
      
      const response = await axios.get(`${Baseurl}/api/v1/newbrands/brands/promotion/${promotionType}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch promoted brands'
      );
    }
  }
);

// Initial state
const initialState = {
  brands: [],
  loading: false,
  error: null,
  success: false,
  promotionType: '',
  count: 0
};

// Create slice
const newBrandSlice = createSlice({
  name: 'newBrands',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },
    // Reset state
    resetBrands: (state) => {
      state.brands = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.promotionType = '';
      state.count = 0;
    },
    // Clear promotion specific data
    clearPromotionData: (state) => {
      state.promotionType = '';
      state.count = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch brands by promotion cases
      .addCase(fetchBrandsByPromotion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchBrandsByPromotion.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.brands;
        state.promotionType = action.payload.promotionType;
        state.count = action.payload.count;
        state.success = true;
        state.error = null;
      })
      .addCase(fetchBrandsByPromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.brands = [];
        state.promotionType = '';
        state.count = 0;
      });
  }
});

// Export actions and reducer
export const { clearError, resetBrands, clearPromotionData } = newBrandSlice.actions;
export default newBrandSlice.reducer;
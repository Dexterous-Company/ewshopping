// slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// Helper function for SSR-compatible localStorage access
const getInitialCartItems = () => {
  if (typeof window !== "undefined") {
    try {
      const items = localStorage.getItem("CartItems");
      // Add proper validation
      if (items && items.trim() !== "" && items !== "null" && items !== "undefined") {
        return JSON.parse(items);
      }
      return [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  }
  return [];
};

// Helper function to cleanup localStorage
const cleanupLocalStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const cartItems = localStorage.getItem("CartItems");
      if (cartItems === "undefined" || cartItems === "null" || cartItems === "") {
        localStorage.removeItem("CartItems");
      }
      
      const amountData = localStorage.getItem("all_amount_data");
      if (amountData === "undefined" || amountData === "null" || amountData === "") {
        localStorage.removeItem("all_amount_data");
      }
      
      const couponData = localStorage.getItem("coupon_data");
      if (couponData === "undefined" || couponData === "null" || couponData === "") {
        localStorage.removeItem("coupon_data");
      }
    } catch (error) {
      console.error("Error cleaning up localStorage:", error);
    }
  }
};

// Cleanup localStorage on initialization
if (typeof window !== "undefined") {
  cleanupLocalStorage();
}

// Base URL for API calls
const Baseurl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Async thunk to fetch coupon by code from server
export const fetchCouponByCode = createAsyncThunk(
  'cart/fetchCouponByCode',
  async (couponCode, { rejectWithValue }) => {
    try {
      console.log(`Fetching coupon with code: ${couponCode}`);
      const response = await fetch(`${Baseurl}/api/v1/coupons/${couponCode}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.error || 'Failed to fetch coupon');
      }
      
      const data = await response.json();
      console.log('Coupon data received:', data);
      
      // Transform the MongoDB response to match our expected format
      const coupon = data.coupon || data;
      const transformedCoupon = {
        // Map MongoDB fields to our expected format
        code: coupon.code,
        discountType: coupon.discountType, // "flat" or "percentage"
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minPurchase || 0, // Map minPurchase to minOrderValue
        maxDiscountAmount: coupon.maxDiscount || coupon.discountValue, // Map maxDiscount to maxDiscountAmount
        freeDelivery: coupon.freeDelivery || false,
        appliesToDelivery: coupon.appliesToDelivery || false,
        description: coupon.description || '',
        // Add MongoDB specific fields
        valid: coupon.isActive !== false, // Map isActive to valid
        _id: coupon._id,
        validFrom: coupon.validFrom,
        validUntil: coupon.validUntil,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedBy?.length || 0,
        termsAndConditions: coupon.termsAndConditions || [],
        applicableCategories: coupon.applicableCategories || [],
        isActive: coupon.isActive
      };
      
      return transformedCoupon;
    } catch (error) {
      console.error('Error fetching coupon:', error);
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const initialState = {
  CartItems: [],
  TotalMrp: 0,
  TotalPrice: 0,
  SmallCartFee: 0,
  HandlingFee: 0,
  RainFee: 0,
  DeliveryCharge: 0,
  rainStatus: false,
  wallet: 0,
  coupon: 0,
  TotalAmount: 0,
  Netpayable: 0,
  amountToGetfeeDelivery: 0,
  amountToGetfeeDeliveryPercentage: 0,
  all_amount_data: "",
  Cartloading: false,
  isHydrated: false,
  // New coupon related states
  couponData: null,
  couponError: null,
  appliedCouponCode: "",
  // Coupon loading states
  couponLoading: false,
  availableCoupons: [], // Store available coupons fetched from server
};

// Function to validate and calculate coupon discount
const validateAndCalculateCoupon = (coupon, cartTotal) => {
  if (!coupon) {
    return {
      success: false,
      error: "Invalid coupon code"
    };
  }

  // Check if coupon is active
  if (coupon.isActive === false || coupon.valid === false) {
    return {
      success: false,
      error: "This coupon is no longer active"
    };
  }

  // Check validity dates if available
  const now = new Date();
  
  // Handle MongoDB date format (could be string or object with $date)
  let validFromDate, validUntilDate;
  
  // Parse validFrom
  if (coupon.validFrom) {
    if (typeof coupon.validFrom === 'object' && coupon.validFrom.$date) {
      validFromDate = new Date(coupon.validFrom.$date);
    } else {
      validFromDate = new Date(coupon.validFrom);
    }
  }
  
  // Parse validUntil
  if (coupon.validUntil) {
    if (typeof coupon.validUntil === 'object' && coupon.validUntil.$date) {
      validUntilDate = new Date(coupon.validUntil.$date);
    } else {
      validUntilDate = new Date(coupon.validUntil);
    }
  }
  
  if (validFromDate && validFromDate > now) {
    return {
      success: false,
      error: `This coupon will be valid from ${validFromDate.toLocaleDateString()}`
    };
  }
  
  if (validUntilDate && validUntilDate < now) {
    return {
      success: false,
      error: "This coupon has expired"
    };
  }

  // Check minimum order value
  const minOrderValue = coupon.minOrderValue || coupon.minPurchase || 0;
  if (cartTotal < minOrderValue) {
    return {
      success: false,
      error: `Minimum order value of ₹${minOrderValue} required for this coupon`
    };
  }

  // Check usage limits
  const usageLimit = coupon.usageLimit;
  const usedCount = coupon.usedCount || coupon.usedBy?.length || 0;
  
  if (usageLimit && usedCount >= usageLimit) {
    return {
      success: false,
      error: "This coupon has reached its usage limit"
    };
  }

  let discountAmount = 0;
  
  // Calculate discount based on type
  const discountType = coupon.discountType; // "percentage" or "flat"
  const discountValue = coupon.discountValue || 0;
  
  if (discountType === "percentage") {
    // Calculate percentage discount
    discountAmount = (cartTotal * discountValue) / 100;
    
    // Apply max discount limit if exists
    const maxDiscount = coupon.maxDiscountAmount || coupon.maxDiscount;
    if (maxDiscount && discountAmount > maxDiscount) {
      discountAmount = maxDiscount;
    }
  } else if (discountType === "flat") {
    // Fixed amount discount
    discountAmount = discountValue;
    
    // For flat discounts, maxDiscount is usually same as discountValue
    const maxDiscount = coupon.maxDiscountAmount || coupon.maxDiscount;
    if (maxDiscount && discountAmount > maxDiscount) {
      discountAmount = maxDiscount;
    }
  }

  // Ensure discount doesn't exceed cart total
  discountAmount = Math.min(discountAmount, cartTotal);

  return {
    success: true,
    couponData: coupon,
    discountAmount: discountAmount,
    freeDeliveryApplied: coupon.freeDelivery || false,
    message: `Coupon "${coupon.code}" applied successfully!`
  };
};

const calculateTotals = (state) => {
  // 1️⃣ Reset
  state.TotalMrp = 0;
  state.TotalPrice = 0;

  // 2️⃣ Product totals
  state.CartItems.forEach(item => {
    state.TotalMrp += item.Product_total_Mrp || 0;
    state.TotalPrice += item.Product_total_Price || 0;
  });

  // 3️⃣ Base delivery
  const deliveryBase =
    state.TotalPrice >= 500 || state.couponData?.freeDelivery
      ? 0
      : 40;

  state.DeliveryCharge = deliveryBase;

  // 4️⃣ Coupon split logic (🔥 MAIN FIX)
  let couponRemaining = state.coupon || 0;

  // ➜ Apply to delivery FIRST
  const deliveryDiscount = Math.min(
    couponRemaining,
    state.couponData?.appliesToDelivery ? deliveryBase : 0
  );
  couponRemaining -= deliveryDiscount;

  // ➜ Apply remaining to product
  const productDiscount = Math.min(couponRemaining, state.TotalPrice);
  couponRemaining -= productDiscount;

  // 5️⃣ Final values
  const finalDelivery = deliveryBase - deliveryDiscount;
  const finalProduct = state.TotalPrice - productDiscount;

  state.TotalAmount = finalProduct + finalDelivery;
  state.Netpayable = Math.max(0, state.TotalAmount);

  // 6️⃣ Savings
  const mrpSavings = state.TotalMrp - state.TotalPrice;
  const couponSavings = deliveryDiscount + productDiscount;
  const deliverySavings = deliveryDiscount;

  // 7️⃣ Persist breakdown (USED BY UI)
  state.all_amount_data = JSON.stringify({
    totalMrp: state.TotalMrp,
    totalPrice: state.TotalPrice,
    deliveryCharge: finalDelivery,
    couponDiscount: couponSavings,
    couponBreakdown: {
      deliveryDiscount,
      productDiscount
    },
    netPayable: state.Netpayable,
    totalSavings: mrpSavings + couponSavings
  });
};


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.CartItems.find(
        (item) => item.AttributeId === action.payload.AttributeId
      );
      if (existingItem) {
        // Update existing item
        if (existingItem.cart_Quentity >= existingItem.maximumQuantity) {
          toast.error(
            `Maximum ${existingItem.maximumQuantity} products allowed!`
          );
          return; // stop incrementing
        }

        existingItem.cart_Quentity += 1;
        existingItem.Product_total_Mrp =
          Number(existingItem.Mrp) * Number(existingItem.cart_Quentity);
        existingItem.Product_total_Price = Number(
          existingItem.Price * existingItem.cart_Quentity
        );
        existingItem.Product_total_Saving =
          Number(existingItem.Product_total_Mrp) -
          Number(existingItem.Product_total_Price);
      } else {
        // Add new item
        const newItem = {
          ...action.payload,
          availableStock: action.payload.availableStock || 0,
          maximumQuantity: action.payload.maximumQuantity || 1,
          cart_Quentity: 1,
          Product_total_Mrp: action.payload.Mrp,
          Product_total_Price: action.payload.Price,
          Product_total_Saving:
            Number(action.payload.Mrp) - Number(action.payload.Price),
        };
        state.CartItems.push(newItem);
      }
      calculateTotals(state);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("CartItems", JSON.stringify(state.CartItems));
        } catch (error) {
          console.error("Error saving cart to localStorage:", error);
        }
      }
      state.Cartloading = !state.Cartloading;
    },
    decrementCart: (state, action) => {
      const itemIndex = state.CartItems.findIndex(
        (item) => item.AttributeId === action.payload.AttributeId
      );

      if (itemIndex >= 0) {
        if (state.CartItems[itemIndex].cart_Quentity > 1) {
          // Decrease quantity
          state.CartItems[itemIndex].cart_Quentity -= 1;
          state.CartItems[itemIndex].Product_total_Mrp =
            state.CartItems[itemIndex].Mrp *
            state.CartItems[itemIndex].cart_Quentity;
          state.CartItems[itemIndex].Product_total_Price =
            state.CartItems[itemIndex].Price *
            state.CartItems[itemIndex].cart_Quentity;
          state.CartItems[itemIndex].Product_total_Saving =
            state.CartItems[itemIndex].Product_total_Mrp -
            state.CartItems[itemIndex].Product_total_Price;
        } else {
          // Remove item if quantity would be 0
          state.CartItems = state.CartItems.filter(
            (item) => item.AttributeId !== action.payload.AttributeId
          );
        }

        calculateTotals(state);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("CartItems", JSON.stringify(state.CartItems));
          } catch (error) {
            console.error("Error saving cart to localStorage:", error);
          }
        }
        state.Cartloading = !state.Cartloading;
      }
    },
    removeFromCart: (state, action) => {
      state.CartItems = state.CartItems.filter(
        (item) => item.AttributeId !== action.payload.AttributeId
      );
      calculateTotals(state);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("CartItems", JSON.stringify(state.CartItems));
        } catch (error) {
          console.error("Error saving cart to localStorage:", error);
        }
      }
      state.Cartloading = !state.Cartloading;
    },
    getCartTotal(state) {
      calculateTotals(state);
    },
    getCartData(state) {
      state.CartItems = getInitialCartItems();
      calculateTotals(state);
    },
    clearCart: (state) => {
      state.CartItems = [];
      state.coupon = 0;
      state.couponData = null;
      state.appliedCouponCode = "";
      state.couponError = null;
      calculateTotals(state);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("CartItems", JSON.stringify(state.CartItems));
          localStorage.removeItem("coupon_data");
        } catch (error) {
          console.error("Error saving cart to localStorage:", error);
        }
      }
      state.Cartloading = !state.Cartloading;
      toast.success("Cart cleared successfully");
    },
    setAllAmountData: (state, action) => {
      state.all_amount_data = action.payload;
      if (typeof window !== "undefined") {
        try {
          // Ensure we're storing valid JSON
          if (action.payload) {
            localStorage.setItem(
              "all_amount_data",
              JSON.stringify(state.all_amount_data)
            );
          } else {
            localStorage.removeItem("all_amount_data");
          }
        } catch (error) {
          console.error("Error saving all_amount_data to localStorage:", error);
        }
      }
    },
    
    // Alternative applyCoupon action that doesn't require API call
    // This is useful if you already have coupon data
    applyCouponDirectly: (state, action) => {
      const { couponCode, couponData } = action.payload;
      
      if (!couponData) {
        state.couponError = "Invalid coupon data";
        toast.error("Invalid coupon data");
        return;
      }
      
      const result = validateAndCalculateCoupon(couponData, state.TotalPrice);
      
      if (result.success) {
        // Apply coupon
        state.couponData = result.couponData;
        state.coupon = result.discountAmount;
        state.appliedCouponCode = couponCode.toUpperCase();
        state.couponError = null;
        
        // Save coupon data to localStorage
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("coupon_data", JSON.stringify({
              code: couponCode.toUpperCase(),
              discountAmount: result.discountAmount,
              couponData: result.couponData,
              appliedAt: new Date().toISOString()
            }));
          } catch (error) {
            console.error("Error saving coupon to localStorage:", error);
          }
        }
        
        calculateTotals(state);
        toast.success(result.message);
        
      } else {
        state.couponError = result.error;
        toast.error(result.error);
      }
    },
    
    // Remove coupon action
    removeCoupon: (state) => {
      state.couponData = null;
      state.coupon = 0;
      state.appliedCouponCode = "";
      state.couponError = null;
      
      // Remove from localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("coupon_data");
        } catch (error) {
          console.error("Error removing coupon from localStorage:", error);
        }
      }
      
      calculateTotals(state);
      toast.success("Coupon removed successfully");
    },
    
    // Clear coupon error
    clearCouponError: (state) => {
      state.couponError = null;
    },
    
    // Set available coupons (from server)
    setAvailableCoupons: (state, action) => {
      state.availableCoupons = action.payload;
    },
    
    useWallet: (state, action) => {
      state.wallet = action.payload;
      calculateTotals(state);
    },
    
    setRainStatus: (state, action) => {
      state.rainStatus = action.payload;
      calculateTotals(state);
    },
    
    refreshCartPrices: (state, action) => {
      const updatedPrices = action.payload;

      state.CartItems = state.CartItems.map((item) => {
        const updatedItem = updatedPrices.find(
          (updated) => updated.AttributeId === item.AttributeId
        );

        if (updatedItem) {
          // Update prices while preserving quantity
          return {
            ...item,
            Mrp: updatedItem.Mrp,
            Price: updatedItem.Price,
            Product_total_Mrp: updatedItem.Mrp * item.cart_Quentity,
            Product_total_Price: updatedItem.Price * item.cart_Quentity,
            Product_total_Saving:
              (updatedItem.Mrp - updatedItem.Price) * item.cart_Quentity,
            availableStock: updatedItem.availableStock || item.availableStock,
            maximumQuantity:
              updatedItem.maximumQuantity || item.maximumQuantity,
          };
        }
        return item;
      });

      calculateTotals(state);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("CartItems", JSON.stringify(state.CartItems));
        } catch (error) {
          console.error("Error saving cart to localStorage:", error);
        }
      }
    },
    
    hydrateCart: (state) => {
      try {
        const storedItems = getInitialCartItems();
        state.CartItems = storedItems;
        state.isHydrated = true;
        calculateTotals(state);
      } catch (error) {
        console.error("Error hydrating cart:", error);
        state.CartItems = [];
        state.isHydrated = true;
      }
    },
    
    hydrateAllData: (state) => {
      try {
        // Load cart items
        const storedItems = getInitialCartItems();
        state.CartItems = storedItems;
        
        // Safely load all_amount_data
        if (typeof window !== "undefined") {
          const storedAmountData = localStorage.getItem("all_amount_data");
          if (storedAmountData && storedAmountData.trim() !== "" && 
              storedAmountData !== "null" && storedAmountData !== "undefined") {
            try {
              state.all_amount_data = JSON.parse(storedAmountData);
            } catch (parseError) {
              console.error("Error parsing all_amount_data:", parseError);
              state.all_amount_data = "";
              localStorage.removeItem("all_amount_data");
            }
          }
          
          // Load coupon data if exists
          const storedCouponData = localStorage.getItem("coupon_data");
          if (storedCouponData && storedCouponData.trim() !== "" && 
              storedCouponData !== "null" && storedCouponData !== "undefined") {
            try {
              const couponData = JSON.parse(storedCouponData);
              // Re-validate the coupon with current cart total
              const result = validateAndCalculateCoupon(
                couponData.couponData, 
                state.TotalPrice
              );
              
              if (result.success) {
                state.couponData = result.couponData;
                state.coupon = result.discountAmount;
                state.appliedCouponCode = couponData.code;
              } else {
                // If coupon is no longer valid, remove it
                state.couponError = result.error;
                localStorage.removeItem("coupon_data");
              }
            } catch (parseError) {
              console.error("Error parsing coupon_data:", parseError);
              localStorage.removeItem("coupon_data");
            }
          }
        }
        
        state.isHydrated = true;
        calculateTotals(state);
      } catch (error) {
        console.error("Error hydrating cart:", error);
        state.CartItems = [];
        state.all_amount_data = "";
        state.couponData = null;
        state.coupon = 0;
        state.appliedCouponCode = "";
        state.isHydrated = true;
      }
    },
    
    // New: Get coupon eligibility
    checkCouponEligibility: (state, action) => {
      const coupon = action.payload;
      const result = validateAndCalculateCoupon(coupon, state.TotalPrice);
      return result;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCouponByCode.pending, (state) => {
        state.couponLoading = true;
        state.couponError = null;
      })
      .addCase(fetchCouponByCode.fulfilled, (state, action) => {
        state.couponLoading = false;
        const coupon = action.payload;
        
        // Validate and apply the coupon
        const result = validateAndCalculateCoupon(coupon, state.TotalPrice);
        
        if (result.success) {
          // Apply coupon
          state.couponData = result.couponData;
          state.coupon = result.discountAmount;
          state.appliedCouponCode = coupon.code.toUpperCase();
          state.couponError = null;
          
          // Add to available coupons if not already there
          if (!state.availableCoupons.find(c => c.code === coupon.code)) {
            state.availableCoupons.push(coupon);
          }
          
          // Save coupon data to localStorage
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("coupon_data", JSON.stringify({
                code: coupon.code.toUpperCase(),
                discountAmount: result.discountAmount,
                couponData: result.couponData,
                appliedAt: new Date().toISOString()
              }));
            } catch (error) {
              console.error("Error saving coupon to localStorage:", error);
            }
          }
          
          calculateTotals(state);
          toast.success(result.message);
        } else {
          state.couponError = result.error;
          toast.error(result.error);
        }
      })
      .addCase(fetchCouponByCode.rejected, (state, action) => {
        state.couponLoading = false;
        state.couponError = action.payload || "Failed to fetch coupon";
        toast.error(action.payload || "Invalid coupon code");
      });
  }
});

export const {
  addToCart,
  decrementCart,
  removeFromCart,
  getCartTotal,
  clearCart,
  setAllAmountData,
  applyCouponDirectly,
  removeCoupon,
  clearCouponError,
  setAvailableCoupons,
  useWallet,
  setRainStatus,
  refreshCartPrices,
  hydrateCart,
  getCartData,
  hydrateAllData,
  checkCouponEligibility,
} = cartSlice.actions;

export default cartSlice.reducer;
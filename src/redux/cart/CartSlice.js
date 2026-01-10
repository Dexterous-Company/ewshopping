// slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// Helper function for SSR-compatible localStorage access
const getInitialCartItems = () => {
  if (typeof window !== "undefined") {
    try {
      const items = localStorage.getItem("CartItems");
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

// Helper function to get initial coupon from localStorage
const getInitialCoupon = () => {
  if (typeof window !== "undefined") {
    try {
      const coupon = localStorage.getItem("cartCoupon");
      if (coupon && coupon.trim() !== "" && coupon !== "null" && coupon !== "undefined") {
        return JSON.parse(coupon);
      }
      return null;
    } catch (error) {
      console.error("Error loading coupon from localStorage:", error);
      return null;
    }
  }
  return null;
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
    } catch (error) {
      console.error("Error cleaning up localStorage:", error);
    }
  }
};

// Cleanup localStorage on initialization
if (typeof window !== "undefined") {
  cleanupLocalStorage();
}

// Function to calculate product-specific discount
const calculateProductSpecificDiscount = (coupon, cartItems) => {
  if (!coupon.applicableProducts || coupon.applicableProducts.length === 0) {
    return 0;
  }

  const eligibleTotal = cartItems.reduce((sum, item) => {
    const isEligible = coupon.applicableProducts.includes(item.productId) ||
                     (coupon.applicableCategories && 
                      coupon.applicableCategories.includes(item.categoryId));
    
    return isEligible ? sum + item.Product_total_Price : sum;
  }, 0);

  if (eligibleTotal === 0) return 0;

  let discountAmount = 0;
  
  if (coupon.discountType === 'PERCENTAGE' || coupon.discountType === 'percentage') {
    discountAmount = (eligibleTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else if (coupon.discountType === 'FIXED' || coupon.discountType === 'fixed' || coupon.discountType === 'flat') {
    discountAmount = Math.min(coupon.discountValue, eligibleTotal);
  }
  
  return discountAmount;
};

const initialState = {
  CartItems: [],
  TotalMrp: 0,
  TotalPrice: 0, // Product total (sum of all product prices)
  SmallCartFee: 0,
  HandlingFee: 0,
  RainFee: 0,
  DeliveryCharge: 0,
  rainStatus: false,
  // Wallet removed from state
  coupon: {
    applied: false,
    code: "",
    details: null,
    discountAmount: 0,
    discountType: "",
    maxDiscount: 0,
    minCartValue: 0,
    applicableProducts: [],
    applicableCategories: []
  },
  // CALCULATION BREAKDOWN
  Subtotal: 0, // Product Total + All Fees (BEFORE coupon)
  SubtotalAfterCoupon: 0, // Added this field
  CouponDiscount: 0, // Amount discounted by coupon
  TotalAmount: 0, // Final payable amount (AFTER all discounts)
  Netpayable: 0, // Alias for TotalAmount for backward compatibility
  amountToGetfeeDelivery: 0,
  amountToGetfeeDeliveryPercentage: 0,
  all_amount_data: "",
  Cartloading: false,
  isHydrated: false,
  discountBreakdown: {
    productSavings: 0, // MRP - Selling Price
    couponSavings: 0,
    // Wallet removed
    totalSavings: 0,
    priceBeforeCoupon: 0,
    deliveryBeforeCoupon: 0,
    productTotal: 0, // Just product prices
    feesTotal: 0, // Sum of all fees
    priceAfterCouponBeforeDelivery: 0, // Price after coupon but before delivery recalc
    deliveryCoveredByCoupon: 0, // How much delivery was covered by coupon
    productCoveredByCoupon: 0 // How much product was covered by coupon
  }
};

const calculateTotals = (state) => {
  // Reset all calculated values
  state.TotalMrp = 0;
  state.TotalPrice = 0;
  state.Subtotal = 0;
  state.SubtotalAfterCoupon = 0; // Reset
  state.CouponDiscount = 0;
  state.TotalAmount = 0;
  state.Netpayable = 0;
  state.DeliveryCharge = 0;
  
  state.discountBreakdown.productSavings = 0;
  state.discountBreakdown.productTotal = 0;
  state.discountBreakdown.feesTotal = 0;
  state.discountBreakdown.priceAfterCouponBeforeDelivery = 0;
  state.discountBreakdown.deliveryCoveredByCoupon = 0;
  state.discountBreakdown.productCoveredByCoupon = 0;

  // 1. CALCULATE ITEM TOTALS
  if (state.CartItems && state.CartItems.length > 0) {
    state.CartItems.forEach((item) => {
      state.TotalMrp += item.Product_total_Mrp || 0;
      state.TotalPrice += item.Product_total_Price || 0;
    });
  }

  // Product savings (MRP - Selling Price)
  state.discountBreakdown.productSavings = state.TotalMrp - state.TotalPrice;
  state.discountBreakdown.productTotal = state.TotalPrice;

  // 2. CALCULATE OTHER FEES (excluding delivery)
  state.SmallCartFee = state.TotalPrice >= 100 ? 0 : 0;
  state.RainFee = state.rainStatus ? 20 : 0;
  state.HandlingFee = state.HandlingFee || 0;

  // 3. CALCULATE WHAT DELIVERY CHARGE WOULD BE BASED ON PRODUCT PRICE (before coupon)
  const deliveryBeforeCoupon = state.TotalPrice >= 500 ? 0 : 40;
  state.discountBreakdown.deliveryBeforeCoupon = deliveryBeforeCoupon;

  // 4. CALCULATE COUPON DISCOUNT (based on product price only, NOT including delivery/fees)
  let couponDiscount = 0;
  let priceBeforeCoupon = state.TotalPrice;
  
  if (state.coupon.applied && state.coupon.details) {
    const coupon = state.coupon.details;
    
    // Check minimum cart value
    const cartTotalForCoupon = state.TotalPrice;
    
    if (coupon.minCartValue && cartTotalForCoupon < coupon.minCartValue) {
      // Auto remove coupon if cart value is below minimum
      state.coupon = {
        applied: false,
        code: "",
        details: null,
        discountAmount: 0,
        discountType: "",
        maxDiscount: 0,
        minCartValue: 0,
        applicableProducts: [],
        applicableCategories: []
      };
      if (typeof window !== "undefined") {
        localStorage.removeItem("cartCoupon");
      }
      toast.error(`Coupon removed. Minimum cart value is ₹${coupon.minCartValue}`);
    } else {
      // Calculate discount based on coupon type
      const discountType = (coupon.discountType || "").toLowerCase();
      
      switch (discountType) {
        case 'percentage':
        case 'percent':
          couponDiscount = (cartTotalForCoupon * coupon.discountValue) / 100;
          if (coupon.maxDiscount && couponDiscount > coupon.maxDiscount) {
            couponDiscount = coupon.maxDiscount;
          }
          break;
          
        case 'fixed':
        case 'flat':
        case 'amount':
          couponDiscount = Math.min(coupon.discountValue, cartTotalForCoupon);
          break;
          
        case 'product_specific':
          couponDiscount = calculateProductSpecificDiscount(coupon, state.CartItems);
          break;
          
        default:
          couponDiscount = 0;
      }
    }
  }

  // Update coupon discount
  state.coupon.discountAmount = couponDiscount;
  state.CouponDiscount = couponDiscount;
  state.discountBreakdown.couponSavings = couponDiscount;
  state.discountBreakdown.priceBeforeCoupon = priceBeforeCoupon;

  // 5. APPLY COUPON DISCOUNT WITH PRIORITY: DELIVERY FIRST, THEN PRODUCT
  let remainingCouponDiscount = couponDiscount;
  let deliveryCoveredByCoupon = 0;
  let productCoveredByCoupon = 0;
  
  // FIRST: Apply coupon to cover delivery charge
  if (remainingCouponDiscount > 0 && deliveryBeforeCoupon > 0) {
    deliveryCoveredByCoupon = Math.min(remainingCouponDiscount, deliveryBeforeCoupon);
    remainingCouponDiscount -= deliveryCoveredByCoupon;
  }
  
  // SECOND: Apply remaining coupon to product price
  if (remainingCouponDiscount > 0 && state.TotalPrice > 0) {
    productCoveredByCoupon = Math.min(remainingCouponDiscount, state.TotalPrice);
    remainingCouponDiscount -= productCoveredByCoupon;
  }
  
  // Store breakdown for debugging
  state.discountBreakdown.deliveryCoveredByCoupon = deliveryCoveredByCoupon;
  state.discountBreakdown.productCoveredByCoupon = productCoveredByCoupon;

  // 6. CALCULATE FINAL DELIVERY CHARGE AFTER COUPON COVERAGE
  const finalDeliveryCharge = Math.max(0, deliveryBeforeCoupon - deliveryCoveredByCoupon);
  state.DeliveryCharge = finalDeliveryCharge;

  // 7. CALCULATE PRODUCT PRICE AFTER COUPON
  const productPriceAfterCoupon = Math.max(0, state.TotalPrice - productCoveredByCoupon);
  state.discountBreakdown.priceAfterCouponBeforeDelivery = productPriceAfterCoupon;

  // 8. CALCULATE FREE DELIVERY ELIGIBILITY BASED ON PRODUCT PRICE AFTER COUPON
  // (Note: This is for display purposes only, delivery is already calculated above)
  if (productPriceAfterCoupon >= 500) {
    state.amountToGetfeeDelivery = 0;
    state.amountToGetfeeDeliveryPercentage = 100;
  } else {
    state.amountToGetfeeDelivery = Math.max(0, 500 - productPriceAfterCoupon);
    state.amountToGetfeeDeliveryPercentage = Math.min(
      (productPriceAfterCoupon / 500) * 100,
      100
    );
  }

  // 9. CALCULATE TOTAL FEES (after coupon coverage)
  const totalFees = 
    state.SmallCartFee + 
    finalDeliveryCharge + 
    state.RainFee + 
    state.HandlingFee;
  
  state.discountBreakdown.feesTotal = totalFees;

  // 10. CALCULATE SUBTOTAL (Product Total + All Fees - BEFORE coupon discount)
  // This is what the customer sees as "Subtotal"
  state.Subtotal = state.TotalPrice + totalFees;

  // 11. CALCULATE FINAL TOTAL AMOUNT (Net Payable)
  state.TotalAmount = productPriceAfterCoupon + totalFees;
  state.Netpayable = state.TotalAmount;
  
  // Set SubtotalAfterCoupon for display
  state.SubtotalAfterCoupon = state.TotalAmount;

  // 12. UPDATE TOTAL SAVINGS (without wallet)
  state.discountBreakdown.totalSavings = 
    state.discountBreakdown.productSavings + 
    state.discountBreakdown.couponSavings;

  // 13. Save coupon to localStorage if applied
  if (typeof window !== "undefined" && state.coupon.applied) {
    try {
      localStorage.setItem("cartCoupon", JSON.stringify(state.coupon));
    } catch (error) {
      console.error("Error saving coupon to localStorage:", error);
    }
  }

  // 14. Log for debugging
  console.log("Price Breakdown:", {
    productTotal: state.TotalPrice,
    deliveryBeforeCoupon: deliveryBeforeCoupon,
    couponDiscount: couponDiscount,
    deliveryCoveredByCoupon: deliveryCoveredByCoupon,
    productCoveredByCoupon: productCoveredByCoupon,
    finalDeliveryCharge: finalDeliveryCharge,
    productPriceAfterCoupon: productPriceAfterCoupon,
    totalFees: totalFees,
    subtotal: state.Subtotal,
    totalAmount: state.TotalAmount
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
        if (existingItem.cart_Quentity >= existingItem.maximumQuantity) {
          toast.error(`Maximum ${existingItem.maximumQuantity} products allowed!`);
          return;
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
      const storedCoupon = getInitialCoupon();
      if (storedCoupon) {
        state.coupon = storedCoupon;
      }
      calculateTotals(state);
    },
    
    clearCart: (state) => {
      state.CartItems = [];
      state.coupon = {
        applied: false,
        code: "",
        details: null,
        discountAmount: 0,
        discountType: "",
        maxDiscount: 0,
        minCartValue: 0,
        applicableProducts: [],
        applicableCategories: []
      };
      calculateTotals(state);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("CartItems", JSON.stringify(state.CartItems));
          localStorage.removeItem("cartCoupon");
        } catch (error) {
          console.error("Error saving cart to localStorage:", error);
        }
      }
      state.Cartloading = !state.Cartloading;
    },
    
    setAllAmountData: (state, action) => {
      state.all_amount_data = action.payload;
      if (typeof window !== "undefined") {
        try {
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
    
    // Apply validated coupon from couponSlice
    applyValidatedCoupon: (state, action) => {
      const { coupon, discountAmount, code } = action.payload;
      
      // Store old values for comparison
      const oldDeliveryCharge = state.DeliveryCharge;
      const oldSubtotal = state.Subtotal;
      
      state.coupon = {
        applied: true,
        code: code || coupon.code,
        details: coupon,
        discountAmount: discountAmount,
        discountType: coupon.discountType,
        maxDiscount: coupon.maxDiscount || 0,
        minCartValue: coupon.minCartValue || coupon.minPurchase || 0,
        applicableProducts: coupon.applicableProducts || [],
        applicableCategories: coupon.applicableCategories || []
      };
      
      // Recalculate totals with new coupon
      calculateTotals(state);
      
      // Check if delivery charge changed
      if (oldDeliveryCharge !== state.DeliveryCharge) {
        if (state.DeliveryCharge === 0) {
          toast.success("🎉 Congratulations! You've unlocked FREE delivery!");
        } else if (oldDeliveryCharge === 0 && state.DeliveryCharge > 0) {
          toast.warning(`Delivery charge ₹${state.DeliveryCharge} applied due to coupon discount`);
        }
      }
      
      toast.success(`Coupon "${code}" applied! Discount: ₹${discountAmount.toFixed(2)}`);
      
      // Debug log
      console.log("Coupon Applied Summary:", {
        subtotalBeforeCoupon: oldSubtotal,
        subtotalAfterCoupon: state.Subtotal,
        couponDiscount: discountAmount,
        deliveryBefore: oldDeliveryCharge,
        deliveryAfter: state.DeliveryCharge,
        totalAmount: state.TotalAmount
      });
    },
    
    // Clear applied coupon
    clearAppliedCoupon: (state) => {
      state.coupon = {
        applied: false,
        code: "",
        details: null,
        discountAmount: 0,
        discountType: "",
        maxDiscount: 0,
        minCartValue: 0,
        applicableProducts: [],
        applicableCategories: []
      };
      
      calculateTotals(state);
      
      if (typeof window !== "undefined") {
        localStorage.removeItem("cartCoupon");
      }
      
      toast.success("Coupon removed");
    },
    
    // Wallet functionality removed
    
    setRainStatus: (state, action) => {
      state.rainStatus = action.payload;
      calculateTotals(state);
    },
    
    // Refresh cart prices with updated data from server
    refreshCartPrices: (state, action) => {
      const updatedPrices = action.payload;

      state.CartItems = state.CartItems.map((item) => {
        const updatedItem = updatedPrices.find(
          (updated) => updated.AttributeId === item.AttributeId
        );

        if (updatedItem) {
          return {
            ...item,
            Mrp: updatedItem.Mrp,
            Price: updatedItem.Price,
            Product_total_Mrp: updatedItem.Mrp * item.cart_Quentity,
            Product_total_Price: updatedItem.Price * item.cart_Quentity,
            Product_total_Saving:
              (updatedItem.Mrp - updatedItem.Price) * item.cart_Quentity,
            availableStock: updatedItem.availableStock || item.availableStock,
            maximumQuantity: updatedItem.maximumQuantity || item.maximumQuantity,
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
    
    // Hydrate cart from storage
    hydrateCart: (state) => {
      try {
        const storedItems = getInitialCartItems();
        const storedCoupon = getInitialCoupon();
        
        state.CartItems = storedItems;
        
        if (storedCoupon) {
          state.coupon = storedCoupon;
        }
        
        state.isHydrated = true;
        calculateTotals(state);
      } catch (error) {
        console.error("Error hydrating cart:", error);
        state.CartItems = [];
        state.coupon = initialState.coupon;
        state.isHydrated = true;
      }
    },
    
    // Hydrate all data including all_amount_data
    hydrateAllData: (state) => {
      try {
        const storedItems = getInitialCartItems();
        const storedCoupon = getInitialCoupon();
        
        state.CartItems = storedItems;
        
        if (storedCoupon) {
          state.coupon = storedCoupon;
        }
        
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
        }
        
        state.isHydrated = true;
        calculateTotals(state);
      } catch (error) {
        console.error("Error hydrating cart:", error);
        state.CartItems = [];
        state.all_amount_data = "";
        state.coupon = initialState.coupon;
        state.isHydrated = true;
      }
    },
    
    // Recalculate totals
    recalculateTotals: (state) => {
      calculateTotals(state);
    }
  },
});

export const {
  addToCart,
  decrementCart,
  removeFromCart,
  getCartTotal,
  clearCart,
  setAllAmountData,
  applyValidatedCoupon,
  clearAppliedCoupon,
  setRainStatus,
  refreshCartPrices,
  hydrateCart,
  getCartData,
  hydrateAllData,
  recalculateTotals
} = cartSlice.actions;

export default cartSlice.reducer;
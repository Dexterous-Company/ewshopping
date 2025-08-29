// slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Helper function for SSR-compatible localStorage access
const getInitialCartItems = () => {
  if (typeof window !== 'undefined') {
    const items = localStorage.getItem('CartItems');
    return items ? JSON.parse(items) : [];
  }
  return [];
};

const initialState = {
  CartItems: getInitialCartItems(),
  TotalMrp: 0,
  TotalPrice: 0,
  SmallCartFee: 0,
  HandlingFee: 10,
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
  Cartloading: true,
};
const calculateTotals = (state) => {
  // Reset all calculated values
  state.TotalMrp = 0;
  state.TotalPrice = 0;
  state.TotalAmount = 0;
  state.Netpayable = 0;
  // Calculate item totals
  state.CartItems.forEach((item) => {
    state.TotalMrp += item.Product_total_Mrp;
    state.TotalPrice += item.Product_total_Price;
  });

  // Calculate fees
  state.SmallCartFee = state.TotalPrice >= 100 ? 0 : 30;
  // Delivery charge logic
  if (state.TotalPrice >= 500) {
    state.DeliveryCharge = 0;
    state.amountToGetfeeDelivery = 0;
    state.amountToGetfeeDeliveryPercentage = 100;
  } else {
    state.DeliveryCharge = 40;
    state.amountToGetfeeDelivery = 500 - state.TotalPrice;
    state.amountToGetfeeDeliveryPercentage = (state.amountToGetfeeDelivery / 500) * 100;
  }

  // Rain fee logic
  state.RainFee = state.rainStatus ? 20 : 0;

  // Calculate final totals
  state.TotalAmount = state.TotalPrice +
    state.SmallCartFee +
    state.DeliveryCharge +
    state.RainFee +
    state.HandlingFee;

  state.Netpayable = state.TotalAmount - state.wallet - state.coupon;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.CartItems.find(item => item.AttributeId === action.payload.AttributeId);
      if (existingItem) {
        // Update existing item
        existingItem.cart_Quentity += 1;
        existingItem.Product_total_Mrp = Number(existingItem.Mrp) * Number(existingItem.cart_Quentity)
        existingItem.Product_total_Price = Number(existingItem.Price * existingItem.cart_Quentity)
        existingItem.Product_total_Saving = Number(existingItem.Product_total_Mrp) - Number(existingItem.Product_total_Price)
      } else {
        // Add new item
        const newItem = {
          ...action.payload,
          cart_Quentity: 1,
          Product_total_Mrp: action.payload.Mrp,
          Product_total_Price: action.payload.Price,
          Product_total_Saving: Number(action.payload.Mrp) - Number(action.payload.Price)
        };
        state.CartItems.push(newItem);
      }
      calculateTotals(state);
      if (typeof window !== 'undefined') {
        localStorage.setItem("CartItems", JSON.stringify(state.CartItems));
      }
      state.Cartloading = !state.Cartloading;
    },
    decrementCart: (state, action) => {
      const itemIndex = state.CartItems.findIndex(
        item => item.AttributeId === action.payload.AttributeId
      );

      if (itemIndex >= 0) {
        if (state.CartItems[itemIndex].cart_Quentity > 1) {
          // Decrease quantity
          state.CartItems[itemIndex].cart_Quentity -= 1;
          state.CartItems[itemIndex].Product_total_Mrp =
            state.CartItems[itemIndex].Mrp * state.CartItems[itemIndex].cart_Quentity;
          state.CartItems[itemIndex].Product_total_Price =
            state.CartItems[itemIndex].Price * state.CartItems[itemIndex].cart_Quentity;
          state.CartItems[itemIndex].Product_total_Saving =
            state.CartItems[itemIndex].Product_total_Mrp - state.CartItems[itemIndex].Product_total_Price;
        } else {
          // Remove item if quantity would be 0
          state.CartItems = state.CartItems.filter(
            item => item.AttributeId !== action.payload.AttributeId
          );
        }

        calculateTotals(state);
        if (typeof window !== 'undefined') {
          localStorage.setItem("CartItems", JSON.stringify(state.CartItems));
        }
        state.Cartloading = !state.Cartloading;
      }
    },
    removeFromCart: (state, action) => {
      state.CartItems = state.CartItems.filter(
        item => item.AttributeId !== action.payload.AttributeId
      );
      calculateTotals(state);
      if (typeof window !== 'undefined') {
        localStorage.setItem("CartItems", JSON.stringify(state.CartItems));
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
      calculateTotals(state);
      if (typeof window !== 'undefined') {
        localStorage.setItem("CartItems", JSON.stringify(state.CartItems));
      }
      state.Cartloading = !state.Cartloading;
    },

    setAllAmountData: (state, action) => {
      state.all_amount_data = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem("all_amount_data", JSON.stringify(state.all_amount_data));
      }
    },

    applyCoupon: (state, action) => {
      state.coupon = action.payload;
      calculateTotals(state);
    },

    useWallet: (state, action) => {
      state.wallet = action.payload;
      calculateTotals(state);
    },
    setRainStatus: (state, action) => {
      state.rainStatus = action.payload;
      calculateTotals(state);
    },
    // Hydrate cart from storage (for SSR/SSG)
    hydrateCart: (state, action) => {
      state.CartItems = action.payload;
      calculateTotals(state);
    }
  }
});

export const {
  addToCart,
  decrementCart,
  removeFromCart,
  getCartTotal,
  clearCart,
  setAllAmountData,
  applyCoupon,
  useWallet,
  setRainStatus,
  hydrateCart,
  getCartData,
} = cartSlice.actions;

export default cartSlice.reducer;
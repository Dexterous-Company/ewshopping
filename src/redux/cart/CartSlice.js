// slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// Helper function for SSR-compatible localStorage access
const getInitialCartItems = () => {
  if (typeof window !== "undefined") {
    try {
      const items = localStorage.getItem("CartItems");
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  }
  return [];
};

const initialState = {
  CartItems: [],
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
  Cartloading: false,
  isHydrated: false, // Add hydration flag
};

const calculateTotals = (state) => {
  // Reset all calculated values
  state.TotalMrp = 0;
  state.TotalPrice = 0;
  state.TotalAmount = 0;
  state.Netpayable = 0;

  // Calculate item totals
  if (state.CartItems && state.CartItems.length > 0) {
    state.CartItems.forEach((item) => {
      state.TotalMrp += item.Product_total_Mrp || 0;
      state.TotalPrice += item.Product_total_Price || 0;
    });
  }

  // Calculate fees
  state.SmallCartFee = state.TotalPrice >= 100 ? 0 : 30;

  // Delivery charge logic
  if (state.TotalPrice >= 500) {
    state.DeliveryCharge = 0;
    state.amountToGetfeeDelivery = 0;
    state.amountToGetfeeDeliveryPercentage = 100;
  } else {
    state.DeliveryCharge = 40;
    state.amountToGetfeeDelivery = Math.max(0, 500 - state.TotalPrice);
    state.amountToGetfeeDeliveryPercentage = Math.min(
      (state.TotalPrice / 500) * 100,
      100
    );
  }

  // Rain fee logic
  state.RainFee = state.rainStatus ? 20 : 0;

  // Calculate final totals
  state.TotalAmount =
    state.TotalPrice +
    state.SmallCartFee +
    state.DeliveryCharge +
    state.RainFee +
    state.HandlingFee;

  state.Netpayable = Math.max(
    0,
    state.TotalAmount - state.wallet - state.coupon
  );
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
        localStorage.setItem("CartItems", JSON.stringify(state.CartItems));
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
          localStorage.setItem("CartItems", JSON.stringify(state.CartItems));
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
      if (typeof window !== "undefined") {
        localStorage.setItem("CartItems", JSON.stringify(state.CartItems));
      }
      state.Cartloading = !state.Cartloading;
    },
    setAllAmountData: (state, action) => {
      state.all_amount_data = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "all_amount_data",
          JSON.stringify(state.all_amount_data)
        );
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
    // NEW ACTION: Refresh cart prices with updated data from server
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
        localStorage.setItem("CartItems", JSON.stringify(state.CartItems));
      }
    },
    // Hydrate cart from storage (for SSR/SSG)
    hydrateCart: (state) => {
      try {
        const storedItems = getInitialCartItems();
        state.CartItems = storedItems;
        state.isHydrated = true;
        calculateTotals(state);
        console.log("Cart hydrated with items:", storedItems.length);
      } catch (error) {
        console.error("Error hydrating cart:", error);
        state.CartItems = [];
        state.isHydrated = true;
      }
    },
  },
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
  refreshCartPrices, // Export the new action
  hydrateCart,
  getCartData,
} = cartSlice.actions;

export default cartSlice.reducer;

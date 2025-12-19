import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// Helper function to safely access localStorage
const getLocalStorageItem = (key) => {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(key);
    try {
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }
  return null;
};

const initialState = {
  // Client orders with pagination support
  clientOrder: {
    order: [], // Orders array
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasMore: true,
    filters: {
      status: [],
      timePeriod: []
    }
  },
  
  // Total orders (unfiltered, unpaginated - for stats)
  totalClientOrder: getLocalStorageItem("totalClientOrder") || [],
  
  // Current single order being viewed
  currentOrder: getLocalStorageItem("currentOrder") || [],
  
  // Payment update status
  paymentUpdateOrder: getLocalStorageItem("paymentUpdateOrder") || "",
  
  // Loading states
  ordersLoading: true,
  isordersLoading: true,
  
  // Error state
  error: null
};

// Send SMS for new order
export const newOrderSMS = createAsyncThunk(
  "order/newOrderSMS",
  async (formData, thunkAPI) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/order/sendsms`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send order SMS"
      );
    }
  }
);

// Create new order
export const newOrder = createAsyncThunk(
  "order/newOrder",
  async (formData, thunkAPI) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/order/new`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);

// Get orders by client ID with pagination and filters
export const getOrderbyClId = createAsyncThunk(
  "order/getOrderbyClId",
  async ({ clientid, filters = {} }, thunkAPI) => {
    try {
      const { page = 1, limit = 10, status, timePeriod } = filters;

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      if (status && status.length > 0) {
        params.append("status", status.join(","));
      }

      if (timePeriod && timePeriod.length > 0) {
        params.append("timePeriod", timePeriod.join(","));
      }

      const url = `${Baseurl}/api/v1/order/tenOrderbyclient/${clientid}?${params.toString()}`;
      const resp = await axios.get(url);
      
      return {
        data: resp.data,
        page: parseInt(page),
        filters: { status: status || [], timePeriod: timePeriod || [] },
        isNewPage: page > 1 // Flag for appending vs replacing
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// Get all orders by client ID (unfiltered, for total count)
export const getTotalOrderByClId = createAsyncThunk(
  "order/totalOrder",
  async (clientid, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/order/orderbyclientid/${clientid}`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch total orders"
      );
    }
  }
);

// Generate new token for order
export const gerenatenewTokrnId = createAsyncThunk(
  "order/gerenatenewTokrnId",
  async (orderId = 0, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/order/generatenewtoken/${orderId}`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to generate new token"
      );
    }
  }
);

// Update existing order
export const updateOrder = createAsyncThunk(
  "Order/updateOrder",
  async (formData, thunkAPI) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/order/${formData.orderid}`;
      const resp = await axios.put(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update order"
      );
    }
  }
);

// Get single order by ID
export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (orderId, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/order/${orderId}`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch order"
      );
    }
  }
);

const OrderSlice = createSlice({
  name: "Order",
  initialState,
  reducers: {
    // Clear all order data
    clearOrder(state) {
      state.clientOrder = initialState.clientOrder;
      state.totalClientOrder = initialState.totalClientOrder;
      state.currentOrder = initialState.currentOrder;
      state.paymentUpdateOrder = initialState.paymentUpdateOrder;
      
      if (typeof window !== "undefined") {
        localStorage.setItem("clientOrder", JSON.stringify(state.clientOrder));
        localStorage.setItem("totalClientOrder", JSON.stringify(state.totalClientOrder));
        localStorage.setItem("currentOrder", JSON.stringify(state.currentOrder));
        localStorage.setItem("paymentUpdateOrder", JSON.stringify(state.paymentUpdateOrder));
      }
    },
    
    // Reset only paginated client orders
    resetClientOrder(state) {
      state.clientOrder = initialState.clientOrder;
      if (typeof window !== "undefined") {
        localStorage.setItem("clientOrder", JSON.stringify(state.clientOrder));
      }
    },
    
    // Set payment update order
    setpaymentUpdateOrder(state, action) {
      state.paymentUpdateOrder = action.payload.order;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "paymentUpdateOrder",
          JSON.stringify(state.paymentUpdateOrder)
        );
      }
    },
    
    // Clear payment update order
    setpaymentUpdateOrderClear(state) {
      state.paymentUpdateOrder = "";
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "paymentUpdateOrder",
          JSON.stringify(state.paymentUpdateOrder)
        );
      }
    },
    
    // Set current single order
    setcurrentOrder(state, action) {
      state.currentOrder = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "currentOrder",
          JSON.stringify(state.currentOrder)
        );
      }
    },
    
    // Clear error
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // newOrder
      .addCase(newOrder.pending, (state) => {
        state.ordersLoading = true;
        state.error = null;
      })
      .addCase(newOrder.fulfilled, (state, action) => {
        if (action.payload?.success) {
          // Add new order to the beginning of the list
          state.clientOrder.order = [
            action.payload.order,
            ...state.clientOrder.order,
          ];
          state.clientOrder.totalOrders += 1;
          
          // Also update totalClientOrder if needed
          if (Array.isArray(state.totalClientOrder)) {
            state.totalClientOrder = [
              action.payload.order,
              ...state.totalClientOrder,
            ];
          }
        }
        
        if (typeof window !== "undefined") {
          localStorage.setItem("clientOrder", JSON.stringify(state.clientOrder));
          localStorage.setItem("totalClientOrder", JSON.stringify(state.totalClientOrder));
        }
        
        state.ordersLoading = false;
      })
      .addCase(newOrder.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload;
      })
      
      // getOrderbyClId
      .addCase(getOrderbyClId.pending, (state) => {
        state.isordersLoading = true;
        state.error = null;
      })
      .addCase(getOrderbyClId.fulfilled, (state, action) => {
        const { data, page, filters, isNewPage } = action.payload;
        
        if (isNewPage) {
          // Append new orders for pagination
          state.clientOrder.order = [
            ...state.clientOrder.order,
            ...(data.order || [])
          ];
        } else {
          // First page, replace orders
          state.clientOrder.order = data.order || [];
        }
        
        // Update pagination metadata
        state.clientOrder.currentPage = page;
        state.clientOrder.totalPages = data.totalPages || 1;
        state.clientOrder.totalOrders = data.totalOrders || 0;
        state.clientOrder.hasMore = page < (data.totalPages || 1);
        state.clientOrder.filters = filters;
        
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("clientOrder", JSON.stringify(state.clientOrder));
        }
        
        state.isordersLoading = false;
      })
      .addCase(getOrderbyClId.rejected, (state, action) => {
        state.isordersLoading = false;
        state.error = action.payload;
      })
      
      // getTotalOrderByClId
      .addCase(getTotalOrderByClId.pending, (state) => {
        state.isordersLoading = true;
        state.error = null;
      })
      .addCase(getTotalOrderByClId.fulfilled, (state, action) => {
        state.totalClientOrder = action.payload?.order || [];
        
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "totalClientOrder",
            JSON.stringify(state.totalClientOrder)
          );
        }
        
        state.isordersLoading = false;
      })
      .addCase(getTotalOrderByClId.rejected, (state, action) => {
        state.isordersLoading = false;
        state.error = action.payload;
      })
      
      // gerenatenewTokrnId
      .addCase(gerenatenewTokrnId.pending, (state) => {
        state.isordersLoading = true;
        state.error = null;
      })
      .addCase(gerenatenewTokrnId.fulfilled, (state, action) => {
        // Handle token generation success if needed
        state.isordersLoading = false;
      })
      .addCase(gerenatenewTokrnId.rejected, (state, action) => {
        state.isordersLoading = false;
        state.error = action.payload;
      })
      
      // updateOrder
      .addCase(updateOrder.pending, (state) => {
        state.ordersLoading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        if (action.payload?.success) {
          const updatedOrder = action.payload.order;
          
          // Update in clientOrder array
          const orderIndex = state.clientOrder.order.findIndex(
            order => order._id === updatedOrder._id
          );
          if (orderIndex !== -1) {
            state.clientOrder.order[orderIndex] = updatedOrder;
          }
          
          // Update in totalClientOrder array
          if (Array.isArray(state.totalClientOrder)) {
            const totalIndex = state.totalClientOrder.findIndex(
              order => order._id === updatedOrder._id
            );
            if (totalIndex !== -1) {
              state.totalClientOrder[totalIndex] = updatedOrder;
            }
          }
          
          // Update currentOrder if it's the one being viewed
          if (state.currentOrder?._id === updatedOrder._id) {
            state.currentOrder = updatedOrder;
          }
          
          // Save to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("clientOrder", JSON.stringify(state.clientOrder));
            localStorage.setItem("totalClientOrder", JSON.stringify(state.totalClientOrder));
            localStorage.setItem("currentOrder", JSON.stringify(state.currentOrder));
          }
        }
        
        state.ordersLoading = false;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload;
      })
      
      // getOrderById
      .addCase(getOrderById.pending, (state) => {
        state.isordersLoading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload?.order || null;
        
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "currentOrder",
            JSON.stringify(state.currentOrder)
          );
        }
        
        state.isordersLoading = false;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isordersLoading = false;
        state.error = action.payload;
      })
      
      // newOrderSMS
      .addCase(newOrderSMS.pending, (state) => {
        state.ordersLoading = true;
        state.error = null;
      })
      .addCase(newOrderSMS.fulfilled, (state) => {
        state.ordersLoading = false;
      })
      .addCase(newOrderSMS.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearOrder,
  resetClientOrder,
  setpaymentUpdateOrder,
  setpaymentUpdateOrderClear,
  setcurrentOrder,
  clearError
} = OrderSlice.actions;

export default OrderSlice.reducer;
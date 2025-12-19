import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// Helper function to safely access localStorage
const getLocalStorageItem = (key) => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
};

const initialState = {
  totalClientOrder: getLocalStorageItem("totalClientOrder") || [],
  clientOrder: getLocalStorageItem("clientOrder") || [],
  currentOrder: getLocalStorageItem("currentOrder") || [],
  paymentUpdateOrder: getLocalStorageItem("paymentUpdateOrder") || "",
  ordersLoading: true,
  isordersLoading: true,
};

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

export const getOrderbyClId = createAsyncThunk(
  "order/getOrderbyClId",
  async (clientid, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/order/tenOrderbyclient/${clientid}`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

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

const OrderSlice = createSlice({
  name: "Order",
  initialState,
  reducers: {
    clearOrder(state) {
      state.clientOrder = [];
      state.currentOrder = "";
      if (typeof window !== 'undefined') {
        localStorage.setItem("clientOrder", JSON.stringify(state.clientOrder));
        localStorage.setItem("currentOrder", JSON.stringify(state.currentOrder));
      }
    },
    setpaymentUpdateOrder(state, action) {
      state.paymentUpdateOrder = action.payload.order;
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          "paymentUpdateOrder",
          JSON.stringify(state.paymentUpdateOrder)
        );
      }
    },
    setpaymentUpdateOrderClear(state) {
      state.paymentUpdateOrder = "";
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          "paymentUpdateOrder",
          JSON.stringify(state.paymentUpdateOrder)
        );
      }
    },
    setcurrentOrder(state, action) {
      state.currentOrder = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem("currentOrder", JSON.stringify(state.currentOrder));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newOrder.pending, (state) => {
        state.ordersLoading = true;
      })
      .addCase(newOrder.fulfilled, (state, action) => {
        if (action.payload?.success) {
          state.clientOrder = [action.payload.order, ...state.clientOrder];
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem("clientOrder", JSON.stringify(state.clientOrder));
        }
        state.ordersLoading = false;
      })
      .addCase(newOrder.rejected, (state) => {
        state.ordersLoading = false;
      })
      .addCase(getOrderbyClId.pending, (state) => {
        state.isordersLoading = true;
      })
      .addCase(getOrderbyClId.fulfilled, (state, action) => {
        state.clientOrder = action.payload?.order || [];
        if (typeof window !== 'undefined') {
          localStorage.setItem("clientOrder", JSON.stringify(state.clientOrder));
        }
        state.isordersLoading = false;
      })
      .addCase(getOrderbyClId.rejected, (state) => {
        state.isordersLoading = false;
      })
      .addCase(getTotalOrderByClId.pending, (state) => {
        state.isordersLoading = true;
      })
      .addCase(getTotalOrderByClId.fulfilled, (state, action) => {
        state.totalClientOrder = action.payload?.order || [];
        if (typeof window !== 'undefined') {
          localStorage.setItem("clientOrder", JSON.stringify(state.clientOrder));
        }
        state.isordersLoading = false;
      })
      .addCase(getTotalOrderByClId.rejected, (state) => {
        state.isordersLoading = false;
      });
  },
});

export const {
  clearOrder,
  setpaymentUpdateOrder,
  setpaymentUpdateOrderClear,
  setcurrentOrder,
} = OrderSlice.actions;

export default OrderSlice.reducer;
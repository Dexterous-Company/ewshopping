// lib/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  mob: "",
  otp: "",
  isAuth:
    typeof window !== "undefined" &&
    JSON.parse(localStorage.getItem("loginData"))
      ? JSON.parse(localStorage.getItem("loginData")).isAuth
      : false,
  loginData:
    typeof window !== "undefined" && localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : "",
  current_address:
    typeof window !== "undefined" && localStorage.getItem("current_address")
      ? JSON.parse(localStorage.getItem("current_address"))
      : "",
  user_address:
    typeof window !== "undefined" && localStorage.getItem("user_address")
      ? JSON.parse(localStorage.getItem("user_address"))
      : [],
  checkout_authentication_status: 0,
  checkout_process_steps: 0,
  userLoading: true,
  addressLoading: true,
};

export const getUserByMob = createAsyncThunk(
  "Athentication/getUserByMob",
  async (formData, thunkAPI) => {
    let resp = {
      success: false,
      message: "user not found",
    };
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/client/loginclient`;
      resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const userRegistation = createAsyncThunk(
  "Athentication/userRegistation",
  async (formData, thunkAPI) => {
    try {
      const config = {
        maxBodyLength: Infinity,
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/client/new`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("client Not create");
    }
  }
);
export const send_sms_through_backend = createAsyncThunk(
  "Athentication/send_sms_through_backend",
  async (formData, thunkAPI) => {
    try {
      const config = {
        maxBodyLength: Infinity,
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/client/sendsms`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("client Not create");
    }
  }
);
export const order_success_sms_through_backend = createAsyncThunk(
  "Athentication/send_sms_through_backend",
  async (formData, thunkAPI) => {
    try {
      const config = {
        maxBodyLength: Infinity,
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/client/order-sendsms`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("client Not create");
    }
  }
);

export const verifyUserEmail = createAsyncThunk(
  "Athentication/verifyUserEmail",
  async (email, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/client/email/${email}`;
      const resp = await axios(url);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("404 Not Found");
    }
  }
);

export const add_Address = createAsyncThunk(
  "Athentication/add_Address",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/client/address`;
      const resp = await axios.put(url, formData, config);

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("client Not create");
    }
  }
);

export const updateAddress = createAsyncThunk(
  "Athentication/updateAddress",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/client/updateclientsingleaddress`;
      const resp = await axios.put(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("client Not create");
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "Athentication/deleteAddress",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/client/deleteclientsingleaddress/${formData.addressId}/${formData.ClientId}`;
      const resp = await axios.delete(url, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("client Not create");
    }
  }
);
export const updateProfile = createAsyncThunk(
  "Athentication/updateProfile",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/client/updateprofile`;
      const resp = await axios.put(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("client Not create");
    }
  }
);
const AthenticationSlice = createSlice({
  name: "Athentication",
  initialState,
  reducers: {
    LoginOtp(state, action) {
      state.mob = action.payload.number;
      state.otp = action.payload.OTP;
      console.log(action.payload.OTP ,"action.payload.OTPs");
      
    },
    setCheckoutAuthenticationStatus(state, action) {
      state.checkout_authentication_status = action.payload;
    },
    set_checkout_authentication_status(state, action) {
      state.checkout_process_steps = action.payload;
    },
    setMobileNumber(state, action) {
      state.mob = action.payload;
    },
    setCheckoutStep(state, action) {
      state.checkout_step = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("checkout_step", action.payload);
      }
    },
    signin(state, action) {
      state.isAuth = action.payload.isAuth;
      state.loginData = action.payload;
      state.user_address = action.payload.Addresses;

      if (state.user_address.length >= 1 && state.current_address === "") {
        state.current_address = state.user_address[0];
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("loginData", JSON.stringify(state.loginData));
        localStorage.setItem(
          "user_address",
          JSON.stringify(state.user_address)
        );
        localStorage.setItem(
          "current_address",
          JSON.stringify(state.current_address)
        );
      }
    },
    signout(state) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("loginData");
        localStorage.removeItem("user_address");
        localStorage.removeItem("current_address");
      }
      state.loginData.isAuth = false;
      state.loginData = "";
      state.isAuth = false;
      state.current_address = "";
      state.mob = "";
      state.user_address = [];
    },
    setCurrentAddress(state, action) {
      state.current_address = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "current_address",
          JSON.stringify(state.current_address)
        );
      }
    },
    updateAddressLocally(state, action) {
      state.user_address = action.payload;
      state.current_address = state.user_address[0];
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "user_address",
          JSON.stringify(state.user_address)
        );
        localStorage.setItem(
          "current_address",
          JSON.stringify(state.current_address)
        );
      }
    },
    removeAddress(state, action) {
      state.user_address = state.user_address.filter(
        (indAddress) => indAddress._id !== action.payload._id
      );
      state.current_address = state.user_address[0] || "";
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "user_address",
          JSON.stringify(state.user_address)
        );
        localStorage.setItem(
          "current_address",
          JSON.stringify(state.current_address)
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (action.payload?.success) {
          state.loginData = action.payload.client;
          if (typeof window !== "undefined") {
            localStorage.setItem("loginData", JSON.stringify(state.loginData));
          }
        }
        state.userLoading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload;
      });
    builder
      .addCase(add_Address.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(add_Address.fulfilled, (state, action) => {
        if (action.payload?.success) {
          state.loginData = action.payload.client;
          state.user_address = action.payload.client.Addresses;
          if (typeof window !== "undefined") {
            localStorage.setItem("loginData", JSON.stringify(state.loginData));
            localStorage.setItem(
              "user_address",
              JSON.stringify(state.loginData.Addresses)
            );
          }
        }
        state.userLoading = false;
      })
      .addCase(add_Address.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  LoginOtp,
  signin,
  signout,
  setCurrentAddress,
  setMobileNumber,
  updateAddressLocally,
  removeAddress,
  setCheckoutAuthenticationStatus,
  set_checkout_authentication_status,
  setCheckoutStep,
} = AthenticationSlice.actions;

export default AthenticationSlice.reducer;

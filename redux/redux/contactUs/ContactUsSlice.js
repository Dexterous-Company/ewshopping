import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  contactList: [],
  contactLoading: false,
  isContactAvailable: false,
  success: false,
  error: null,
};

export const contactPost = createAsyncThunk(
  "contacts/contactPost", // Changed from "Contact/contactPost" to match reducer path
  async (formData, thunkAPI) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/contactus/createContact`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      // Handle different error types
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue({
        message: "Network error. Please try again.",
      });
    }
  }
);

const contactSlice = createSlice({
  name: "contacts", // Make sure this matches your store configuration
  initialState,
  reducers: {
    clearContactState: (state) => {
      state.error = null;
      state.success = false;
      state.isContactAvailable = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // POST Contact
      .addCase(contactPost.pending, (state) => {
        state.contactLoading = true;
        state.error = null;
        state.success = false;
        state.isContactAvailable = false;
      })
      .addCase(contactPost.fulfilled, (state, action) => {
        state.contactLoading = false;
        state.success = true;
        state.isContactAvailable = true;

        if (action.payload.success && action.payload.data) {
          state.contactList = [...state.contactList, action.payload.data];
        }
      })
      .addCase(contactPost.rejected, (state, action) => {
        state.contactLoading = false;
        state.isContactAvailable = false;
        state.success = false;
        state.error = action.payload || "Failed to submit contact form";
      });
  },
});

export const { clearContactState } = contactSlice.actions;
export default contactSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  CategoryPromotionOne: [],
  CategoryPromotionTwo: [],
  CategoryPromotionThree: [],
  status: "idle",
  error: null,
};

export const getCategoryPromotionOne = createAsyncThunk(
  "categoryTag/getCategoryPromotionOne",
  async (position, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/categorytag/getCategoryPromotion/1`;
      const resp = await axios(url);
      return resp.data.ctegoryTags;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getCategoryPromotionTwo = createAsyncThunk(
  "categoryTag/getCategoryPromotionTwo",
  async (position, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/categorytag/getCategoryPromotion/2`;
      const resp = await axios(url);      
      return resp.data.ctegoryTags;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getCategoryPromotionThree = createAsyncThunk(
  "categoryTag/getCategoryPromotionThree",
  async (position, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/categorytag/getCategoryPromotion/3`;
      const resp = await axios(url);
      return resp.data.ctegoryTags;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const categoryTagSlice = createSlice({
  name: "categoryTag",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategoryPromotionOne.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCategoryPromotionOne.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.CategoryPromotionOne = action.payload;
      })
      .addCase(getCategoryPromotionOne.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
    builder
      .addCase(getCategoryPromotionTwo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCategoryPromotionTwo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.CategoryPromotionTwo = action.payload;
      })
      .addCase(getCategoryPromotionTwo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
    builder
      .addCase(getCategoryPromotionThree.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCategoryPromotionThree.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.CategoryPromotionThree = action.payload;
      })
      .addCase(getCategoryPromotionThree.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});

export const {  } = categoryTagSlice.actions;
export default categoryTagSlice.reducer;

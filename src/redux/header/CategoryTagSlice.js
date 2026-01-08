import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  scoData: null,
  CategoryPromotionOne: [],
  CategoryPromotionTwo: [],
  CategoryPromotionThree: [],
  status: "idle",
  error: null,
};

export const getCategoryPromotionOne = createAsyncThunk(
  "categoryTag/getCategoryPromotionOne",
  async (_, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/categorytag/getCategoryPromotion/1`;
      const resp = await axios(url);
      return resp.data.categoryTags;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getCategoryPromotionTwo = createAsyncThunk(
  "categoryTag/getCategoryPromotionTwo",
  async (_, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/categorytag/getCategoryPromotion/2`;
      const resp = await axios(url);
      return resp.data.categoryTags;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getCategoryPromotionThree = createAsyncThunk(
  "categoryTag/getCategoryPromotionThree",
  async (_, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/categorytag/getCategoryPromotion/3`;
      const resp = await axios(url);
      return resp.data.categoryTags;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getCategoryTagBySlugUrl = createAsyncThunk(
  "categoryTag/getCategoryTagBySlugUrl",
  async ({ slugUrl }, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/categorytag/getCategoryTag/${slugUrl}`;
      const resp = await axios(url);
      console.log("resp", resp);
      return resp.data.categoryTag;
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
      })
      .addCase(getCategoryPromotionTwo.fulfilled, (state, action) => {
        state.CategoryPromotionTwo = action.payload;
      })
      .addCase(getCategoryPromotionThree.fulfilled, (state, action) => {
        state.CategoryPromotionThree = action.payload;
      })
      .addCase(getCategoryTagBySlugUrl.fulfilled, (state, action) => {
        state.scoData = action.payload;
      });
  },
});

export default categoryTagSlice.reducer;

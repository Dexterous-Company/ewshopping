// features/reviews/reviewSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// Async thunk to fetch reviews
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (productId, { rejectWithValue }) => {
    try {      
      const response = await axios.get(
        `${Baseurl}/api/v1/review/${productId}/reviews`
      );   
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
// Async thunk to add a review
export const addReview = createAsyncThunk(
  "reviews/addReview",
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Baseurl}/api/v1/review/${productId}/reviews`,
        reviewData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchUserReviews = createAsyncThunk(
  "reviews/fetchUserReviews",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${Baseurl}/api/v1/review/users/${userId}/reviews`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getSingleReview = createAsyncThunk(
  "reviews/getSingleReview",
  async ({userID, reviewId }, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${Baseurl}/api/v1/review/${userID}/${reviewId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const putSingleReview = createAsyncThunk(
  "reviews/putSingleReview",
  async (fomData, { rejectWithValue, getState }) => {
    try {
      const url = `${Baseurl}/api/v1/review/${fomData._id}`;
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }
      const response = await axios.put(url, fomData, config);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (fomData, { rejectWithValue, getState }) => {
    try {
      const url = `${Baseurl}/api/v1/review/${fomData}`;
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }
      const response = await axios.delete(url, fomData, config);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);



const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    userRetingAll: [],
    singleReviews: {},
    stats: [],
    rating: 0,
    totalRatings: 0,
    ratingBreakdown: [],
    customerReviews: [],
    status: "idle",
    userStatus: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rating = action.payload.rating;
        state.totalRatings = action.payload.totalRatings;
        state.ratingBreakdown = action.payload.ratingBreakdown;
        state.customerReviews = action.payload.customerReviews;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
    builder
      .addCase(addReview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customerReviews.push(action.payload.review);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
    builder
      // Fetch user reviews
      .addCase(fetchUserReviews.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.userStatus = "succeeded";
        state.stats = action.payload.stats;
        state.userRetingAll = action.payload.reviews;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.userStatus = "failed";
        state.error = action.payload;
      });
    builder
      .addCase(getSingleReview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSingleReview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.singleReviews = action.payload;
      })
      .addCase(getSingleReview.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export default reviewSlice.reducer;

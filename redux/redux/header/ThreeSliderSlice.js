import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  sliders: [],
  status: "idle", 
  error: null,
};

export const fetchThreeSliders = createAsyncThunk(
  "threeSlider/fetchThreeSliders",
  async (_, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/threeslider/all`;
      const response = await axios.get(url);  
      return response.data.threeSliders;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const threeSliderSlice = createSlice({
  name: "threeSlider",
  initialState,
  reducers: {
    // You can add reducers here if needed
    resetSliders: (state) => {
      state.sliders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreeSliders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchThreeSliders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sliders = action.payload;
      })
      .addCase(fetchThreeSliders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetSliders } = threeSliderSlice.actions;
export default threeSliderSlice.reducer;
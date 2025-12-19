import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
    subCategoryPromotions: [],
    status: "idle",
    error: null,
};

export const getSubCategoryPromotions = createAsyncThunk(
    "subCategoryPromotion/getSubCategoryPromotions",
    async (_, thunkAPI) => {
        try {
            const url = `${Baseurl}/api/v1/subcategoryPromotion/limit`;
            const resp = await axios.get(url);
            return resp.data.subCategoryPromotions;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const subCategoryPromotionSlice = createSlice({
    name: "subCategoryPromotion",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSubCategoryPromotions.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getSubCategoryPromotions.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.subCategoryPromotions = action.payload;
            })
            .addCase(getSubCategoryPromotions.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default subCategoryPromotionSlice.reducer;

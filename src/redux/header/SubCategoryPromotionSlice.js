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
// export const getSubCategoryPromotions = createAsyncThunk(
//     "subCategoryPromotion/getSubCategoryPromotions",
//     async (_, thunkAPI) => {
//         try {
//             const url = `${Baseurl}/api/v1/subcategoryPromotion/limit`;
//             const resp = await axios.get(url);
//             // Assuming the API returns an array of promotions
//             // const transformedData = resp.data.map(promotion => ({
//             //     title: {
//             //         name: promotion.category,
//             //         offer: promotion.offerText || "Special Offer", // Add offerText to your model if needed
//             //         buttonText: promotion.button_text || "See all offers"
//             //     },
//             //     category: promotion.selectedSubCategories.map(subCat => ({
//             //         id: subCat._id.$oid,
//             //         name: subCat.name,
//             //         image: isMobile ? subCat.mobileImage : subCat.desktopImage,
//             //         slugUrl: subCat.slugUrl
//             //     }))
//             // }));

//             return resp.data;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error.message);
//         }
//     }
// );
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

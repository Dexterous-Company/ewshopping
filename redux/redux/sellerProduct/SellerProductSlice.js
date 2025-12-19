// shopProductsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;
export const fetchShopProducts = createAsyncThunk(
    "shopProducts/fetchShopProducts",
    async ({ shopName, page = 1, limit = 50, append = false }, { rejectWithValue }) => {
        try {
            // Ensure shopName is always a string and properly encoded
            const shopNameStr = String(shopName);
            const encodedShopName = encodeURIComponent(shopNameStr);

            const response = await axios.get(
                `${Baseurl}/api/v1/approve_card/shop/${encodedShopName}?page=${page}&limit=${limit}`
            );
            return { ...response.data, append, page };
        } catch (error) {
            // Handle 404 errors specifically
            if (error.response?.status === 404) {
                return rejectWithValue("Shop not found");
            }
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

const shopProductsSlice = createSlice({
    name: "shopProducts",
    initialState: {
        products: [],
        shopDetails: null,
        loading: false,
        error: null,
        page: 1,
        totalProducts: 0,
        hasMore: true,
    },
    reducers: {
        clearProducts: (state) => {
            state.products = [];
            state.page = 1;
            state.hasMore = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShopProducts.pending, (state, action) => {
                state.loading = true;
                // Only reset products if it's the first page
                if (action.meta.arg.page === 1) {
                    state.products = [];
                    state.page = 1;
                    state.hasMore = true;
                }
            })
            .addCase(fetchShopProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                // Update shop details only on first page load
                if (action.meta.arg.page === 1) {
                    state.shopDetails = action.payload.shopDetails;
                }

                // Append new products or replace if it's the first page
                if (action.meta.arg.append) {
                    state.products = [...state.products, ...action.payload.products];
                } else {
                    state.products = action.payload.products;
                }

                state.page = action.meta.arg.page;
                state.totalProducts = action.payload.totalProducts;

                // Check if we have more products to load
                if (state.products.length >= action.payload.totalProducts) {
                    state.hasMore = false;
                }
            })
            .addCase(fetchShopProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProducts } = shopProductsSlice.actions;
export default shopProductsSlice.reducer;
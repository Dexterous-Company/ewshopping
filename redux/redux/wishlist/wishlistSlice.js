

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const getStoredWishlist = () => {
    if (typeof window !== "undefined") {
        return JSON.parse(localStorage.getItem("wishlist")) || [];
    }
    return [];
};

export const fetchUserWishlist = createAsyncThunk(
    "wishlist/fetchUserWishlist",
    async (userId, thunkAPI) => {
        try {
            const url = `${Baseurl}/api/v1/Whislist/user/${userId}`;
            const resp = await axios.get(url);
            return resp.data.Whislists;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch wishlist"
            );
        }
    }
);

export const addToWishlistServer = createAsyncThunk(
    "wishlist/addToServer",
    async (wishlistItem, thunkAPI) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
            };
            const url = `${Baseurl}/api/v1/Whislist/new`;
            const resp = await axios.post(url, wishlistItem, config);
            return resp.data.whislist;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to add to wishlist"
            );
        }
    }
);

export const removeFromWishlistServer = createAsyncThunk(
    "wishlist/removeFromServer",
    async ({ userId, ProductId, AttributeId }, thunkAPI) => {
        try {
            const url = `${Baseurl}/api/v1/Whislist`;
            const resp = await axios.delete(url, {
                data: { userId, ProductId, AttributeId }
            });
            return { ProductId, AttributeId };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to remove from wishlist"
            );
        }
    }
);

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        items: getStoredWishlist(),
        isLoading: false,
        error: null,
    },
    reducers: {
        addToWishlistLocal: (state, action) => {
            const existingItem = state.items.find(
                item => item.ProductId === action.payload.ProductId &&
                    item.AttributeId === action.payload.AttributeId
            );

            if (!existingItem) {
                state.items.push(action.payload);
                localStorage.setItem("wishlist", JSON.stringify(state.items));
            }
        },
        removeFromWishlistLocal: (state, action) => {
            state.items = state.items.filter(
                item => !(item.ProductId === action.payload.ProductId &&
                    item.AttributeId === action.payload.AttributeId)
            );
            localStorage.setItem("wishlist", JSON.stringify(state.items));
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch user wishlist
            .addCase(fetchUserWishlist.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
                localStorage.setItem("wishlist", JSON.stringify(action.payload));
            })
            .addCase(fetchUserWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Add to wishlist
            .addCase(addToWishlistServer.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToWishlistServer.fulfilled, (state, action) => {
                state.isLoading = false;
                const existingItem = state.items.find(
                    item => item.ProductId === action.payload.ProductId &&
                        item.AttributeId === action.payload.AttributeId
                );
                if (!existingItem) {
                    state.items.push(action.payload);
                    localStorage.setItem("wishlist", JSON.stringify(state.items));
                }
            })
            .addCase(addToWishlistServer.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Remove from wishlist
            .addCase(removeFromWishlistServer.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeFromWishlistServer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = state.items.filter(
                    item => !(item.ProductId === action.payload.ProductId &&
                        item.AttributeId === action.payload.AttributeId)
                );
                localStorage.setItem("wishlist", JSON.stringify(state.items));
            })
            .addCase(removeFromWishlistServer.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { addToWishlistLocal, removeFromWishlistLocal } = wishlistSlice.actions;
export default wishlistSlice.reducer;
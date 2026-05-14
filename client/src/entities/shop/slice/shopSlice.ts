import { createSlice } from "@reduxjs/toolkit";
import { initialShopState, ShopStateType } from "../model";
import {
  getAllShopsThunk,
  getShopByIdThunk,
  createShopThunk,
  updateShopThunk,
  deleteShopThunk,
} from "../api/ShopApiThunk";

const shopSlice = createSlice({
  name: "shop",
  initialState: initialShopState,
  reducers: {
    setShops: (state, action) => {
      state.shops = action.payload;
    },
  },
  extraReducers: (builder) => {
    //getAllShopsThunk
    builder.addCase(getAllShopsThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllShopsThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.shops = action.payload;
    });
    builder.addCase(getAllShopsThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? null;
    });

    //getShopByIdThunk
    builder.addCase(getShopByIdThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getShopByIdThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.shops = action.payload;
    });
    builder.addCase(getShopByIdThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? null;
    });

    //createShopThunk
    builder.addCase(createShopThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createShopThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.shops.push(action.payload);
    });
    builder.addCase(createShopThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? null;
    });

    //updateShopThunk
    builder.addCase(updateShopThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateShopThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.shops = state.shops.map((shop) =>
        shop.id === action.payload.id ? action.payload : shop,
      );
    });
    builder.addCase(updateShopThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? null;
    });

    //deleteShopThunk
    builder.addCase(deleteShopThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteShopThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.shops = state.shops.filter((shop) => shop.id !== action.payload);
    });
    builder.addCase(deleteShopThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? null;
    });
  },
});

export const { setShops } = shopSlice.actions;

export const shopReducer = shopSlice.reducer;

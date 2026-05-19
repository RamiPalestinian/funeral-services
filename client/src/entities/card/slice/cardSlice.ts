import { createSlice } from "@reduxjs/toolkit";
import { initialCardState } from "../model";
import {
  getAllCardsThunk,
  getCardByIdThunk,
  deleteCardThunk,
  createCardThunk,
  mockCheckoutThunk,
} from "../api/CardApiThunk";
import {
  logoutThunk,
  deleteUserAccountThunk,
} from "@/entities/user/api/UserApiThunk";

const cardSlice = createSlice({
  name: "card",
  initialState: initialCardState,
  reducers: {},
  extraReducers: (builder) => {
    //createCardThunk
    builder.addCase(createCardThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createCardThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.cards = [...state.cards, action.payload];
    });
    builder.addCase(createCardThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? null;
    });

    builder.addCase(getAllCardsThunk.pending, (state) => {
      if (state.cards.length === 0) {
        state.isLoading = true;
      }
    });
    builder.addCase(getAllCardsThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cards = action.payload;
    });
    builder.addCase(getAllCardsThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? null;
    });

    //getCardByIdThunk
    builder.addCase(getCardByIdThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCardByIdThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cards = [action.payload];
    });
    builder.addCase(getCardByIdThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? null;
    });

    //deleteCardThunk — без isLoading, чтобы список корзины не пропадал на время запроса
    builder.addCase(deleteCardThunk.pending, (state, action) => {
      state.error = null;
      state.cards = state.cards.filter((card) => card.id !== action.meta.arg);
    });
    builder.addCase(deleteCardThunk.fulfilled, (state, action) => {
      state.cards = state.cards.filter((card) => card.id !== action.payload);
    });
    builder.addCase(deleteCardThunk.rejected, (state, action) => {
      state.error = action.payload ?? null;
    });

    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.cards = [];
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(deleteUserAccountThunk.fulfilled, (state) => {
      state.cards = [];
      state.error = null;
      state.isLoading = false;
    });

    //mockCheckoutThunk
    builder.addCase(mockCheckoutThunk.pending, (state) => {
      state.isLoading = true;
      state.lastCheckout = null;
      state.error = null;
    });
    builder.addCase(mockCheckoutThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.lastCheckout = action.payload;
    });
    builder.addCase(mockCheckoutThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.lastCheckout = null;
      state.error = action.payload ?? "Не удалось оплатить";
    });
  },
});

export const cardReducer = cardSlice.reducer;

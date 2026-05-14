import { createSlice } from "@reduxjs/toolkit";
import { initialCremationState, CremationStateType } from "../model";
import {
  getAllCremationsThunk,
  getCremationByIdThunk,
  createCremationThunk,
  updateCremationThunk,
  deleteCremationThunk,
} from "../api/CremationApiThunk";

const cremationSlice = createSlice({
  name: "cremation",
  initialState: initialCremationState,
  reducers: {
    setCremations: (state, action) => {
      state.cremations = action.payload;
    },
  },
  extraReducers: (builder) => {
    //getAllCremationsThunk
    builder.addCase(getAllCremationsThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllCremationsThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cremations = action.payload;
    });
    builder.addCase(getAllCremationsThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? null;
    });

    //getCremationByIdThunk
    builder.addCase(getCremationByIdThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCremationByIdThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cremations = [action.payload];
    });
    builder.addCase(getCremationByIdThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? null;
    });

    //createCremationThunk
    builder.addCase(createCremationThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createCremationThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cremations.push(action.payload);
    });
    builder.addCase(createCremationThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? null;
    });

    //updateCremationThunk
    builder.addCase(updateCremationThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateCremationThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cremations = state.cremations.map((shop) =>
        shop.id === action.payload.id ? action.payload : shop,
      );
    });
    builder.addCase(updateCremationThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? null;
    });

    //deleteCremationThunk
    builder.addCase(deleteCremationThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteCremationThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cremations = state.cremations.filter(
        (shop) => shop.id !== action.payload,
      );
    });
    builder.addCase(deleteCremationThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? null;
    });
  },
});

export const { setCremations } = cremationSlice.actions;

export const cremationReducer = cremationSlice.reducer;

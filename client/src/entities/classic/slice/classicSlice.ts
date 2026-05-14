import { createSlice } from "@reduxjs/toolkit";
import { initialClassicState } from "../model";
import {
  fetchClassicThunk,
  fetchClassicByIdThunk,
  createClassicThunk,
  updateClassicThunk,
  deleteClassicThunk,
  getUserClassicThunk,
} from "../api/ClassicApiThunk";

const classicSlice = createSlice({
  name: "classic",
  initialState: initialClassicState,
  reducers: {
    setOneClassic: (state, action) => {
      state.oneClassic = action.payload;
    },
    clearClassics: (state) => {
      state.classics = [];
      state.oneClassic = null;
    },
  },
  extraReducers: (builder) => {
    // fetchClassicThunk
    builder.addCase(fetchClassicThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchClassicThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.classics = action.payload;
    });
    builder.addCase(fetchClassicThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? "Ошибка при загрузке классических услуг";
    });

    // fetchClassicByIdThunk
    builder.addCase(fetchClassicByIdThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchClassicByIdThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.oneClassic = action.payload;
    });
    builder.addCase(fetchClassicByIdThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? "Ошибка при загрузке классических услуг";
    });

    // createClassicThunk
    builder.addCase(createClassicThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createClassicThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.classics = [...state.classics, action.payload];
    });
    builder.addCase(createClassicThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? "Ошибка при создании классических услуг";
    });

    // updateClassicThunk
    builder.addCase(updateClassicThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateClassicThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.oneClassic = action.payload;
      state.classics = state.classics.map((classic) =>
        classic.id === action.payload.id ? action.payload : classic,
      );
    });
    builder.addCase(updateClassicThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        action.payload ?? "Ошибка при изменении классической услуги";
    });

    // deleteClassicThunk
    builder.addCase(deleteClassicThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteClassicThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.classics = state.classics.filter(
        (classic) => classic.id !== action.payload,
      );
    });
    builder.addCase(deleteClassicThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? "Ошибка при удалении классических услуг";
    });

    // getUserClassicThunk
    builder.addCase(getUserClassicThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserClassicThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.classics = action.payload;
    });
    builder.addCase(getUserClassicThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        action.payload ?? "Ошибка при загрузке классических услуг пользователя";
    });
  },
});

export const { setOneClassic, clearClassics } = classicSlice.actions;
export const classicReducer = classicSlice.reducer;

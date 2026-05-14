import { createSlice } from "@reduxjs/toolkit";
import { initialIslamicState } from "../model";
import {
  fetchIslamicThunk,
  fetchIslamicByIdThunk,
  createIslamicThunk,
  deleteIslamicThunk,
  getUserIslamicThunk,
} from "../api/IslamicApiThunk";

const islamicSlice = createSlice({
  name: "islamic",
  initialState: initialIslamicState,
    reducers: {
    setOneIslamic: (state, action) => {
      state.oneIslamic = action.payload;
    },
    clearIslamics: (state) => {
      state.islamics = [];
        state.oneIslamic = null;
    },
  },
  extraReducers: (builder) => {
    // fetchIslamicThunk
    builder.addCase(fetchIslamicThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchIslamicThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.islamics = action.payload;
    });
    builder.addCase(fetchIslamicThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? "Ошибка при загрузке исламских услуг";
    });

    // fetchIslamicByIdThunk
    builder.addCase(fetchIslamicByIdThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchIslamicByIdThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.oneIslamic = action.payload;
    });
    builder.addCase(fetchIslamicByIdThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? "Ошибка при загрузке исламских услуг";
    });

    // createIslamicThunk
    builder.addCase(createIslamicThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    }); 
    builder.addCase(createIslamicThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.islamics = [...state.islamics, action.payload];
    });
    builder.addCase(createIslamicThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? "Ошибка при создании исламской услуги";
    });

    // deleteIslamicThunk
    builder.addCase(deleteIslamicThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteIslamicThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.islamics = state.islamics.filter(islamic => islamic.id !== action.payload);
    }); 
    builder.addCase(deleteIslamicThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? "Ошибка при удалении исламской услуги";
    });

    // getUserIslamicThunk
    builder.addCase(getUserIslamicThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserIslamicThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.islamics = action.payload;
    });
    builder.addCase(getUserIslamicThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? "Ошибка при загрузке исламских услуг пользователя";
    }); 
    },  
});

export const { setOneIslamic, clearIslamics } = islamicSlice.actions;   
export const islamicReducer = islamicSlice.reducer;
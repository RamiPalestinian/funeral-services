import { createSlice } from "@reduxjs/toolkit";
import { initialUserState } from "../model";
import { changePasswordThunk, deleteUserAccountThunk, loginThunk, logoutThunk, refreshTokenThunk, registerThunk, updateProfileThunk } from "../api/UserApiThunk";

const userSlice = createSlice({
    name: 'user',
    initialState: initialUserState,
    reducers: {
        setUser: (state,action) => {state.user = action.payload}
    },
    extraReducers: (builder) => {

        //refreshTokenThunk
        builder.addCase(refreshTokenThunk.pending, (state) => {state.isLoading = true})
        builder.addCase(refreshTokenThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.user = action.payload;
        })
        builder.addCase(refreshTokenThunk.rejected,(state, action) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.user = null;
            state.error = action.payload ?? 'Ошибка при обновлении токена';
        })

        //registerThunk
        builder.addCase(registerThunk.pending, (state) => {state.isLoading = true})
        builder.addCase(registerThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.user = action.payload;
        })
        builder.addCase(registerThunk.rejected,(state, action) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.error = action.payload ?? 'Ошибка при регистрации';
        })

        //loginThunk
        builder.addCase(loginThunk.pending, (state) => {state.isLoading = true})
        builder.addCase(loginThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.user = action.payload;
        })
        builder.addCase(loginThunk.rejected,(state, action) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.error = action.payload ?? 'Ошибка при входе пользователя';
        })

        //logoutThunk
        builder.addCase(logoutThunk.pending, (state) => {state.isLoading = true})
        builder.addCase(logoutThunk.fulfilled, (state) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.user = null;
        })
        builder.addCase(logoutThunk.rejected,(state, action) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.error = action.payload ?? 'Ошибка при выходе пользователя';
        })

        //updateProfileThunk
        builder.addCase(updateProfileThunk.pending, (state) => {state.isLoading = true})
        builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.error = null;
        })
        builder.addCase(updateProfileThunk.rejected,(state, action) => {
            state.isLoading = false;
            state.error = action.payload ?? 'Ошибка при обновлении профиля';
        })

        //changePasswordThunk
        builder.addCase(changePasswordThunk.pending, (state) => {state.isLoading = true})
        builder.addCase(changePasswordThunk.fulfilled, (state) => {
            state.isLoading = false;
            state.error = null;
        })
        builder.addCase(changePasswordThunk.rejected,(state, action) => {
            state.isLoading = false;
            state.error = action.payload ?? 'Ошибка при смене пароля';
        })

        //deleteUserAccountThunk
        builder.addCase(deleteUserAccountThunk.pending, (state) => {state.isLoading = true})
        builder.addCase(deleteUserAccountThunk.fulfilled, (state) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.user = null;
        })
        builder.addCase(deleteUserAccountThunk.rejected,(state, action) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.error = action.payload ?? 'Ошибка при удалении пользователя';
        })
    }
})

export const {setUser} = userSlice.actions

export const userReducer = userSlice.reducer

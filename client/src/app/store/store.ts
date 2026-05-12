import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "@/entities/user/slice/userSlice";

// создаём store - глобальное хранилище данных
export const store = configureStore({
    reducer: { 
        user: userReducer}
})


// экспортируем типы для написания кастомных хуков useAppSelector и useAppDispatch
export type RootState = ReturnType<typeof store.getState> //типизация нашего состояния, который мы будем использовать в селекторах и компонентах
export type AppDispatch = typeof store.dispatch // тип функции котрое отправляет нам действие, который мы будем использовать в компонентах для отправки действий в наш стор
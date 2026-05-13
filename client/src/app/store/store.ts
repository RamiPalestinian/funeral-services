import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "@/entities/user/slice/userSlice";
import { classicReducer } from "@/entities/classic/slice/classicSlice";
import { cremationReducer } from "@/entities/cremation/slice/cremationSlice";
import { shopReducer } from "@/entities/shop/slice/shopSlice";

// создаём store - глобальное хранилище данных
export const store = configureStore({
  reducer: {
    user: userReducer,
    cremation: cremationReducer,
    classic: classicReducer,
    shop: shopReducer,
  },
});

// экспортируем типы для написания кастомных хуков useAppSelector и useAppDispatch
export type RootState = ReturnType<typeof store.getState>; //типизация нашего состояния, который мы будем использовать в селекторах и компонентах
export type AppDispatch = typeof store.dispatch; // тип функции котрое отправляет нам действие, который мы будем использовать в компонентах для отправки действий в наш стор

import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { createCardThunk } from "@/entities/card/api/CardApiThunk";
import {
  createClassicThunk,
  deleteClassicThunk,
  updateClassicThunk,
} from "@/entities/classic/api/ClassicApiThunk";
import {
  createCremationThunk,
  deleteCremationThunk,
  updateCremationThunk,
} from "@/entities/cremation/api/CremationApiThunk";
import {
  createIslamicThunk,
  deleteIslamicThunk,
  updateIslamicThunk,
} from "@/entities/islamic/api/IslamicApiThunk";
import {
  createShopThunk,
  deleteShopThunk,
  updateShopThunk,
} from "@/entities/shop/api/ShopApiThunk";
import { updateProfileThunk } from "@/entities/user/api/UserApiThunk";
import { showToast } from "@/shared/lib/toast";

export const toastListenerMiddleware = createListenerMiddleware();

toastListenerMiddleware.startListening({
  matcher: createCardThunk.fulfilled.match,
  effect: () => {
    showToast("Товар добавлен в корзину", "success");
  },
});

toastListenerMiddleware.startListening({
  matcher: updateProfileThunk.fulfilled.match,
  effect: () => {
    showToast("Данные пользователя обновлены", "success");
  },
});

toastListenerMiddleware.startListening({
  matcher: isAnyOf(
    createClassicThunk.fulfilled,
    createIslamicThunk.fulfilled,
    createCremationThunk.fulfilled,
    createShopThunk.fulfilled,
  ),
  effect: () => {
    showToast("Услуга успешно добавлена", "success");
  },
});

toastListenerMiddleware.startListening({
  matcher: isAnyOf(
    updateClassicThunk.fulfilled,
    updateIslamicThunk.fulfilled,
    updateCremationThunk.fulfilled,
    updateShopThunk.fulfilled,
  ),
  effect: () => {
    showToast("Услуга успешно обновлена", "success");
  },
});

toastListenerMiddleware.startListening({
  matcher: isAnyOf(
    deleteClassicThunk.fulfilled,
    deleteIslamicThunk.fulfilled,
    deleteCremationThunk.fulfilled,
    deleteShopThunk.fulfilled,
  ),
  effect: () => {
    showToast("Услуга удалена", "success");
  },
});

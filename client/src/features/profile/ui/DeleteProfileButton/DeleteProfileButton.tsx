"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/application/UserProvider";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { deleteUserAccountThunk } from "@/entities/user/api/UserApiThunk";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";
import "./DeleteProfileButton.css";

export default function DeleteProfileButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setUser } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Удалить профиль безвозвратно? Все ваши данные и заказы будут удалены.",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await dispatch(deleteUserAccountThunk()).unwrap();
      setUser(null);
      router.replace(CLIENT_ROUTES.HOME);
    } catch (thunkError) {
      setError(thunkError as string);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="personal-delete">
      <p className="personal-delete-text">
        Удаление аккаунта необратимо. Будут удалены профиль, корзина и все
        связанные заказы.
      </p>
      {error && <p className="personal-form-error">{error}</p>}
      <button
        type="button"
        className="personal-btn personal-btn--danger"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Удаление…" : "Удалить профиль"}
      </button>
    </div>
  );
}

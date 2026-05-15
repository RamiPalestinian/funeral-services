"use client";

import FormInput from "@/shared/ui/FormInput/FormInput";
import { UserValidator } from "@/entities/user/model/UserValidator";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { updateProfileThunk } from "@/entities/user/api/UserApiThunk";
import type { UserType } from "@/entities/user/model";
import "../EditNameForm/EditNameForm.css";

export default function EditEmailForm({
  user,
  setUser,
}: {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}) {
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector((state) => state.user.isLoading);
  const serverError = useAppSelector((state) => state.user.error);

  const submitHandler = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "")
      .trim()
      .toLowerCase();

    if (!UserValidator.validateEmail(email)) {
      alert("Некорректный email");
      return;
    }

    if (email === user.email.toLowerCase()) {
      alert("Email не изменился");
      return;
    }

    try {
      const updatedUser = await dispatch(
        updateProfileThunk({ email }),
      ).unwrap();
      setUser(updatedUser);
    } catch {
      console.log("Ошибка при обновлении email");
    }
  };

  return (
    <article className="personal-edit-card">
      <span>Email</span>
      <form
        key={user.email}
        className="personal-edit-form"
        onSubmit={submitHandler}
      >
        <FormInput
          placeholder=" "
          name="email"
          type="email"
          required
          defaultValue={user.email}
          label="Новый email"
        />
        {serverError && <p className="personal-form-error">{serverError}</p>}
        <button
          type="submit"
          className="personal-form-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Сохранение…" : "Сохранить email"}
        </button>
      </form>
    </article>
  );
}

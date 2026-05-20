"use client";

import FormInput from "@/shared/ui/FormInput/FormInput";
import { UserValidator } from "@/entities/user/model/UserValidator";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { updateProfileThunk } from "@/entities/user/api/UserApiThunk";
import type { UserType } from "@/entities/user/model";
import { showToast } from "@/shared/lib/toast";

export default function EditProfileForm({
  user,
  setUser,
}: {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.user);

  const submitHandler = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const trimmedName = String(formData.get("name") ?? "").trim();
    const { isValid, error: validationError } =
      UserValidator.validateName(trimmedName);
    if (!isValid) {
      alert(validationError);
      return;
    }

    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    if (!UserValidator.validateEmail(email)) {
      alert("Некорректный email");
      return;
    }

    const payload = {
      name: trimmedName,
      lastName: String(formData.get("lastName") ?? "").trim(),
      middleName: String(formData.get("middleName") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email,
      city: String(formData.get("city") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
    };

    try {
      const updatedUser = await dispatch(updateProfileThunk(payload)).unwrap();
      setUser(updatedUser);
    } catch {
      showToast("Не удалось сохранить профиль", "error");
    }
  };

  return (
    <article className="personal-edit-card">
      <span>ФИО, контакты и адрес</span>
      <form
        key={`${user.name}-${user.lastName}-${user.middleName}-${user.phone}-${user.email}-${user.city}-${user.address}`}
        className="personal-edit-form"
        onSubmit={submitHandler}
      >
        <FormInput
          placeholder=" "
          name="lastName"
          type="text"
          defaultValue={user.lastName ?? ""}
          label="Фамилия"
        />
        <FormInput
          placeholder=" "
          name="name"
          type="text"
          required
          defaultValue={user.name}
          label="Имя"
        />
        <FormInput
          placeholder=" "
          name="middleName"
          type="text"
          defaultValue={user.middleName ?? ""}
          label="Отчество"
        />
        <FormInput
          placeholder=" "
          name="phone"
          type="tel"
          defaultValue={user.phone ?? ""}
          label="Телефон"
        />
        <FormInput
          placeholder=" "
          name="email"
          type="email"
          required
          defaultValue={user.email}
          label="Email"
        />
        <FormInput
          placeholder=" "
          name="city"
          type="text"
          defaultValue={user.city ?? ""}
          label="Город"
        />
        <FormInput
          placeholder=" "
          name="address"
          type="text"
          defaultValue={user.address ?? ""}
          label="Адрес"
        />
        {error && <p className="personal-form-error">{error}</p>}
        <button
          type="submit"
          className="personal-form-button"
          disabled={isLoading}
        >
          {isLoading ? "Сохранение…" : "Сохранить"}
        </button>
      </form>
    </article>
  );
}

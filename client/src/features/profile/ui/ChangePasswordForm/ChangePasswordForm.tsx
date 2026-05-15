'use client';

import { useState } from 'react';
import FormInput from '@/shared/ui/FormInput/FormInput';
import { UserValidator } from '@/entities/user/model/UserValidator';
import { useAppDispatch } from '@/shared/hooks/useReduxHooks';
import { changePasswordThunk } from '@/entities/user/api/UserApiThunk';

const initialValue = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function ChangePasswordForm() {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const { isValid, error: validationError } =
      UserValidator.validatePasswordChange(formData);

    if (!isValid) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const message = await dispatch(
        changePasswordThunk({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      ).unwrap();
      setFormData(initialValue);
      setSuccess(message);
    } catch (thunkError) {
      setError(thunkError as string);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="personal-edit-card">
      <span>Пароль</span>
      <form className="personal-edit-form" onSubmit={submitHandler}>
        <FormInput
          placeholder=" "
          name="currentPassword"
          type="password"
          required
          value={formData.currentPassword}
          onChange={inputHandler}
          label="Текущий пароль"
        />
        <FormInput
          placeholder=" "
          name="newPassword"
          type="password"
          required
          value={formData.newPassword}
          onChange={inputHandler}
          label="Новый пароль"
        />
        <FormInput
          placeholder=" "
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={inputHandler}
          label="Подтвердите пароль"
        />
        {error && <p className="personal-form-error">{error}</p>}
        {success && <p className="personal-form-success">{success}</p>}
        <button type="submit" className="personal-form-button" disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение…' : 'Сменить пароль'}
        </button>
      </form>
    </article>
  );
}

'use client';

import { useEffect, useState } from 'react';
import FormInput from '@/shared/ui/FormInput/FormInput';
import { UserValidator } from '@/entities/user/model/UserValidator';
import type { UserType } from '@/entities/user/model';
import { useAppDispatch } from '@/shared/hooks/useReduxHooks';
import { updateProfileThunk } from '@/entities/user/api/UserApiThunk';
import './EditNameForm.css';

type EditNameFormProps = {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

export default function EditNameForm({ user, setUser }: EditNameFormProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(user.name);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(user.name);
  }, [user.name]);

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const { isValid, error: validationError } = UserValidator.validateName(name);

    if (!isValid) {
      setError(validationError);
      return;
    }

    if (name.trim() === user.name) {
      setError('Имя не изменилось');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedUser = await dispatch(
        updateProfileThunk({ name: name.trim() }),
      ).unwrap();
      setUser(updatedUser);
      setSuccess('Имя успешно обновлено');
    } catch (thunkError) {
      setError(thunkError as string);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="personal-edit-card">
      <span>Имя</span>
      <form className="personal-edit-form" onSubmit={submitHandler}>
        <FormInput
          placeholder=" "
          name="name"
          type="text"
          required
          value={name}
          onChange={(event) => {
            setError(null);
            setSuccess(null);
            setName(event.target.value);
          }}
          label="Новое имя"
        />
        {error && <p className="personal-form-error">{error}</p>}
        {success && <p className="personal-form-success">{success}</p>}
        <button type="submit" className="personal-form-button" disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение…' : 'Сохранить имя'}
        </button>
      </form>
    </article>
  );
}

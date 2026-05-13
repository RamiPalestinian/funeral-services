'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './SignUpForm.css';
import { UserValidator } from '@/entities/user/model/UserValidator';
import FormInput from '@/shared/ui/FormInput/FormInput';
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { registerThunk } from '@/entities/user/api/UserApiThunk';

export default function SignUpForm() {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const initialValue = { name: '', email: '', password: '', confirmPassword: '' };
  const router = useRouter();

  const [signUpData, setSignUpData] = useState(initialValue); // стейт который следит за данными которыйе вводит

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSignUpData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const signUpHandler = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();  // отключение формы по умолчанию

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    const registrationData = {
      name: signUpData.name,
      email: signUpData.email,
      password: signUpData.password,
    };

    const { isValid, error: validationError } =
      UserValidator.validateRegistrationData(registrationData);  // проводим валидацию данных

    if (!isValid) {
      setError(validationError);
      return;
    }

    try {
      await dispatch(registerThunk(registrationData)).unwrap();
      setError(null);
      setSignUpData(initialValue);
      router.push('/home');
      router.refresh();
    } catch (thunkError) {
      setError(thunkError as string);
    }
  };

  return (
    <div className="auth-form-block">
      <div className="auth-form-heading">
        <span className="auth-form-kicker">Первый шаг</span>
        <h2>Регистрация</h2>
      </div>
      <form className="form" onSubmit={signUpHandler}>
        <FormInput
          placeholder=" "
          name="name"
          type="text"
          required
          onChange={inputHandler}
          value={signUpData.name}
          label="Имя"
        />
        <FormInput
          placeholder=" "
          name="email"
          type="email"
          required
          onChange={inputHandler}
          value={signUpData.email}
          label="Почта"
        />
        <FormInput
          placeholder=" "
          name="password"
          type="password"
          required
          onChange={inputHandler}
          value={signUpData.password}
          label="Пароль"
        />
        <FormInput
          placeholder=" "
          name="confirmPassword"
          type="password"
          required
          onChange={inputHandler}
          value={signUpData.confirmPassword}
          label="Подтвердите пароль"
        />
        {error && <p className="form-error">{error}</p>}
        <button className="form-action-button">Создать кабинет</button>
      </form>
    </div>
  );
}

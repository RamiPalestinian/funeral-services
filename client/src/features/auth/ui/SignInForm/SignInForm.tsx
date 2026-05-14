'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './SignInForm.css';
import { UserValidator } from '@/entities/user/model/UserValidator';
import FormInput from '@/shared/ui/FormInput/FormInput';
import type { UserType } from '@/entities/user/model';
import { useAppDispatch } from '@/shared/hooks/useReduxHooks';
import { loginThunk } from '@/entities/user/api/UserApiThunk';

type SignInFormProps = {
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>  
}

export default function SignInForm({ setUser } : SignInFormProps) {
  const initialValue = { email: '', password: '' };
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [signInData, setSignInData] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSignInData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const signInHandler = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { isValid, error: validationError } =
      UserValidator.validateLoginData(signInData);

    if (!isValid) {
      setError(validationError);
      return;
    }

    try {
      const user = await dispatch(loginThunk(signInData)).unwrap();
      setUser(user);
      router.push('/home');
      setSignInData(initialValue);
      setError(null);
    } catch (thunkError) {
      setError(thunkError as string);
    }
  };

  return (
    <div className="auth-form-block">
      <div className="auth-form-heading">
        <span className="auth-form-kicker">Возвращение</span>
        <h2>Вход</h2>
      </div>
      <form className="form" onSubmit={signInHandler}>
        <FormInput
          placeholder=" "
          name="email"
          type="email"
          required
          onChange={inputHandler}
          value={signInData.email}
          label="Почта"
        />
        <FormInput
          placeholder=" "
          name="password"
          type="password"
          required
          onChange={inputHandler}
          value={signInData.password}
          label="Пароль"
        />
        {error && <p className="form-error">{error}</p>}
        <button className="form-action-button">Открыть кабинет</button>
      </form>
    </div>
  );
}

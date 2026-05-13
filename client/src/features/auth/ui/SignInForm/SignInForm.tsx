'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './SignInForm.css';
import { UserValidator } from '@/entities/user/model/UserValidator';
import UserApi from '@/entities/user/api/UserApi';
import { setAccessToken } from '@/shared/lib/axiosInstance';
import FormInput from '@/shared/ui/FormInput/FormInput';
import type { UserType } from '@/entities/user/model';

type SignInFormProps = {
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>  
}

export default function SignInForm({ setUser } : SignInFormProps) {
  const initialValue = { email: '', password: '' };
  // const navigate = useNavigate();
  const router = useRouter();

  const [signInData, setSignInData] = useState(initialValue);

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      alert(validationError);
      return;
    }
    const { statusCode, data, error } = await UserApi.login(signInData);
    if (statusCode === 200) {
      setAccessToken(data?.accessToken || '');
      setUser(data?.user || null);
      router.push('/home');
      setSignInData(initialValue);
    } else {
      alert(error || 'Ошибка при входе в приложение');
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
        <button className="form-action-button">Открыть кабинет</button>
      </form>
    </div>
  );
}

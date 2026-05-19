"use client";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";
import "./page.css";
import SignUpForm from "@/features/auth/ui/SignUpForm/SignUpForm";
import SignInForm from "@/features/auth/ui/SignInForm/SignInForm";
import { useUser } from "@/application/UserProvider";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import { useRouter } from "next/navigation";



export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { setUser } = useUser();

  const router = useRouter();

  const {user, isInitialized} = useAppSelector((state) => state.user);

   //защита сраницы
   useEffect(() => {
    if (isInitialized && user) {
      router.replace(CLIENT_ROUTES.HOME);
    }
  }, [isInitialized, user]);

  if (isInitialized && user) {
    return null;
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        {/* <section className="auth-copy-panel">
          <p className="auth-copy-kicker">Служба сопровождения</p>
          <div className="auth-copy-frame">
            <div></div>
            <h1>Семейный кабинет для срочного обращения</h1>
          </div>
          <p className="auth-copy-text">
            Без длинных анкет. Только главное.
          </p>
          <div className="auth-copy-points">
            <span>24/7 связь</span>
            <span>1 форма</span>
            <span>спокойный тон</span>
          </div>
        </section> */}
        <div className="form-container">
          <div className="auth-toggle">
            <button
              className={`toggle-option ${!isSignUp ? "active" : ""}`}
              onClick={() => setIsSignUp(false)}
            >
              Вход
            </button>
            <button
              className={`toggle-option ${isSignUp ? "active" : ""}`}
              onClick={() => setIsSignUp(true)}
            >
              Регистрация
            </button>
          </div>

          {isSignUp ? <SignUpForm /> : <SignInForm setUser={setUser} />}
        </div>
      </div>
    </div>
  );
}

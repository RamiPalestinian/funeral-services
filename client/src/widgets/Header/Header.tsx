"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "./Header.css";
import type { UserType } from "@/entities/user/model";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { logoutThunk } from "@/entities/user/api/UserApiThunk";
import { setAccessToken } from "@/shared/lib/axiosInstance";

type HeaderProps = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

export default function Header({ user, setUser }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isHomePage = pathname === "/";

  async function handleLogout() {
    try {
      await dispatch(logoutThunk()).unwrap();
    } catch {
      setUser(null);
      setAccessToken("");
    }
    router.push("/");
  }
  return (
    <header
      className={isHomePage ? "site-header site-header-home" : "site-header"}
    >
      <nav className={isHomePage ? "site-nav site-nav-home" : "site-nav"}>
        <div className="nav-brand">
          <span className="nav-brand-mark">линия сопровождения</span>
          <span className="nav-brand-copy">Груз 200</span>
        </div>
        <div className="nav-links">
          {user !== null ? (
            <>
              <Link href="/home" className="navlink">
                О нас
              </Link>
              <Link href="/ai" className="navlink">
                Обращение
              </Link>
              <Link href="/personal" className="navlink">
                Кабинет
              </Link>
              {/* <Link href="/contact" className="navlink">
                Контакты
              </Link> */}
              <div className="dropdown">
                <button className="dropbtn">Наши услуги</button>
                <div className="dropdown-content">
                  <a href="/classic">Традиционные похороны</a>
                  <a href="/islamic">Исламские похороны</a>
                  <a href="/cremation">Кремация</a>
                  <a href="/shop">Ритуальный магазин</a>
                </div>
              </div>
              <button
                type="button"
                className="navlink navlink-accent"
                onClick={() => void handleLogout()}
              >
                Выйти
              </button>
              <p className="navlink name">Здравствуйте, {user.name}</p>
            </>
          ) : (
            <>
              <Link href="/" className="navlink">
                Главная
              </Link>
              <Link href="/auth" className="navlink navlink-accent">
                Войти
              </Link>
            </>
          )}
        </div>
        <div className="nav-hotline">
          <span>на связи</span>
          <strong>24 / 7</strong>
        </div>
      </nav>
    </header>
  );
}

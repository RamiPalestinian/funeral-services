'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Header.css";
import UserApi from "@/entities/user/api/UserApi";
import { setAccessToken } from "@/shared/lib/axiosInstance";
import type { UserType } from "@/entities/user/model";

type HeaderProps = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

export default function Header({ user, setUser }: HeaderProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  async function handleLogout() {
    const { statusCode } = await UserApi.logout();

    if (statusCode === 200) {
      setUser(null);
      setAccessToken("");
    }
  }
  return (
    <header className={isHomePage ? "site-header site-header-home" : "site-header"}>
      <nav className={isHomePage ? "site-nav site-nav-home" : "site-nav"}>
        <div className="nav-brand">
          <span className="nav-brand-mark">линия сопровождения</span>
          <span className="nav-brand-copy">Груз 200</span>
        </div>
        <div className="nav-links">
          {user?.id ? (
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
                <Link href="/contact" className="navlink">
                Контакты
              </Link>
              <Link
                href="/auth"
                className="navlink navlink-accent"
                onClick={handleLogout}
              >
                Выйти
              </Link>
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

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "./Header.css";
import type { UserType } from "@/entities/user/model";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { logoutThunk } from "@/entities/user/api/UserApiThunk";
import { getAllCardsThunk } from "@/entities/card/api/CardApiThunk";
import { setAccessToken } from "@/shared/lib/axiosInstance";
import { useEffect } from "react";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";

type HeaderProps = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

export default function Header({ user, setUser }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector((state) => state.card.cards.length);
  const isHomePage = pathname === CLIENT_ROUTES.GENERAL;

  useEffect(() => {
    if (user) {
      void dispatch(getAllCardsThunk());
    }
  }, [dispatch, user]);

  async function handleLogout() {
    try {
      await dispatch(logoutThunk()).unwrap();
    } catch {
      setUser(null);
      setAccessToken("");
    }
    router.push(CLIENT_ROUTES.GENERAL);
  }
  return (
    <header
      className={isHomePage ? "site-header site-header-home" : "site-header"}
    >
      <nav className={isHomePage ? "site-nav site-nav-home" : "site-nav"}>
        <div className="nav-brand">
          <span className="nav-brand-mark">линия сопровождения</span>
          <span className="nav-brand-copy">Пантеон</span>
        </div>
        <div className="nav-links">
          {user !== null ? (
            <>
              <Link href={CLIENT_ROUTES.HOME} className="navlink">
                Главная страница
              </Link>
              {/* <Link href={CLIENT_ROUTES.AI} className="navlink">
                Обращение
              </Link>
              <Link href={CLIENT_ROUTES.PERSONAL} className="navlink">
                Кабинет
              </Link> */}
              <div className="dropdown">
                <button className="dropbtn">Кабинет</button>
                <div className="dropdown-content">
                  <Link href={CLIENT_ROUTES.PERSONAL}>Личный кабинет</Link>
                  <Link href={CLIENT_ROUTES.AI}>Обращение</Link>
                </div>
              </div>
              {/* <Link href={CLIENT_ROUTES.CONTACT} className="navlink">
                Контакты
              </Link> */}
              <div className="dropdown">
                <button className="dropbtn">Наши услуги</button>
                <div className="dropdown-content">
                  <Link href={CLIENT_ROUTES.CLASSIC}>Традиционные похороны</Link>
                  <Link href={CLIENT_ROUTES.ISLAMIC}>Исламские похороны</Link>
                  <Link href={CLIENT_ROUTES.CREMATION}>Кремация</Link>
                  <Link href={CLIENT_ROUTES.SHOP}>Ритуальный магазин</Link>
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
              <Link href={CLIENT_ROUTES.GENERAL} className="navlink">
                Главная
              </Link>
              <Link href={CLIENT_ROUTES.AUTH} className="navlink navlink-accent">
                Войти
              </Link>
            </>
          )}
        </div>
        <div className="nav-aside">
          <div className="nav-hotline">
            <span>на связи</span>
            <strong>24 / 7</strong>
          </div>
          <Link
            href={CLIENT_ROUTES.CARD}
            className="navlink navlink-cart"
            aria-label={
              cartCount > 0 ? `Корзина, ${cartCount} позиций` : "Корзина"
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="navlink-cart-icon"
              src="/cart.png"
              alt=""
              width={18}
              height={18}
            />
            {user && cartCount > 0 ? (
              <span className="navlink-cart-badge" aria-hidden>
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </nav>
    </header>
  );
}

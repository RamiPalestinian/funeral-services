"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "./Header.css";
import type { UserType } from "@/entities/user/model";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { logoutThunk } from "@/entities/user/api/UserApiThunk";
import { getAllCardsThunk } from "@/entities/card/api/CardApiThunk";
import { setAccessToken } from "@/shared/lib/axiosInstance";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const barRef = useRef<HTMLDivElement>(null);
  const [openMenuPath, setOpenMenuPath] = useState<string | null>(null);

  if (openMenuPath !== null && openMenuPath !== pathname) {
    setOpenMenuPath(null);
  }

  const menuOpen = openMenuPath === pathname;
  const closeMenu = () => setOpenMenuPath(null);
  const toggleMenu = () =>
    setOpenMenuPath(menuOpen ? null : pathname);

  useEffect(() => {
    if (user) {
      void dispatch(getAllCardsThunk());
    }
  }, [dispatch, user]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(max-width: 1024px)");

    const updateBarOffset = () => {
      const bar = barRef.current;
      if (!bar || !mq.matches) {
        root.style.removeProperty("--header-bar-height");
        root.style.removeProperty("--header-offset");
        return;
      }

      const height = `${bar.offsetHeight}px`;
      root.style.setProperty("--header-bar-height", height);
      root.style.setProperty("--header-offset", height);
    };

    updateBarOffset();

    const observer = new ResizeObserver(updateBarOffset);
    const barEl = barRef.current;
    if (barEl) {
      observer.observe(barEl);
    }

    mq.addEventListener("change", updateBarOffset);
    window.addEventListener("resize", updateBarOffset);
    window.addEventListener("orientationchange", updateBarOffset);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", updateBarOffset);
      window.removeEventListener("resize", updateBarOffset);
      window.removeEventListener("orientationchange", updateBarOffset);
      root.style.removeProperty("--header-bar-height");
      root.style.removeProperty("--header-offset");
    };
  }, [user, pathname]);

  useEffect(() => {
    document.body.classList.toggle("site-mobile-menu-open", menuOpen);
    return () => document.body.classList.remove("site-mobile-menu-open");
  }, [menuOpen]);

  async function handleLogout() {
    try {
      await dispatch(logoutThunk()).unwrap();
    } catch {
      setUser(null);
      setAccessToken("");
    }
    closeMenu();
    router.push(CLIENT_ROUTES.GENERAL);
  }

  const headerClassName = [
    "site-header",
    isHomePage ? "site-header-home" : "",
    menuOpen ? "site-header--menu-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const navClassName = isHomePage ? "site-nav site-nav-home" : "site-nav";

  return (
    <header className={headerClassName}>
      <nav className={navClassName}>
        <div className="site-header-bar" ref={barRef}>
          <div className="nav-brand">
            <span className="nav-brand-mark">линия сопровождения</span>
            <span className="nav-brand-copy">Пантеон</span>
          </div>

          <div className="nav-aside">
            <div className="nav-hotline">
              <span>на связи</span>
              <strong>24 / 7</strong>
            </div>
            {user ? (
              <Link
                href={CLIENT_ROUTES.CARD}
                className="navlink navlink-cart"
                aria-label={
                  cartCount > 0 ? `Корзина, ${cartCount} позиций` : "Корзина"
                }
              >
                <Image
                  className="navlink-cart-icon"
                  src="/cart.png"
                  width={18}
                  height={18}
                  alt=""
                />
                {cartCount > 0 ? (
                  <span className="navlink-cart-badge" aria-hidden>
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                ) : null}
              </Link>
            ) : null}
          </div>

          <button
            type="button"
            className="nav-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="site-nav-panel"
            onClick={toggleMenu}
          >
            {menuOpen ? "Закрыть" : "Меню"}
          </button>
        </div>

        {menuOpen ? (
          <button
            type="button"
            className="site-nav-backdrop"
            aria-label="Закрыть меню"
            onClick={closeMenu}
          />
        ) : null}

        <div id="site-nav-panel" className="site-nav-panel">
          <div className="nav-links">
            {user !== null ? (
              <>
                <Link
                  href={CLIENT_ROUTES.HOME}
                  className="navlink"
                  onClick={closeMenu}
                >
                  Главная страница
                </Link>
                <div className="dropdown">
                  <button type="button" className="dropbtn">
                    Кабинет
                  </button>
                  <div className="dropdown-content">
                    <Link
                      href={CLIENT_ROUTES.PERSONAL}
                      onClick={closeMenu}
                    >
                      Личный кабинет
                    </Link>
                    <Link
                      href={CLIENT_ROUTES.AI}
                      onClick={closeMenu}
                    >
                      Обращение
                    </Link>
                  </div>
                </div>
                <div className="dropdown">
                  <button type="button" className="dropbtn">
                    Наши услуги
                  </button>
                  <div className="dropdown-content">
                    <Link
                      href={CLIENT_ROUTES.CLASSIC}
                      onClick={closeMenu}
                    >
                      Традиционные похороны
                    </Link>
                    <Link
                      href={CLIENT_ROUTES.ISLAMIC}
                      onClick={closeMenu}
                    >
                      Исламские похороны
                    </Link>
                    <Link
                      href={CLIENT_ROUTES.CREMATION}
                      onClick={closeMenu}
                    >
                      Кремация
                    </Link>
                    <Link
                      href={CLIENT_ROUTES.SHOP}
                      onClick={closeMenu}
                    >
                      Ритуальный магазин
                    </Link>
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
                <Link
                  href={CLIENT_ROUTES.GENERAL}
                  className="navlink"
                  onClick={closeMenu}
                >
                  Главная
                </Link>
                <Link
                  href={CLIENT_ROUTES.AUTH}
                  className="navlink navlink-accent"
                  onClick={closeMenu}
                >
                  Войти
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

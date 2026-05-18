import type { Metadata } from "next";
import "./globals.css";
import UserProvider from "@/application/UserProvider";
import StoreProvider from "@/app/store/storeProvider";

export const metadata: Metadata = {
  title: "Пантеон мы вместе",
  description: "Ритуальное агентство: сопровождение, организация и поддержка",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <StoreProvider>
          <UserProvider>{children}</UserProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

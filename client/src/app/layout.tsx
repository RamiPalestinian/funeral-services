import type { Metadata } from "next";
import "./globals.css";
import UserProvider from "@/application/UserProvider";
import StoreProvider from "@/app/store/storeProvider";
import AiChatFab from "@/widgets/AiChatFab/AiChatFab";
import { AiChatProvider } from "@/features/ai/model/AiChatProvider";

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
          <UserProvider>
            <AiChatProvider>
              {children}
              <AiChatFab />
            </AiChatProvider>
          </UserProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

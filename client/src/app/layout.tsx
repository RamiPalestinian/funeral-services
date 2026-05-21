import type { Metadata } from "next";
import "./globals.css";
import UserProvider from "@/application/UserProvider";
import StoreProvider from "@/app/store/storeProvider";
import ToastProvider from "@/shared/ui/Toast/ToastProvider";
import AiChatFab from "@/widgets/AiChatFab/AiChatFab";
import { AiChatProvider } from "@/features/ai/model/AiChatProvider";

export const metadata: Metadata = {
  title: "Пантеон мы вместе",
  description: "Ритуальное агентство: сопровождение, организация и поддержка",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
          <ToastProvider>
          <UserProvider>
            <AiChatProvider>
              {children}
              <AiChatFab />
            </AiChatProvider>
          </UserProvider>
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

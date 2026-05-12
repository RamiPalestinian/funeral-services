import "./ApplicationLayout.css";
import Header from "@/widgets/Header/Header";
import type { UserType } from "@/entities/user/model";
import { ReactNode } from "react";


type LayoutProps = {
  user: UserType | null,
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>,
  children: ReactNode;
}

export default function ApplicationLayout({ user, setUser, children } : LayoutProps) {
  return (
    <div className="layout-container">
      <Header user={user} setUser={setUser} />
      <main className="layout-main">
        {children}
      </main>
      <footer className="layout-footer">
        <span>GRUZ 200</span>
        <span>спокойная линия сопровождения</span>
      </footer>
    </div>
  );
}

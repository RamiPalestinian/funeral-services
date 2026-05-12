'use client';
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import type { UserType } from "@/entities/user/model";
import ApplicationLayout from "./ApplicationLayout";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { refreshTokenThunk } from "@/entities/user/api/UserApiThunk";

type UserContextType = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser должен использоваться внутри UserProvider");
  }

  return context;
}

function UserProvider({ children }: { children: ReactNode }) {
  const [, setUser] = useState<UserType | null>(null);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(refreshTokenThunk());
  }, [dispatch]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ApplicationLayout user={user} setUser={setUser}>
        {children}
      </ApplicationLayout>
    </UserContext.Provider>
  );
}

export default UserProvider;

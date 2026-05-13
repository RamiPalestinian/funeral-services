'use client';
import { useEffect, createContext, useContext, ReactNode } from "react";
import type { UserType } from "@/entities/user/model";
import ApplicationLayout from "./ApplicationLayout";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { refreshTokenThunk } from "@/entities/user/api/UserApiThunk";
import { setUser as setUserAction } from "@/entities/user/slice/userSlice";

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
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const setUser: React.Dispatch<React.SetStateAction<UserType | null>> = (value) => {
    const nextUser = typeof value === "function" ? value(user) : value;
    dispatch(setUserAction(nextUser));
  };

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

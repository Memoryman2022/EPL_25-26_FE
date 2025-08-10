// Context.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  _id: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  authLoaded: boolean; // <-- NEW
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  authLoaded: false,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");

    if (token && userId && userEmail) {
      setUser({ _id: userId, email: userEmail });
    } else {
      setUser(null);
    }

    setAuthLoaded(true); // ✅ Mark auth as loaded
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, authLoaded }}>
      {children}
    </UserContext.Provider>
  );
};

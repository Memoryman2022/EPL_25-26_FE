// Context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type User = {
  _id: string;
  email: string;
  userName: string;
  role: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  authLoaded: boolean;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  authLoaded: false,
  logout: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  const logout = () => {
    // Clear all authentication data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");

    // Clear user state
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");

    if (token && userId && userEmail) {
      setUser({
        _id: userId,
        email: userEmail,
        userName: userName || "",
        role: userRole || "user",
      });
    } else {
      setUser(null);
    }

    setAuthLoaded(true); // ✅ Mark auth as loaded
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, authLoaded, logout }}>
      {children}
    </UserContext.Provider>
  );
};

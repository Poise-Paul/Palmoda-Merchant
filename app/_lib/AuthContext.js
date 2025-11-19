"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedData = localStorage.getItem("vendor_auth");

    if (savedData) {
      const parsed = JSON.parse(savedData);
      setUser(parsed);
      setToken(parsed.token);
      setIsAuthenticated(true);
    }
  }, []);

  // Login function (call this after API login)
  const login = (authData) => {
  if (!authData || !authData.data) return;

  // Save entire vendor info
  localStorage.setItem("vendor_auth", JSON.stringify(authData.data));

  // Save token separately for easy access
  localStorage.setItem("token", authData.data.token);

  setUser(authData.data);
  setToken(authData.data.token);
  setIsAuthenticated(true);

  router.push("/");
};


  // Logout function
  const logout = () => {
    localStorage.removeItem("vendor_auth");
    setUser(null);
    setToken("");
    setIsAuthenticated(false);

    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

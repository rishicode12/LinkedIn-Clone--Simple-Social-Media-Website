import React, { useEffect, useState } from "react";
import { setAuthToken } from "../utils/api";
import { AuthContext } from "./AuthContext.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user") || sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || sessionStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setAuthToken(token);
    } else {
      localStorage.removeItem("token");
      setAuthToken(null);
    }
  }, [token]);

  function login({ user: nextUser, token: nextToken, remember = true }) {
    setUser(nextUser);
    setToken(nextToken);
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(nextUser));
    storage.setItem("token", nextToken);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  }

  const value = React.useMemo(() => ({ user, token, login, logout, setUser }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}



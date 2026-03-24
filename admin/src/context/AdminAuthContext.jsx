import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((response) => {
        if (response.data.user.role === "admin") {
          setAdmin(response.data.user);
        } else {
          localStorage.removeItem("admin_token");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (payload) => {
    const response = await api.post("/auth/login", payload);

    if (response.data.user.role !== "admin") {
      throw new Error("This account does not have admin access.");
    }

    localStorage.setItem("admin_token", response.data.token);
    setAdmin(response.data.user);
    return response.data.user;
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, setAdmin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

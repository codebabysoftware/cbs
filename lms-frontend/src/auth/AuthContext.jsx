import { createContext, useEffect, useState } from "react";
import API, { setAuthToken, clearToken } from "../api/api";

/**
 * CONTEXT
 */
export const AuthContext = createContext();

/**
 * UTIL: Decode JWT
 */
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

/**
 * PROVIDER
 */
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
    loading: true,
  });

  /**
   * LOAD USER FROM LOCAL STORAGE
   */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setAuthToken(token);

      const user = decodeToken(token);

      setAuth({
        token,
        user,
        loading: false,
      });
    } else {
      setAuth({
        token: null,
        user: null,
        loading: false,
      });
    }
  }, []);

  /**
   * LOGIN
   */
  const login = async (username, password) => {
    const res = await API.post("/login/", {
      username,
      password,
    });

    const token = res.data.access;

    setAuthToken(token);

    const user = decodeToken(token);

    setAuth({
      token,
      user,
      loading: false,
    });

    return user;
  };

  /**
   * LOGOUT
   */
  const logout = () => {
    clearToken();

    setAuth({
      token: null,
      user: null,
      loading: false,
    });
  };

  /**
   * CONTEXT VALUE
   */
  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        user: auth.user,
        loading: auth.loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
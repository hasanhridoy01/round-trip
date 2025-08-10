"use client";

import React, { createContext, useReducer, useEffect } from "react";
import authReducer from "./authReducer";

export const AuthContext = createContext();

const initialAuthState = {
  token: null,
  refresh_token: null,
  isAuthenticated: false, 
};

export default function AuthContextProvider({ children }) {
  const [travel_auth, dispatch] = useReducer(
    authReducer,
    initialAuthState,
    () => {
      if (typeof window !== "undefined") {
        try {
          const localData = localStorage.getItem("token");
          if (!localData) return initialAuthState;

          const parsedData = JSON.parse(localData);
          return {
            ...parsedData,
            isAuthenticated: !!parsedData.token, 
          };
        } catch (error) {
          console.error("Failed to parse auth data:", error);
          return initialAuthState;
        }
      }
      return initialAuthState;
    }
  );

  const login = (tokenData) => {
    console.log(tokenData);
    dispatch({
      type: "LOGIN",
      payload: {
        token: tokenData,
        isAuthenticated: true,
      },
    });
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    dispatch({ type: "LOGOUT", payload: initialAuthState });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", JSON.stringify(travel_auth));
    }
  }, [travel_auth]);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        travel_auth,
        isAuthenticated: travel_auth.isAuthenticated, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
import React, { createContext, useReducer, useEffect } from "react";
// import axios from "axios";

import authReducer from "./authReducer";

export const AuthContext = createContext();

export default function AuthContextProvider(props) {
  const [travel_auth, dispatch] = useReducer(authReducer, {}, () => {
    const localData = localStorage.getItem("travel_auth");
    return localData ? JSON.parse(localData) : {};
  });

  const login = async (data) => {
    dispatch({
      type: "LOGIN",
      payload: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      },
    });
  };

  const logout = () => {
    localStorage.setItem("timer", "");
    dispatch({
      type: "LOGOUT",
      payload: {},
    });
  };

  useEffect(() => {
    localStorage.setItem("travel_auth", JSON.stringify(travel_auth));
  }, [login]);

  return (
    <AuthContext.Provider value={{ login, travel_auth, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}

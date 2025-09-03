import React from "react";

export type AuthCtx = {
  isLoggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
};

export const AuthContext = React.createContext<AuthCtx>({
  isLoggedIn: false,
  setLoggedIn: () => {},
});

import { createContext } from "react";

const AuthContext = createContext({
  token: null,
  userId: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export default AuthContext;

import React, { createContext } from "react";

interface AuthContextProps {
  token: string | null;
  userId: number | null;
  login: (jwtToken: string, id: number) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext: React.Context<AuthContextProps> = createContext(
  {} as AuthContextProps
);

export default AuthContext;

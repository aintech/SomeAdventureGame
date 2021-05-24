import { Context, createContext } from "react";

export type AuthProps = {
  userId: number | null;
  token: string | null;
};

type AuthContextProps = {
  userId: number | null;
  token: string | null;
  login: (jwtToken: string, id: number) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext: Context<AuthContextProps> = createContext(
  {} as AuthContextProps
);

export default AuthContext;

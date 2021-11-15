import { Context, createContext } from "react";
import { Store } from "redux";

export interface AuthProps {
  userId?: number;
  token?: string;
}

interface AuthContextProps extends AuthProps {
  login: (jwtToken: string, id: number) => void;
  logout: (store?: Store) => void;
  isAuthenticated: boolean;
}

const AuthContext: Context<AuthContextProps> = createContext({} as AuthContextProps);

export default AuthContext;

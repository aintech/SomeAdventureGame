import { Context, createContext } from "react";

export interface AuthProps {
  userId?: number;
  token?: string;
}

interface AuthContextProps extends AuthProps {
  login: (jwtToken: string, id: number) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext: Context<AuthContextProps> = createContext({} as AuthContextProps);

export default AuthContext;

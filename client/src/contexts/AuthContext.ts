import { Context, createContext } from "react";

export interface AuthProps {
  userId: number | null;
  token: string | null;
}

interface AuthContextProps extends AuthProps {
  login: (jwtToken: string, id: number) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext: Context<AuthContextProps> = createContext(
  {} as AuthContextProps
);

export default AuthContext;

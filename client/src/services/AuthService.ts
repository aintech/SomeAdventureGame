import { AuthProps } from "../contexts/AuthContext";
import LoginForm from "../models/LoginForm";
import sendHttp from "./SendHttp";

const baseUrl = "/api/auth";

const register = async (form: LoginForm) => {
  return await sendHttp<AuthProps>(`${baseUrl}/register`, undefined, [], "POST", {
    ...form,
  });
};

const login = async (form: LoginForm) => {
  return await sendHttp<AuthProps>(`${baseUrl}/login`, undefined, [], "POST", {
    ...form,
  });
};

export { register, login };

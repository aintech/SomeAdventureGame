import { AuthProps } from "../contexts/auth-context";
import LoginForm from "../models/LoginForm";
import sendHttp from "./SendHttp";

const baseUrl = "/api/auth";

const register = async (form: LoginForm) => {
  return await sendHttp<AuthProps>(`${baseUrl}/register`, null, "POST", {
    ...form,
  });
};

const login = async (form: LoginForm) => {
  return await sendHttp<AuthProps>(`${baseUrl}/login`, null, "POST", {
    ...form,
  });
};

export { register, login };

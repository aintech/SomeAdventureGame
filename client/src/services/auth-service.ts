import LoginForm from "../models/LoginForm";
import sendHttp from "./send-http";

const baseUrl = "/api/auth";

const register = async (form: LoginForm) => {
  return await sendHttp(`${baseUrl}/register`, null, "POST", {
    ...form,
  });
};

const login = async (form: LoginForm) => {
  return await sendHttp(`${baseUrl}/login`, null, "POST", {
    ...form,
  });
};

export { register, login };

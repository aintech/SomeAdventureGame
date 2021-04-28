import sendHttp from "./send-http";

const baseUrl = "/api/auth";

const register = async (form) => {
  return await sendHttp(`${baseUrl}/register`, null, "POST", {
    ...form,
  });
};

const login = async (form) => {
  return await sendHttp(`${baseUrl}/login`, null, "POST", {
    ...form,
  });
};

export { register, login };

import sendHttp from "./send-http";

const baseUrl = "/api/auth";

const register = async (form) => {
  return await sendHttp(`${baseUrl}/register`, "POST", {
    ...form,
  });
};

const login = async (form) => {
  return await sendHttp(`${baseUrl}/login`, "POST", {
    ...form,
  });
};

export { register, login };

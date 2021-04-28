import sendHttp from "./send-http";

const baseUrl = "/api/stats";

const getStats = async (userId, token) => {
  return await sendHttp(`${baseUrl}/${userId}`, token);
};

export { getStats };

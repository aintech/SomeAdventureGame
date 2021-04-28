import sendHttp from "./send-http";

const baseUrl = "/api/heroes";

const getHeroes = async (userId, token) => {
  return await sendHttp(`${baseUrl}/${userId}`, token);
};

export { getHeroes };

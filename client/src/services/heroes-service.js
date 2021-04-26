import sendHttp from "./send-http";

const baseUrl = "/api/data/heroes";

const getHeroes = async (userId, token) => {
  return await sendHttp(`${baseUrl}/${userId}`, "GET", null, {
    Authorization: `Bearer ${token}`,
  });
};

export { getHeroes };

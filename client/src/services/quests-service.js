import sendHttp from "./send-http";

const baseUrl = "/api/quests";

const getQuests = async (userId, token) => {
  return await sendHttp(`${baseUrl}/${userId}`, token);
};

const embarkOnQuest = async (userId, token, questId, heroIds) => {
  const body = { questId, heroIds };
  return await sendHttp(`${baseUrl}/embark/${userId}`, token, "POST", body);
};

const completeQuest = async (userId, token, questId, heroIds) => {
  const body = { questId, heroIds };
  return await sendHttp(`${baseUrl}/complete/${userId}`, token, "POST", body);
};

export { getQuests, embarkOnQuest, completeQuest };

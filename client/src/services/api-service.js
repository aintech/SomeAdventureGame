import { getHeroes } from "./heroes-service.js";
import { completeQuest, embarkOnQuest, getQuests } from "./quests-service.js";
import { getStats } from "./stats-service.js";

export default class ApiService {
  getGameStats(auth) {
    return getStats(auth.userId, auth.token);
  }

  getQuests(auth) {
    return getQuests(auth.userId, auth.token);
  }

  getHeroes(auth) {
    return getHeroes(auth.userId, auth.token);
  }

  embarkHeroesOnQuest(auth, quest, assignedHeroes) {
    return embarkOnQuest(
      auth.userId,
      auth.token,
      quest.id,
      assignedHeroes.map((h) => h.id)
    );
  }

  completeQuest(auth, quest, heroes) {
    return completeQuest(
      auth.userId,
      auth.token,
      quest.id,
      heroes.map((h) => h.id)
    );
  }
}

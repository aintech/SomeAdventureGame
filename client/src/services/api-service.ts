import { AuthProps } from "../contexts/auth-context.js";
import Hero from "../models/Hero.js";
import Quest from "../models/Quest.js";
import { getHeroes } from "./heroes-service.js";
import { completeQuest, embarkOnQuest, getQuests } from "./quests-service.js";
import { getStats } from "./stats-service.js";

export default class ApiService {
  getGameStats(auth: AuthProps) {
    return getStats(auth.userId, auth.token);
  }

  getQuests(auth: AuthProps) {
    return getQuests(auth.userId, auth.token);
  }

  getHeroes(auth: AuthProps) {
    return getHeroes(auth.userId, auth.token);
  }

  embarkHeroesOnQuest(auth: AuthProps, quest: Quest, assignedHeroes: Hero[]) {
    return embarkOnQuest(
      auth.userId,
      auth.token,
      quest.id,
      assignedHeroes.map((h) => h.id)
    );
  }

  completeQuest(auth: AuthProps, quest: Quest, heroes: Hero[]) {
    return completeQuest(
      auth.userId,
      auth.token,
      quest.id,
      heroes.map((h) => h.id)
    );
  }
}

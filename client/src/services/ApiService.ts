import { AuthProps } from "../contexts/AuthContext";
import Hero from "../models/Hero";
import Quest from "../models/Quest";
import { getHeroes, getTavernPatrons } from "./HeroesService";
import { completeQuest, embarkOnQuest, getQuests } from "./QuestsService";
import { getStats } from "./StatsService";

export default class ApiService {
  getGameStats(auth: AuthProps) {
    return getStats(auth);
  }

  getQuests(auth: AuthProps) {
    return getQuests(auth);
  }

  getHeroes(auth: AuthProps) {
    return getHeroes(auth);
  }

  getTavernPatrons(auth: AuthProps) {
    return getTavernPatrons(auth);
  }

  embarkHeroesOnQuest(auth: AuthProps, quest: Quest, assignedHeroes: Hero[]) {
    return embarkOnQuest(
      auth,
      quest.id,
      assignedHeroes.map((h) => h.id)
    );
  }

  completeQuest(auth: AuthProps, quest: Quest, heroes: Hero[]) {
    return completeQuest(
      auth,
      quest.id,
      heroes.map((h) => h.id)
    );
  }
}

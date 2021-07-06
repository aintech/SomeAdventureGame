import { AuthProps } from "../contexts/AuthContext";
import Hero from "../models/hero/Hero";
import { HeroActivityType } from "../models/hero/HeroActivityType";
import Quest from "../models/Quest";
import QuestCheckpoint from "../models/QuestCheckpoint";
import {
  dismissHero,
  getHeroes,
  getTavernPatrons,
  hireHero,
  updateHeroActivities,
} from "./HeroesService";
import {
  checkpointPassed,
  completeQuest,
  embarkOnQuest,
  getQuests,
} from "./QuestsService";
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

  checkpointPassed(auth: AuthProps, quest: Quest, checkpoint: QuestCheckpoint) {
    return checkpointPassed(auth, quest.id, checkpoint.id);
  }

  completeQuest(auth: AuthProps, quest: Quest, heroes: Hero[]) {
    return completeQuest(
      auth,
      quest.id,
      heroes.map((h) => h.id)
    );
  }

  hireHero(auth: AuthProps, hero: Hero) {
    return hireHero(auth, hero);
  }

  dismissHero(auth: AuthProps, hero: Hero) {
    return dismissHero(auth, hero);
  }

  updateHeroActivities(
    auth: AuthProps,
    activities: { heroId: number; type: HeroActivityType }[]
  ) {
    return updateHeroActivities(auth, activities);
  }
}

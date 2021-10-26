import { AuthProps } from "../contexts/AuthContext";
import { BuildingType } from "../models/Building";
import Hero from "../models/hero/Hero";
import { HeroActivityType } from "../models/hero/HeroActivity";
import Quest from "../models/Quest";
import { getBuildings, startBuildingUpgrade } from "./BuildingService";
import { dismissHero, getHeroes, getTavernPatrons, hireHero, updateHeroActivities } from "./HeroService";
import {
  cancelQuest,
  checkpointPassed,
  CheckpointPassedBody,
  completeQuest,
  embarkOnQuest,
  getQuests,
} from "./QuestService";
import { getAlchemistAssortment, getMarketAssortment } from "./ShopService";
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

  getBuildings(auth: AuthProps) {
    return getBuildings(auth);
  }

  getTavernPatrons(auth: AuthProps) {
    return getTavernPatrons(auth);
  }

  getMarketAssortment(auth: AuthProps) {
    return getMarketAssortment(auth);
  }

  getAlchemistAssortment(auth: AuthProps) {
    return getAlchemistAssortment(auth);
  }

  embarkHeroesOnQuest(auth: AuthProps, quest: Quest, assignedHeroes: Hero[]) {
    return embarkOnQuest(
      auth,
      quest.id,
      assignedHeroes.map((h) => h.id)
    );
  }

  checkpointPassed(auth: AuthProps, quest: Quest, result: CheckpointPassedBody) {
    return checkpointPassed(auth, quest.id, result);
  }

  completeQuest(auth: AuthProps, quest: Quest) {
    return completeQuest(auth, quest.id);
  }

  cancelQuest(auth: AuthProps, quest: Quest) {
    return cancelQuest(auth, quest.id);
  }

  hireHero(auth: AuthProps, hero: Hero) {
    return hireHero(auth, hero);
  }

  dismissHero(auth: AuthProps, hero: Hero) {
    return dismissHero(auth, hero);
  }

  updateHeroActivities(auth: AuthProps, activities: { heroId: number; type: HeroActivityType }[]) {
    return updateHeroActivities(auth, activities);
  }

  startBuildingUpgrade(auth: AuthProps, type: BuildingType) {
    return startBuildingUpgrade(auth, type);
  }
}

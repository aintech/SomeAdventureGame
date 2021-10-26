import {
  alchemistAssortmentLoaded,
  alchemistAssortmentRequested,
  buildingsLoaded,
  buildingsRequested,
  buildingUpgradeStarted,
  cancelQuest,
  checkpointPassed,
  completeQuest,
  gameStatsLoaded,
  gameStatsRequested,
  heroActivitiesUpdated,
  heroDismissed,
  heroesEmbarkedOnQuest,
  heroesLoaded,
  heroesRequested,
  heroHired,
  marketAssortmentLoaded,
  marketAssortmentRequested,
  questsLoaded,
  questsRequested,
  tavernPatronsLoaded,
  tavernPatronsRequested,
} from "../actions/Actions";
import { AuthProps } from "../contexts/AuthContext";
import { BuildingType } from "../models/Building";
import Hero from "../models/hero/Hero";
import { HeroActivityType } from "../models/hero/HeroActivity";
import Quest from "../models/Quest";
import ApiService from "../services/ApiService";
import { CheckpointPassedBody } from "../services/QuestService";

export const fetchGameStats = (apiService: ApiService, auth: AuthProps) => () => (dispatch: any) => {
  dispatch(gameStatsRequested);
  apiService.getGameStats(auth).then((data) => dispatch(gameStatsLoaded(data)));
};

export const fetchInitials = (apiService: ApiService, auth: AuthProps) => () => (dispatch: any) => {
  apiService
    .getQuests(auth)
    .then((data) => dispatch(questsLoaded(data)))
    .then(() => apiService.getHeroes(auth))
    .then((data) => dispatch(heroesLoaded(data)))
    .then(() => apiService.getBuildings(auth))
    .then((data) => dispatch(buildingsLoaded(data)))
    .then(() => apiService.getTavernPatrons(auth))
    .then((data) => dispatch(tavernPatronsLoaded(data)))
    .then(() => apiService.getMarketAssortment(auth))
    .then((data) => dispatch(marketAssortmentLoaded(data)))
    .then(() => apiService.getAlchemistAssortment(auth))
    .then((data) => dispatch(alchemistAssortmentLoaded(data)));
};

export const fetchQuests = (apiService: ApiService, auth: AuthProps) => () => (dispatch: any) => {
  dispatch(questsRequested);
  apiService.getQuests(auth).then((data) => dispatch(questsLoaded(data)));
};

export const fetchHeroes = (apiService: ApiService, auth: AuthProps) => () => (dispatch: any) => {
  dispatch(heroesRequested);
  apiService.getHeroes(auth).then((data) => dispatch(heroesLoaded(data)));
};

export const fetchBuildings = (apiService: ApiService, auth: AuthProps) => () => (dispatch: any) => {
  dispatch(buildingsRequested);
  apiService.getBuildings(auth).then((data) => dispatch(buildingsLoaded(data)));
};

export const fetchTavernPatrons = (apiService: ApiService, auth: AuthProps) => () => (dispatch: any) => {
  dispatch(tavernPatronsRequested);
  apiService.getTavernPatrons(auth).then((data) => dispatch(tavernPatronsLoaded(data)));
};

export const fetchMarketAssortment = (apiService: ApiService, auth: AuthProps) => () => (dispatch: any) => {
  dispatch(marketAssortmentRequested);
  apiService.getMarketAssortment(auth).then((data) => dispatch(marketAssortmentLoaded(data)));
};

export const fetchAlchemistAssortment = (apiService: ApiService, auth: AuthProps) => () => (dispatch: any) => {
  dispatch(alchemistAssortmentRequested);
  apiService.getAlchemistAssortment(auth).then((data) => dispatch(alchemistAssortmentLoaded(data)));
};

export const embarkHeroesOnQuest =
  (apiService: ApiService, auth: AuthProps) => (quest: Quest, assignedHeroes: Hero[]) => (dispatch: any) => {
    apiService.embarkHeroesOnQuest(auth, quest, assignedHeroes).then((data) => dispatch(heroesEmbarkedOnQuest(data)));
  };

export const onCheckpointPassed =
  (apiService: ApiService, auth: AuthProps) => (quest: Quest, checkpoint: CheckpointPassedBody) => (dispatch: any) => {
    apiService.checkpointPassed(auth, quest, checkpoint).then((data) => dispatch(checkpointPassed(data)));
  };

export const onCompleteQuest = (apiService: ApiService, auth: AuthProps) => (quest: Quest) => (dispatch: any) => {
  apiService.completeQuest(auth, quest).then((data) => dispatch(completeQuest(data)));
};

export const onCancelQuest = (apiService: ApiService, auth: AuthProps) => (quest: Quest) => (dispatch: any) => {
  apiService.cancelQuest(auth, quest).then((data) => dispatch(cancelQuest(data)));
};

export const onHireHero = (apiService: ApiService, auth: AuthProps) => (hero: Hero) => (dispatch: any) => {
  apiService.hireHero(auth, hero).then((data) => dispatch(heroHired(data)));
};

export const onDismissHero = (apiService: ApiService, auth: AuthProps) => (hero: Hero) => (dispatch: any) => {
  apiService.dismissHero(auth, hero).then((data) => dispatch(heroDismissed(data)));
};

export const onHeroActivities =
  (apiService: ApiService, auth: AuthProps) =>
  (activities: { heroId: number; type: HeroActivityType }[]) =>
  (dispatch: any) => {
    apiService.updateHeroActivities(auth, activities).then((data) => dispatch(heroActivitiesUpdated(data)));
  };

export const onStartBuildingUpgrade =
  (apiService: ApiService, auth: AuthProps) => (type: BuildingType) => (dispatch: any) => {
    apiService.startBuildingUpgrade(auth, type).then((data) => dispatch(buildingUpgradeStarted(data)));
  };

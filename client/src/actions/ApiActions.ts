import {
  checkpointPassed,
  completeQuest,
  gameStatsLoaded,
  gameStatsRequested,
  heroesEmbarkedOnQuest,
  heroesLoaded,
  heroesRequested,
  heroHired,
  heroActivitiesUpdated,
  questsLoaded,
  questsRequested,
  tavernPatronsLoaded,
  tavernPatronsRequested,
} from "../actions/Actions";
import { AuthProps } from "../contexts/AuthContext";
import Hero from "../models/hero/Hero";
import { HeroActivityType } from "../models/hero/HeroActivityType";
import Quest from "../models/Quest";
import QuestCheckpoint from "../models/QuestCheckpoint";
import ApiService from "../services/ApiService";

export const fetchGameStats =
  (apiService: ApiService, auth: AuthProps) => () => (dispatch: any) => {
    dispatch(gameStatsRequested);
    apiService
      .getGameStats(auth)
      .then((data) => dispatch(gameStatsLoaded(data)));
  };

export const fetchInitials =
  (apiService: ApiService, auth: AuthProps) => () => (dispatch: any) => {
    apiService
      .getQuests(auth)
      .then((data) => dispatch(questsLoaded(data)))
      .then(() => apiService.getHeroes(auth))
      .then((data) => dispatch(heroesLoaded(data)))
      .then(() => apiService.getTavernPatrons(auth))
      .then((data) => dispatch(tavernPatronsLoaded(data)));
  };

export const fetchQuests =
  (apiService: ApiService, auth: AuthProps) => () => (dispatch: any) => {
    dispatch(questsRequested);
    apiService.getQuests(auth).then((data) => dispatch(questsLoaded(data)));
  };

export const fetchHeroes =
  (apiService: ApiService, auth: AuthProps) => () => (dispatch: any) => {
    dispatch(heroesRequested);
    apiService.getHeroes(auth).then((data) => dispatch(heroesLoaded(data)));
  };

export const fetchTavernPatrons =
  (apiService: ApiService, auth: AuthProps) => () => (dispatch: any) => {
    dispatch(tavernPatronsRequested);
    apiService
      .getTavernPatrons(auth)
      .then((data) => dispatch(tavernPatronsLoaded(data)));
  };

export const embarkHeroesOnQuest =
  (apiService: ApiService, auth: AuthProps) =>
  (quest: Quest, assignedHeroes: Hero[]) =>
  (dispatch: any) => {
    apiService
      .embarkHeroesOnQuest(auth, quest, assignedHeroes)
      .then((data) => dispatch(heroesEmbarkedOnQuest(data)));
  };

export const onCheckpointPassed =
  (apiService: ApiService, auth: AuthProps) =>
  (quest: Quest, checkpoint: QuestCheckpoint) =>
  (dispatch: any) => {
    apiService
      .checkpointPassed(auth, quest, checkpoint)
      .then((data) => dispatch(checkpointPassed(data)));
  };

export const onCompleteQuest =
  (apiService: ApiService, auth: AuthProps) =>
  (quest: Quest, heroes: Hero[]) =>
  (dispatch: any) => {
    apiService
      .completeQuest(auth, quest, heroes)
      .then((data) => dispatch(completeQuest(data)));
  };

export const onHireHero =
  (apiService: ApiService, auth: AuthProps) =>
  (hero: Hero) =>
  (dispatch: any) => {
    apiService.hireHero(auth, hero).then((data) => dispatch(heroHired(data)));
  };

export const onHeroActivities =
  (apiService: ApiService, auth: AuthProps) =>
  (activities: { heroId: number; type: HeroActivityType }[]) =>
  (dispatch: any) => {
    apiService
      .updateHeroActivities(auth, activities)
      .then((data) => dispatch(heroActivitiesUpdated(data)));
  };

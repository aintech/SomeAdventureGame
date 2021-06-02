import { AuthProps } from "../contexts/AuthContext";
import ApiService from "../services/ApiService";
import {
  gameStatsRequested,
  gameStatsLoaded,
  questsRequested,
  questsLoaded,
  heroesRequested,
  heroesLoaded,
  heroesEmbarkedOnQuest,
  completeQuest,
  tavernPatronsRequested,
  tavernPatronsLoaded,
  heroHired,
  checkpointPassed,
} from "../actions/Actions";
import Quest from "../models/Quest";
import Hero from "../models/Hero";
import QuestCheckpoint from "../models/QuestCheckpoint";

export const fetchGameStats =
  (apiService: ApiService) => (auth: AuthProps) => (dispatch: any) => {
    dispatch(gameStatsRequested);
    apiService
      .getGameStats(auth)
      .then((data) => dispatch(gameStatsLoaded(data)));
  };

export const fetchQuests =
  (apiService: ApiService) => (auth: AuthProps) => (dispatch: any) => {
    dispatch(questsRequested);
    apiService.getQuests(auth).then((data) => dispatch(questsLoaded(data)));
  };

export const fetchHeroes =
  (apiService: ApiService) => (auth: AuthProps) => (dispatch: any) => {
    dispatch(heroesRequested);
    apiService.getHeroes(auth).then((data) => dispatch(heroesLoaded(data)));
  };

export const fetchTavernPatrons =
  (apiService: ApiService) => (auth: AuthProps) => (dispatch: any) => {
    dispatch(tavernPatronsRequested);
    apiService
      .getTavernPatrons(auth)
      .then((data) => dispatch(tavernPatronsLoaded(data)));
  };

export const embarkHeroesOnQuest =
  (apiService: ApiService) =>
  (auth: AuthProps, quest: Quest, assignedHeroes: Hero[]) =>
  (dispatch: any) => {
    apiService
      .embarkHeroesOnQuest(auth, quest, assignedHeroes)
      .then((data) => dispatch(heroesEmbarkedOnQuest(data)));
  };

export const onCheckpointPassed =
  (apiService: ApiService) =>
  (auth: AuthProps, quest: Quest, checkpoint: QuestCheckpoint) =>
  (dispatch: any) => {
    apiService
      .checkpointPassed(auth, quest, checkpoint)
      .then((data) => dispatch(checkpointPassed(data)));
  };

export const onCompleteQuest =
  (apiService: ApiService) =>
  (auth: AuthProps, quest: Quest, heroes: Hero[]) =>
  (dispatch: any) => {
    apiService
      .completeQuest(auth, quest, heroes)
      .then((data) => dispatch(completeQuest(data)));
  };

export const onHireHero =
  (apiService: ApiService) =>
  (auth: AuthProps, hero: Hero) =>
  (dispatch: any) => {
    apiService.hireHero(auth, hero).then((data) => dispatch(heroHired(data)));
  };

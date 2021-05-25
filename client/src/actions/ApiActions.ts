import { AuthProps } from "../contexts/auth-context";
import ApiService from "../services/api-service";
import {
  gameStatsRequested,
  gameStatsLoaded,
  questsRequested,
  questsLoaded,
  heroesRequested,
  heroesLoaded,
  heroesEmbarkedOnQuest,
  completeQuest,
} from "../actions/Actions";
import Quest from "../models/Quest";
import Hero from "../models/Hero";

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

export const embarkHeroesOnQuest =
  (apiService: ApiService) =>
  (auth: AuthProps, quest: Quest, assignedHeroes: Hero[]) =>
  (dispatch: any) => {
    apiService
      .embarkHeroesOnQuest(auth, quest, assignedHeroes)
      .then((data) => dispatch(heroesEmbarkedOnQuest(data)));
  };

export const onCompleteQuest =
  (apiService: ApiService) =>
  (auth: AuthProps, quest: Quest, heroes: Hero[]) =>
  (dispatch: any) => {
    apiService
      .completeQuest(auth, quest, heroes)
      .then((data) => dispatch(completeQuest(data)));
  };

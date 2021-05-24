import { AuthProps } from "../contexts/auth-context";
import Building from "../models/Building";
import Hero from "../models/Hero";
import Quest from "../models/Quest";
import ApiService from "../services/api-service";

const gameStatsRequested = () => {
  return {
    type: "FETCH_GAME_STATS_REQUEST",
  };
};

type GameStats = {
  gold: number;
  fame: number;
};

const gameStatsLoaded = (stats: GameStats) => {
  return {
    type: "FETCH_GAME_STATS_SUCCESS",
    payload: stats,
  };
};

const questsRequested = () => {
  return {
    type: "FETCH_QUESTS_REQUEST",
  };
};

const questsLoaded = (quests: Quest[]) => {
  return {
    type: "FETCH_QUESTS_SUCCESS",
    payload: quests,
  };
};

const heroesRequested = () => {
  return {
    type: "FETCH_HEROES_REQUESTED",
  };
};

const heroesLoaded = (heroes: Hero[]) => {
  return {
    type: "FETCH_HEROES_SUCCESS",
    payload: heroes,
  };
};

const buildingClicked = (building: Building | null) => {
  return {
    type: "BUILDING_CLICKED",
    payload: building,
  };
};

const questScrollChoosed = (quest: Quest) => {
  return {
    type: "QUEST_SCROLL_CHOOSED",
    payload: quest,
  };
};

const questScrollClosed = () => {
  return {
    type: "QUEST_SCROLL_CLOSED",
  };
};

const heroStatsChoosed = (hero: Hero) => {
  return {
    type: "HERO_STATS_CHOOSED",
    payload: hero,
  };
};

const heroStatsClosed = () => {
  return {
    type: "HERO_STATS_CLOSED",
  };
};

const heroAssignedToQuest = (hero: Hero) => {
  return {
    type: "HERO_ASSIGNED_TO_QUEST",
    payload: hero,
  };
};

const heroDismissedFromQuest = (hero: Hero) => {
  return {
    type: "HERO_DISMISSED_FROM_QUEST",
    payload: hero,
  };
};

const heroesEmbarkedOnQuest = (embarkedQuestAndHeroes: any) => {
  return {
    type: "HEROES_EMBARKED_ON_QUEST",
    payload: embarkedQuestAndHeroes,
  };
};

const collectingQuestReward = (quest: Quest) => {
  return {
    type: "COLLECTING_QUEST_REWARD",
    payload: quest,
  };
};

const completeQuest = (payload: any) => {
  return {
    type: "COMPLETE_QUEST",
    payload: payload,
  };
};

const fetchGameStats =
  (apiService: ApiService) => (auth: AuthProps) => (dispatch: any) => {
    dispatch(gameStatsRequested);
    apiService
      .getGameStats(auth)
      .then((data) => dispatch(gameStatsLoaded(data)));
  };

const fetchQuests =
  (apiService: ApiService) => (auth: AuthProps) => (dispatch: any) => {
    dispatch(questsRequested);
    apiService.getQuests(auth).then((data) => dispatch(questsLoaded(data)));
  };

const fetchHeroes =
  (apiService: ApiService) => (auth: AuthProps) => (dispatch: any) => {
    dispatch(heroesRequested);
    apiService.getHeroes(auth).then((data) => dispatch(heroesLoaded(data)));
  };

const embarkHeroesOnQuest =
  (apiService: ApiService) =>
  (auth: AuthProps, quest: Quest, assignedHeroes: Hero[]) =>
  (dispatch: any) => {
    apiService
      .embarkHeroesOnQuest(auth, quest, assignedHeroes)
      .then((data) => dispatch(heroesEmbarkedOnQuest(data)));
  };

const onCompleteQuest =
  (apiService: ApiService) =>
  (auth: AuthProps, quest: Quest, heroes: Hero[]) =>
  (dispatch: any) => {
    apiService
      .completeQuest(auth, quest, heroes)
      .then((data) => dispatch(completeQuest(data)));
  };

export {
  fetchGameStats,
  fetchQuests,
  fetchHeroes,
  buildingClicked,
  questScrollChoosed,
  questScrollClosed,
  heroStatsChoosed,
  heroStatsClosed,
  heroAssignedToQuest,
  heroDismissedFromQuest,
  embarkHeroesOnQuest,
  collectingQuestReward,
  onCompleteQuest,
};

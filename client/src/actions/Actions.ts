import Building from "../models/Building";
import GameStats from "../models/GameStats";
import Hero from "../models/Hero";
import Quest from "../models/Quest";
import { HeroResponse } from "../services/HeroesService";
import { ActionType } from "./ActionType";

export type Action = {
  type: ActionType;
  payload?: any;
};

export const gameStatsRequested = (): Action => {
  return {
    type: ActionType.FETCH_GAME_STATS_REQUEST,
  };
};

export const gameStatsLoaded = (stats: GameStats): Action => {
  return {
    type: ActionType.FETCH_GAME_STATS_SUCCESS,
    payload: stats,
  };
};

export const questsRequested = (): Action => {
  return {
    type: ActionType.FETCH_QUESTS_REQUEST,
  };
};

export const questsLoaded = (quests: any): Action => {
  return {
    type: ActionType.FETCH_QUESTS_SUCCESS,
    payload: quests,
  };
};

export const heroesRequested = (): Action => {
  return {
    type: ActionType.FETCH_HEROES_REQUEST,
  };
};

export const heroesLoaded = (heroes: HeroResponse): Action => {
  return {
    type: ActionType.FETCH_HEROES_SUCCESS,
    payload: heroes,
  };
};

export const buildingClicked = (building: Building | null): Action => {
  return {
    type: ActionType.BUILDING_CLICKED,
    payload: building,
  };
};

export const questScrollChoosed = (quest: Quest): Action => {
  return {
    type: ActionType.QUEST_SCROLL_CHOOSED,
    payload: quest,
  };
};

export const questScrollClosed = (): Action => {
  return {
    type: ActionType.QUEST_SCROLL_CLOSED,
  };
};

export const heroStatsChoosed = (hero: Hero): Action => {
  return {
    type: ActionType.HERO_STATS_CHOOSED,
    payload: hero,
  };
};

export const heroStatsClosed = (): Action => {
  return {
    type: ActionType.HERO_STATS_CLOSED,
  };
};

export const heroAssignedToQuest = (hero: Hero): Action => {
  return {
    type: ActionType.HERO_ASSIGNED_TO_QUEST,
    payload: hero,
  };
};

export const heroDismissedFromQuest = (hero: Hero): Action => {
  return {
    type: ActionType.HERO_DISMISSED_FROM_QUEST,
    payload: hero,
  };
};

export const heroesEmbarkedOnQuest = (embarkedQuestAndHeroes: any): Action => {
  return {
    type: ActionType.HEROES_EMBARKED_ON_QUEST,
    payload: embarkedQuestAndHeroes,
  };
};

export const collectingQuestReward = (quest: Quest): Action => {
  return {
    type: ActionType.COLLECTING_QUEST_REWARD,
    payload: quest,
  };
};

export const completeQuest = (payload: any): Action => {
  return {
    type: ActionType.COMPLETE_QUEST,
    payload: payload,
  };
};

import { Action } from "redux";
import Building from "../models/Building";
import GameStats from "../models/GameStats";
import Hero from "../models/Hero";
import Quest from "../models/Quest";
import { HeroResponse } from "../services/HeroesService";
import {
  CompleteQuestResponse,
  EmbarkOnQuestResponse,
  QuestResponse,
} from "../services/QuestsService";
import { ActionType } from "./ActionType";

export interface PayloadedAction extends Action<ActionType> {
  payload?: any;
}

export const gameStatsRequested = (): PayloadedAction => {
  return {
    type: ActionType.FETCH_GAME_STATS_REQUEST,
  };
};

export const gameStatsLoaded = (stats: GameStats): PayloadedAction => {
  return {
    type: ActionType.FETCH_GAME_STATS_SUCCESS,
    payload: stats,
  };
};

export const questsRequested = (): PayloadedAction => {
  return {
    type: ActionType.FETCH_QUESTS_REQUEST,
  };
};

export const questsLoaded = (quests: QuestResponse[]): PayloadedAction => {
  return {
    type: ActionType.FETCH_QUESTS_SUCCESS,
    payload: quests,
  };
};

export const heroesRequested = (): PayloadedAction => {
  return {
    type: ActionType.FETCH_HEROES_REQUEST,
  };
};

export const heroesLoaded = (heroes: HeroResponse[]): PayloadedAction => {
  return {
    type: ActionType.FETCH_HEROES_SUCCESS,
    payload: heroes,
  };
};

export const buildingClicked = (building: Building | null): PayloadedAction => {
  return {
    type: ActionType.BUILDING_CLICKED,
    payload: building,
  };
};

export const questScrollChoosed = (quest: Quest): PayloadedAction => {
  return {
    type: ActionType.QUEST_SCROLL_CHOOSED,
    payload: quest,
  };
};

export const questScrollClosed = (): PayloadedAction => {
  return {
    type: ActionType.QUEST_SCROLL_CLOSED,
  };
};

export const heroStatsChoosed = (hero: Hero): PayloadedAction => {
  return {
    type: ActionType.HERO_STATS_CHOOSED,
    payload: hero,
  };
};

export const heroStatsClosed = (): PayloadedAction => {
  return {
    type: ActionType.HERO_STATS_CLOSED,
  };
};

export const heroAssignedToQuest = (hero: Hero): PayloadedAction => {
  return {
    type: ActionType.HERO_ASSIGNED_TO_QUEST,
    payload: hero,
  };
};

export const heroDismissedFromQuest = (hero: Hero): PayloadedAction => {
  return {
    type: ActionType.HERO_DISMISSED_FROM_QUEST,
    payload: hero,
  };
};

export const heroesEmbarkedOnQuest = (
  embarkedQuestAndHeroes: EmbarkOnQuestResponse
): PayloadedAction => {
  return {
    type: ActionType.HEROES_EMBARKED_ON_QUEST,
    payload: embarkedQuestAndHeroes,
  };
};

export const collectingQuestReward = (quest: Quest): PayloadedAction => {
  return {
    type: ActionType.COLLECTING_QUEST_REWARD,
    payload: quest,
  };
};

export const completeQuest = (
  payload: CompleteQuestResponse
): PayloadedAction => {
  return {
    type: ActionType.COMPLETE_QUEST,
    payload: payload,
  };
};

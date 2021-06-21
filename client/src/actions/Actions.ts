import { Action } from "redux";
import { Message } from "../components/message-popup/MessagePopup";
import Building from "../models/Building";
import GameStats from "../models/GameStats";
import Hero from "../models/hero/Hero";
import Quest from "../models/Quest";
import { HeroResponse, HireHeroResponse } from "../services/HeroesService";
import {
  CheckpointPassedResponse,
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

export const tavernPatronsRequested = (): PayloadedAction => {
  return {
    type: ActionType.FETCH_TAVERN_PATRONS_REQUEST,
  };
};

export const tavernPatronsLoaded = (
  patrons: HeroResponse[]
): PayloadedAction => {
  return {
    type: ActionType.FETCH_TAVERN_PATRONS_SUCCESS,
    payload: patrons,
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

export const checkpointPassed = (embarked: CheckpointPassedResponse) => {
  return {
    type: ActionType.CHECKPOINT_PASSED,
    payload: embarked,
  };
};

export const collectingQuestReward = (quest: Quest): PayloadedAction => {
  return {
    type: ActionType.COLLECTING_QUEST_REWARD,
    payload: quest,
  };
};

export const completeQuest = (
  questResponse: CompleteQuestResponse
): PayloadedAction => {
  return {
    type: ActionType.COMPLETE_QUEST,
    payload: questResponse,
  };
};

export const showUserMessage = (message: Message): PayloadedAction => {
  return {
    type: ActionType.SHOW_USER_MESSAGE,
    payload: message,
  };
};

export const dismissUserMessage = (id: number): PayloadedAction => {
  return {
    type: ActionType.DISMISS_USER_MESSAGE,
    payload: id,
  };
};

export const heroHired = (hiredResult: HireHeroResponse): PayloadedAction => {
  return {
    type: ActionType.HERO_HIRED,
    payload: hiredResult,
  };
};

export const heroOccupationUpdated = (hero: HeroResponse): PayloadedAction => {
  return {
    type: ActionType.HERO_OCCUPATION_UPDATED,
    payload: hero,
  };
};
